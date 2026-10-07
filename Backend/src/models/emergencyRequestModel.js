const pool = require("../config/db");

/*
|--------------------------------------------------------------------------
| HELPER - FORMAT LOCATION
|--------------------------------------------------------------------------
*/

const formatLocation = (row) => {
    if (
        row.latitude === null ||
        row.latitude === undefined ||
        row.longitude === null ||
        row.longitude === undefined
    ) {
        row.location = null;
    } else {
        row.location = {
            latitude: Number(row.latitude),
            longitude: Number(row.longitude)
        };
    }

    delete row.latitude;
    delete row.longitude;

    return row;
};


/*
|--------------------------------------------------------------------------
| CREATE EMERGENCY REQUEST
|--------------------------------------------------------------------------
*/

const createEmergencyRequest = async (userId, requestData) => {

    const client = await pool.connect();

    try {
        await client.query("BEGIN");

        /*
        |--------------------------------------------------------------------------
        | Create emergency request
        |--------------------------------------------------------------------------
        */

        const requestResult = await client.query(
            `
            INSERT INTO emergency_requests (
                user_id,
                status,
                address_line,
                city,
                state,
                pincode,
                location,
                description
            )
            VALUES (
                $1,
                'ACTIVE',
                $2,
                $3,
                $4,
                $5,
                CASE
                    WHEN $6::double precision IS NOT NULL
                     AND $7::double precision IS NOT NULL
                    THEN ST_SetSRID(
                        ST_MakePoint($7, $6),
                        4326
                    )::geography
                    ELSE NULL
                END,
                $8
            )
            RETURNING
                id,
                user_id,
                status,
                address_line,
                city,
                state,
                pincode,
                description,
                ST_Y(location::geometry) AS latitude,
                ST_X(location::geometry) AS longitude,
                donor_buffer_minutes,
                donor_arrival_deadline,
                ambulance_buffer_minutes,
                ambulance_arrival_deadline,
                created_at,
                updated_at
            `,
            [
                userId,
                requestData.requestAddress || null,
                requestData.city || null,
                requestData.state || null,
                requestData.pincode || null,
                requestData.latitude ?? null,
                requestData.longitude ?? null,
                requestData.description || null
            ]
        );

        const request = formatLocation(requestResult.rows[0]);

        /*
        |--------------------------------------------------------------------------
        | Create emergency request items
        |--------------------------------------------------------------------------
        */

        const createdItems = [];

        for (const item of requestData.resources) {

            const itemResult = await client.query(
                `
                INSERT INTO emergency_request_items (
                    request_id,
                    resource_type,
                    blood_group,
                    blood_component,
                    quantity,
                    ambulance_type,
                    status
                )
                VALUES (
                    $1,
                    $2,
                    $3,
                    $4,
                    $5,
                    $6,
                    'PENDING'
                )
                RETURNING
                    id,
                    request_id,
                    resource_type,
                    blood_group,
                    blood_component,
                    quantity,
                    ambulance_type,
                    status,
                    created_at,
                    updated_at
                `,
                [
                    request.id,
                    item.resourceType,
                    item.bloodGroup || null,
                    item.bloodComponent || null,
                    item.quantity,
                    item.ambulanceType || null
                ]
            );

            createdItems.push(itemResult.rows[0]);
        }

        await client.query("COMMIT");

        return {
            ...request,
            resources: createdItems
        };

    } catch (error) {

        await client.query("ROLLBACK");
        throw error;

    } finally {

        client.release();
    }
};


/*
|--------------------------------------------------------------------------
| GET SINGLE EMERGENCY REQUEST
|--------------------------------------------------------------------------
*/

const findEmergencyRequestById = async (requestId, userId) => {

    const requestResult = await pool.query(
        `
        SELECT
            id,
            user_id,
            status,
            address_line,
            city,
            state,
            pincode,
            description,
            ST_Y(location::geometry) AS latitude,
            ST_X(location::geometry) AS longitude,
            donor_buffer_minutes,
            donor_arrival_deadline,
            ambulance_buffer_minutes,
            ambulance_arrival_deadline,
            created_at,
            updated_at
        FROM emergency_requests
        WHERE id = $1
          AND user_id = $2
        `,
        [
            requestId,
            userId
        ]
    );

    if (requestResult.rows.length === 0) {
        return null;
    }

    const request = formatLocation(requestResult.rows[0]);

    /*
    |--------------------------------------------------------------------------
    | Get resource items
    |--------------------------------------------------------------------------
    */

    const itemsResult = await pool.query(
        `
        SELECT
            id,
            request_id,
            resource_type,
            blood_group,
            blood_component,
            quantity,
            ambulance_type,
            status,
            created_at,
            updated_at
        FROM emergency_request_items
        WHERE request_id = $1
        ORDER BY id
        `,
        [requestId]
    );

    request.resources = itemsResult.rows;

    return request;
};


/*
|--------------------------------------------------------------------------
| GET EMERGENCY REQUEST STATUS
|--------------------------------------------------------------------------
*/

const getEmergencyRequestStatus = async (requestId, userId) => {

    const requestResult = await pool.query(
        `
        SELECT
            id,
            status,
            address_line,
            city,
            state,
            pincode,
            description,
            ST_Y(location::geometry) AS latitude,
            ST_X(location::geometry) AS longitude,
            created_at,
            updated_at
        FROM emergency_requests
        WHERE id = $1
          AND user_id = $2
        `,
        [
            requestId,
            userId
        ]
    );

    if (requestResult.rows.length === 0) {
        return null;
    }

    const request = formatLocation(requestResult.rows[0]);

    /*
    |--------------------------------------------------------------------------
    | Get resource status
    |--------------------------------------------------------------------------
    */

    const itemsResult = await pool.query(
        `
        SELECT
            id,
            resource_type,
            blood_group,
            blood_component,
            quantity,
            ambulance_type,
            status
        FROM emergency_request_items
        WHERE request_id = $1
        ORDER BY id
        `,
        [requestId]
    );

    request.resources = itemsResult.rows;

    return request;
};


/*
|--------------------------------------------------------------------------
| GET PROVIDER RESPONSES
|--------------------------------------------------------------------------
*/

const getRequestResponses = async (requestId, userId) => {

    /*
    |--------------------------------------------------------------------------
    | Verify request belongs to user
    |--------------------------------------------------------------------------
    */

    const requestResult = await pool.query(
        `
        SELECT id
        FROM emergency_requests
        WHERE id = $1
          AND user_id = $2
        `,
        [
            requestId,
            userId
        ]
    );

    if (requestResult.rows.length === 0) {
        throw new Error("Emergency request not found");
    }


    /*
    |--------------------------------------------------------------------------
    | DONOR RESPONSES
    |--------------------------------------------------------------------------
    */

    const donorResponses = await pool.query(
        `
        SELECT
            dr.id,
            dr.request_item_id,
            dr.donor_id AS provider_id,
            'DONOR' AS provider_type,
            dr.status,
            dr.response_message,
            dr.estimated_arrival_minutes,
            dr.responded_at,
            dr.arrived_at,
            dr.completed_at,
            dr.rating,
            dr.feedback,
            dr.created_at,
            dr.updated_at
        FROM donor_request_responses dr
        JOIN emergency_request_items eri
            ON eri.id = dr.request_item_id
        WHERE eri.request_id = $1
        ORDER BY dr.created_at
        `,
        [requestId]
    );


    /*
    |--------------------------------------------------------------------------
    | HOSPITAL RESPONSES
    |--------------------------------------------------------------------------
    */

    const hospitalResponses = await pool.query(
        `
        SELECT
            hr.id,
            hr.request_item_id,
            hr.hospital_id AS provider_id,
            'HOSPITAL' AS provider_type,
            hr.status,
            hr.response_message,
            hr.quantity_offered,
            hr.estimated_arrival_minutes,
            hr.buffer_minutes,
            hr.arrival_deadline,
            hr.responded_at,
            hr.arrived_at,
            hr.completed_at,
            hr.created_at,
            hr.updated_at
        FROM hospital_request_responses hr
        JOIN emergency_request_items eri
            ON eri.id = hr.request_item_id
        WHERE eri.request_id = $1
        ORDER BY hr.created_at
        `,
        [requestId]
    );


    /*
    |--------------------------------------------------------------------------
    | BLOOD BANK RESPONSES
    |--------------------------------------------------------------------------
    */

    const bloodBankResponses = await pool.query(
        `
        SELECT
            br.id,
            br.request_item_id,
            br.blood_bank_id AS provider_id,
            'BLOOD_BANK' AS provider_type,
            br.status,
            br.response_message,
            br.units_offered,
            br.estimated_arrival_minutes,
            br.buffer_minutes,
            br.arrival_deadline,
            br.responded_at,
            br.arrived_at,
            br.completed_at,
            br.created_at,
            br.updated_at
        FROM blood_bank_request_responses br
        JOIN emergency_request_items eri
            ON eri.id = br.request_item_id
        WHERE eri.request_id = $1
        ORDER BY br.created_at
        `,
        [requestId]
    );


    /*
    |--------------------------------------------------------------------------
    | AMBULANCE RESPONSES
    |--------------------------------------------------------------------------
    */

    const ambulanceResponses = await pool.query(
        `
        SELECT
            ar.id,
            ar.request_item_id,
            ar.ambulance_id AS provider_id,
            'AMBULANCE' AS provider_type,
            ar.status,
            ar.response_message,
            ar.estimated_arrival_minutes,
            ar.responded_at,
            ar.arrived_at,
            ar.completed_at,
            ar.created_at,
            ar.updated_at
        FROM ambulance_request_responses ar
        JOIN emergency_request_items eri
            ON eri.id = ar.request_item_id
        WHERE eri.request_id = $1
        ORDER BY ar.created_at
        `,
        [requestId]
    );


    return [
        ...donorResponses.rows,
        ...hospitalResponses.rows,
        ...bloodBankResponses.rows,
        ...ambulanceResponses.rows
    ];
};


/*
|--------------------------------------------------------------------------
| GET EMERGENCY REQUEST HISTORY
|--------------------------------------------------------------------------
*/

const getEmergencyRequestHistory = async (userId) => {

    const result = await pool.query(
        `
        SELECT
            er.id,
            er.status,
            er.address_line,
            er.city,
            er.state,
            er.pincode,
            er.description,
            ST_Y(er.location::geometry) AS latitude,
            ST_X(er.location::geometry) AS longitude,
            er.created_at,
            er.updated_at,
            COUNT(eri.id)::integer AS resource_count
        FROM emergency_requests er
        LEFT JOIN emergency_request_items eri
            ON eri.request_id = er.id
        WHERE er.user_id = $1
        GROUP BY
            er.id,
            er.status,
            er.address_line,
            er.city,
            er.state,
            er.pincode,
            er.description,
            er.location,
            er.created_at,
            er.updated_at
        ORDER BY er.created_at DESC
        `,
        [userId]
    );

    return result.rows.map(formatLocation);
};


/*
|--------------------------------------------------------------------------
| SEND REQUEST TO SELECTED PROVIDERS
|--------------------------------------------------------------------------
*/

const createProviderRequests = async (
    requestItemId,
    userId,
    providers
) => {

    if (!Array.isArray(providers) || providers.length === 0) {
        throw new Error("At least one provider is required");
    }

    if (providers.length > 3) {
        throw new Error("Maximum 3 providers can be selected");
    }

    const client = await pool.connect();

    try {

        await client.query("BEGIN");


        /*
        |--------------------------------------------------------------------------
        | Verify request item belongs to user
        |--------------------------------------------------------------------------
        */

        const itemResult = await client.query(
            `
            SELECT
                eri.id,
                eri.request_id,
                eri.resource_type,
                er.user_id
            FROM emergency_request_items eri
            JOIN emergency_requests er
                ON er.id = eri.request_id
            WHERE eri.id = $1
              AND er.user_id = $2
            `,
            [
                requestItemId,
                userId
            ]
        );

        if (itemResult.rows.length === 0) {
            throw new Error("Emergency request item not found");
        }

        const item = itemResult.rows[0];


        /*
        |--------------------------------------------------------------------------
        | Provider compatibility
        |--------------------------------------------------------------------------
        */

        const allowedProviders = {
            BLOOD: ["DONOR", "BLOOD_BANK"],
            ICU: ["HOSPITAL"],
            OXYGEN: ["HOSPITAL"],
            AMBULANCE: ["AMBULANCE"]
        };

        if (!allowedProviders[item.resource_type]) {
            throw new Error("Invalid resource type");
        }


        /*
        |--------------------------------------------------------------------------
        | Validate providers
        |--------------------------------------------------------------------------
        */

        for (const provider of providers) {

            const providerType =
                String(provider.providerType || "").toUpperCase();

            const providerId = Number(provider.providerId);

            if (!allowedProviders[item.resource_type].includes(providerType)) {
                throw new Error(
                    `${providerType} cannot provide ${item.resource_type}`
                );
            }

            if (!Number.isInteger(providerId) || providerId <= 0) {
                throw new Error("Invalid provider ID");
            }
        }


        /*
        |--------------------------------------------------------------------------
        | Insert provider requests
        |--------------------------------------------------------------------------
        */

        const createdProviders = [];

        for (const provider of providers) {

            const providerType =
                String(provider.providerType).toUpperCase();

            const providerId =
                Number(provider.providerId);


            const providerRequestResult = await client.query(
                `
                INSERT INTO provider_requests (
                    request_item_id,
                    provider_type,
                    provider_id,
                    sent_at,
                    selected,
                    selected_at,
                    confirmed_at,
                    journey_started_at
                )
                VALUES (
                    $1,
                    $2,
                    $3,
                    NOW(),
                    false,
                    NULL,
                    NULL,
                    NULL
                )
                ON CONFLICT (
                    request_item_id,
                    provider_type,
                    provider_id
                )
                DO UPDATE SET
                    sent_at = NOW()
                RETURNING *
                `,
                [
                    requestItemId,
                    providerType,
                    providerId
                ]
            );

            const providerRequest =
                providerRequestResult.rows[0];

            createdProviders.push(providerRequest);


            /*
            |--------------------------------------------------------------------------
            | Create provider response
            |--------------------------------------------------------------------------
            */

            if (providerType === "DONOR") {

                await client.query(
                    `
                    INSERT INTO donor_request_responses (
                        request_item_id,
                        donor_id,
                        status
                    )
                    VALUES (
                        $1,
                        $2,
                        'PENDING'
                    )
                    ON CONFLICT (
                        request_item_id,
                        donor_id
                    )
                    DO NOTHING
                    `,
                    [
                        requestItemId,
                        providerId
                    ]
                );

            } else if (providerType === "HOSPITAL") {

                await client.query(
                    `
                    INSERT INTO hospital_request_responses (
                        request_item_id,
                        hospital_id,
                        status
                    )
                    VALUES (
                        $1,
                        $2,
                        'PENDING'
                    )
                    ON CONFLICT (
                        request_item_id,
                        hospital_id
                    )
                    DO NOTHING
                    `,
                    [
                        requestItemId,
                        providerId
                    ]
                );

            } else if (providerType === "BLOOD_BANK") {

                await client.query(
                    `
                    INSERT INTO blood_bank_request_responses (
                        request_item_id,
                        blood_bank_id,
                        status
                    )
                    VALUES (
                        $1,
                        $2,
                        'PENDING'
                    )
                    ON CONFLICT (
                        request_item_id,
                        blood_bank_id
                    )
                    DO NOTHING
                    `,
                    [
                        requestItemId,
                        providerId
                    ]
                );

            } else if (providerType === "AMBULANCE") {

                await client.query(
                    `
                    INSERT INTO ambulance_request_responses (
                        request_item_id,
                        ambulance_id,
                        status
                    )
                    VALUES (
                        $1,
                        $2,
                        'PENDING'
                    )
                    ON CONFLICT (
                        request_item_id,
                        ambulance_id
                    )
                    DO NOTHING
                    `,
                    [
                        requestItemId,
                        providerId
                    ]
                );
            }
        }

        await client.query("COMMIT");

        return {
            requestItemId,
            providers: createdProviders
        };

    } catch (error) {

        await client.query("ROLLBACK");
        throw error;

    } finally {

        client.release();
    }
};


/*
|--------------------------------------------------------------------------
| CONFIRM PROVIDER
|--------------------------------------------------------------------------
*/

const confirmProvider = async (providerRequestId, userId) => {
    const client = await pool.connect();

    try {
        await client.query("BEGIN");

        // 1. Get provider request + verify ownership
        const providerResult = await client.query(
            `
            SELECT
                pr.id,
                pr.request_item_id,
                pr.provider_type,
                pr.provider_id,
                pr.selected
            FROM provider_requests pr
            JOIN emergency_request_items eri
                ON eri.id = pr.request_item_id
            JOIN emergency_requests er
                ON er.id = eri.request_id
            WHERE pr.id = $1
              AND er.user_id = $2
            FOR UPDATE
            `,
            [providerRequestId, userId]
        );

        if (providerResult.rows.length === 0) {
            throw new Error("Provider request not found");
        }

        const providerRequest = providerResult.rows[0];

        // 2. Check if another provider is already confirmed
        const confirmedResult = await client.query(
            `
            SELECT id
            FROM provider_requests
            WHERE request_item_id = $1
              AND confirmed_at IS NOT NULL
            LIMIT 1
            `,
            [providerRequest.request_item_id]
        );

        if (confirmedResult.rows.length > 0) {
            throw new Error("A provider has already been confirmed for this request");
        }

        // 3. Mark selected provider as confirmed and start journey
        await client.query(
            `
            UPDATE provider_requests
            SET
                selected = TRUE,
                selected_at = NOW(),
                confirmed_at = NOW(),
                journey_started_at = NOW()
            WHERE id = $1
            `,
            [providerRequestId]
        );

        // 4. Expire all OTHER provider requests
        await client.query(
            `
            UPDATE provider_requests
            SET
                selected = FALSE,
                selected_at = NULL
            WHERE request_item_id = $1
              AND id <> $2
            `,
            [
                providerRequest.request_item_id,
                providerRequestId
            ]
        );

        // 5. Expire all OTHER provider responses
        const expireMessage =
            "Another provider has been selected for this request.";

        switch (providerRequest.provider_type) {

            case "DONOR":
                await client.query(
                    `
                    UPDATE donor_request_responses
                    SET
                        status = 'EXPIRED',
                        response_message = $1,
                        updated_at = NOW()
                    WHERE request_item_id = $2
                      AND NOT (
                          donor_id = $3
                      )
                      AND status IN ('PENDING', 'ACCEPTED')
                    `,
                    [
                        expireMessage,
                        providerRequest.request_item_id,
                        providerRequest.provider_id
                    ]
                );
                break;

            case "HOSPITAL":
                await client.query(
                    `
                    UPDATE hospital_request_responses
                    SET
                        status = 'EXPIRED',
                        response_message = $1,
                        updated_at = NOW()
                    WHERE request_item_id = $2
                      AND hospital_id <> $3
                      AND status IN ('PENDING', 'ACCEPTED')
                    `,
                    [
                        expireMessage,
                        providerRequest.request_item_id,
                        providerRequest.provider_id
                    ]
                );
                break;

            case "BLOOD_BANK":
                await client.query(
                    `
                    UPDATE blood_bank_request_responses
                    SET
                        status = 'EXPIRED',
                        response_message = $1,
                        updated_at = NOW()
                    WHERE request_item_id = $2
                      AND blood_bank_id <> $3
                      AND status IN ('PENDING', 'ACCEPTED')
                    `,
                    [
                        expireMessage,
                        providerRequest.request_item_id,
                        providerRequest.provider_id
                    ]
                );
                break;

            case "AMBULANCE":
                await client.query(
                    `
                    UPDATE ambulance_request_responses
                    SET
                        status = 'EXPIRED',
                        response_message = $1,
                        updated_at = NOW()
                    WHERE request_item_id = $2
                      AND ambulance_id <> $3
                      AND status IN ('PENDING', 'ACCEPTED')
                    `,
                    [
                        expireMessage,
                        providerRequest.request_item_id,
                        providerRequest.provider_id
                    ]
                );
                break;

            default:
                throw new Error(
                    `Invalid provider type: ${providerRequest.provider_type}`
                );
        }

        await client.query("COMMIT");

        return {
            success: true,
            message: "Provider confirmed and other providers expired",
            providerRequestId: providerRequest.id,
            requestItemId: providerRequest.request_item_id,
            providerType: providerRequest.provider_type,
            providerId: providerRequest.provider_id
        };

    } catch (error) {
        await client.query("ROLLBACK");
        throw error;
    } finally {
        client.release();
    }
};

const completeResourceRequest = async (itemId, userId) => {
    const client = await pool.connect();

    try {
        await client.query("BEGIN");

        // 1. Verify that this resource item belongs to the logged-in user
        const itemResult = await client.query(
            `
            SELECT
                eri.id,
                eri.request_id,
                eri.resource_type,
                eri.status
            FROM emergency_request_items eri
            JOIN emergency_requests er
                ON er.id = eri.request_id
            WHERE eri.id = $1
              AND er.user_id = $2
            FOR UPDATE
            `,
            [itemId, userId]
        );

        if (itemResult.rows.length === 0) {
            throw new Error("Resource request not found");
        }

        const item = itemResult.rows[0];

        // 2. Check current status
        if (item.status === "COMPLETED") {
            throw new Error("This resource request is already completed");
        }

        if (item.status !== "ARRIVED") {
            throw new Error(
                "Resource request can be completed only after it has arrived"
            );
        }

        // 3. Mark this resource as COMPLETED
        await client.query(
            `
            UPDATE emergency_request_items
            SET
                status = 'COMPLETED',
                updated_at = NOW()
            WHERE id = $1
            `,
            [itemId]
        );

        // 4. Check whether all resources are completed
        const remainingResult = await client.query(
            `
            SELECT COUNT(*) AS remaining
            FROM emergency_request_items
            WHERE request_id = $1
              AND status <> 'COMPLETED'
            `,
            [item.request_id]
        );

        const remaining = Number(remainingResult.rows[0].remaining);

        // 5. If all resources are completed, complete the emergency request
        if (remaining === 0) {
            await client.query(
                `
                UPDATE emergency_requests
                SET
                    status = 'COMPLETED',
                    updated_at = NOW()
                WHERE id = $1
                `,
                [item.request_id]
            );
        }

        await client.query("COMMIT");

        return {
            success: true,
            message: "Resource request completed successfully",
            requestItemId: item.id,
            resourceType: item.resource_type,
            requestId: item.request_id,
            resourceRequestStatus: "COMPLETED",
            emergencyRequestStatus:
                remaining === 0 ? "COMPLETED" : "ACTIVE"
        };

    } catch (error) {
        await client.query("ROLLBACK");
        throw error;
    } finally {
        client.release();
    }
};



/*
|--------------------------------------------------------------------------
| EXPORTS
|--------------------------------------------------------------------------
*/

module.exports = {
    createEmergencyRequest,
    findEmergencyRequestById,
    getEmergencyRequestStatus,
    getRequestResponses,
    getEmergencyRequestHistory,
    createProviderRequests,
    confirmProvider,
    completeResourceRequest
};