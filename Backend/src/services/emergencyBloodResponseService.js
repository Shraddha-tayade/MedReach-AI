const pool = require("../config/db");


/*
===========================================================
ETA HELPER 1
GET BLOOD BANK LOCATION
===========================================================
*/

const getBloodBankLocation = async (bloodBankId, client) => {

    const result = await client.query(
        `
        SELECT
            id,
            blood_bank_name,
            ST_X(location::geometry) AS longitude,
            ST_Y(location::geometry) AS latitude
        FROM public.blood_banks
        WHERE id = $1
        `,
        [bloodBankId]
    );

    if (result.rows.length === 0) {
        throw new Error("Blood Bank not found");
    }

    const bloodBank = result.rows[0];

    const latitude = Number(bloodBank.latitude);
    const longitude = Number(bloodBank.longitude);

    if (
        !Number.isFinite(latitude) ||
        !Number.isFinite(longitude)
    ) {
        throw new Error(
            "Blood Bank location is not available for ETA calculation"
        );
    }

    return {
        id: bloodBank.id,
        bloodBankName: bloodBank.blood_bank_name,
        latitude,
        longitude
    };
};


/*
===========================================================
ETA HELPER 2
CALCULATE DISTANCE USING HAVERSINE FORMULA
===========================================================
*/

const calculateDistanceKm = (
    lat1,
    lon1,
    lat2,
    lon2
) => {

    const R = 6371;

    const dLat =
        (lat2 - lat1) * Math.PI / 180;

    const dLon =
        (lon2 - lon1) * Math.PI / 180;

    const a =
        Math.sin(dLat / 2) *
        Math.sin(dLat / 2) +

        Math.cos(lat1 * Math.PI / 180) *
        Math.cos(lat2 * Math.PI / 180) *

        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);

    const c =
        2 *
        Math.atan2(
            Math.sqrt(a),
            Math.sqrt(1 - a)
        );

    return R * c;
};


/*
===========================================================
ETA HELPER 3
CALCULATE ETA

Average speed = 30 km/hour
===========================================================
*/

const calculateEtaMinutes = (distanceKm) => {

    const averageSpeedKmPerHour = 30;

    const minutes =
        (distanceKm / averageSpeedKmPerHour) * 60;

    return Math.max(
        1,
        Math.ceil(minutes)
    );
};


/*
===========================================================
1. BLOOD BANK ACCEPT / REJECT EMERGENCY REQUEST
===========================================================
*/

const respondToEmergencyBloodRequest = async ({
    requestId,
    requestItemId,
    bloodBankId,
    status,
    responseMessage
}) => {

    const client = await pool.connect();

    try {

        await client.query("BEGIN");


        /*
        ---------------------------------------------------
        Verify emergency request item
        ---------------------------------------------------
        */

        const itemResult = await client.query(
            `
            SELECT
                eri.id,
                eri.request_id,
                eri.resource_type,
                eri.blood_group,
                eri.blood_component,
                eri.quantity

            FROM public.emergency_request_items eri

            WHERE eri.id = $1
              AND eri.request_id = $2

            FOR UPDATE
            `,
            [
                requestItemId,
                requestId
            ]
        );


        if (itemResult.rows.length === 0) {

            throw new Error(
                "Emergency blood request item not found"
            );
        }


        const item = itemResult.rows[0];


        if (item.resource_type !== "BLOOD") {

            throw new Error(
                "This request item is not a blood request"
            );
        }


        /*
        ---------------------------------------------------
        Verify provider request
        ---------------------------------------------------
        */

        const providerResult = await client.query(
            `
            SELECT
                id,
                selected

            FROM public.provider_requests

            WHERE request_item_id = $1
              AND provider_type = 'BLOOD_BANK'
              AND provider_id = $2

            FOR UPDATE
            `,
            [
                requestItemId,
                bloodBankId
            ]
        );


        if (providerResult.rows.length === 0) {

            throw new Error(
                "This emergency request was not sent to this blood bank"
            );
        }


        /*
        ---------------------------------------------------
        Check existing response
        ---------------------------------------------------
        */

        const responseResult = await client.query(
            `
            SELECT
                id,
                status

            FROM public.blood_bank_request_responses

            WHERE request_item_id = $1
              AND blood_bank_id = $2

            FOR UPDATE
            `,
            [
                requestItemId,
                bloodBankId
            ]
        );


        /*
        ===================================================
        ACCEPT
        ===================================================
        */

        if (status === "ACCEPTED") {

            if (responseResult.rows.length > 0) {

                const existing =
                    responseResult.rows[0];


                if (
                    existing.status === "ARRIVED" ||
                    existing.status === "COMPLETED"
                ) {

                    throw new Error(
                        `Cannot accept request because current status is ${existing.status}`
                    );
                }


                await client.query(
                    `
                    UPDATE public.blood_bank_request_responses

                    SET
                        status = 'ACCEPTED',
                        response_message = $2,
                        responded_at = NOW(),
                        updated_at = NOW()

                    WHERE id = $1
                    `,
                    [
                        existing.id,
                        responseMessage || null
                    ]
                );

            } else {

                await client.query(
                    `
                    INSERT INTO public.blood_bank_request_responses
                    (
                        request_item_id,
                        blood_bank_id,
                        status,
                        response_message,
                        responded_at,
                        created_at,
                        updated_at
                    )

                    VALUES
                    (
                        $1,
                        $2,
                        'ACCEPTED',
                        $3,
                        NOW(),
                        NOW(),
                        NOW()
                    )
                    `,
                    [
                        requestItemId,
                        bloodBankId,
                        responseMessage || null
                    ]
                );
            }
        }


        /*
        ===================================================
        REJECT
        ===================================================
        */

        else if (status === "REJECTED") {

            if (responseResult.rows.length > 0) {

                const existing =
                    responseResult.rows[0];


                if (
                    existing.status === "ARRIVED" ||
                    existing.status === "COMPLETED"
                ) {

                    throw new Error(
                        `Cannot reject request because current status is ${existing.status}`
                    );
                }


                await client.query(
                    `
                    UPDATE public.blood_bank_request_responses

                    SET
                        status = 'REJECTED',
                        response_message = $2,
                        responded_at = NOW(),
                        updated_at = NOW()

                    WHERE id = $1
                    `,
                    [
                        existing.id,
                        responseMessage || null
                    ]
                );

            } else {

                await client.query(
                    `
                    INSERT INTO public.blood_bank_request_responses
                    (
                        request_item_id,
                        blood_bank_id,
                        status,
                        response_message,
                        responded_at,
                        created_at,
                        updated_at
                    )

                    VALUES
                    (
                        $1,
                        $2,
                        'REJECTED',
                        $3,
                        NOW(),
                        NOW(),
                        NOW()
                    )
                    `,
                    [
                        requestItemId,
                        bloodBankId,
                        responseMessage || null
                    ]
                );
            }
        }

        else {

            throw new Error(
                "Status must be ACCEPTED or REJECTED"
            );
        }


        await client.query("COMMIT");


        return {

            success: true,

            message:
                status === "ACCEPTED"
                    ? "Emergency blood request accepted"
                    : "Emergency blood request rejected"
        };


    } catch (error) {

        await client.query("ROLLBACK");

        throw error;

    } finally {

        client.release();
    }
};


/*
===========================================================
2. USER CONFIRMED BLOOD BANK
   → RESERVE BLOOD
===========================================================
*/

const processConfirmedBloodBankSelection = async ({
    requestId,
    requestItemId,
    bloodBankId
}) => {

    const client = await pool.connect();

    try {

        await client.query("BEGIN");


        /*
        ---------------------------------------------------
        Get emergency request item + USER LOCATION
        ---------------------------------------------------
        */

        const itemResult = await client.query(
            `
            SELECT
                eri.id,
                eri.request_id,
                eri.resource_type,
                eri.blood_group,
                eri.blood_component,
                eri.quantity,

                ST_X(er.location::geometry)
                    AS user_longitude,

                ST_Y(er.location::geometry)
                    AS user_latitude

            FROM public.emergency_request_items eri

            INNER JOIN public.emergency_requests er
                ON er.id = eri.request_id

            WHERE eri.id = $1
              AND eri.request_id = $2

            FOR UPDATE
            `,
            [
                requestItemId,
                requestId
            ]
        );


        if (itemResult.rows.length === 0) {

            throw new Error(
                "Emergency blood request item not found"
            );
        }


        const item = itemResult.rows[0];


        if (item.resource_type !== "BLOOD") {

            throw new Error(
                "This request item is not a blood request"
            );
        }


        const requiredQuantity =
            Number(item.quantity);


        if (
            !requiredQuantity ||
            requiredQuantity <= 0
        ) {

            throw new Error(
                "Invalid blood quantity requested"
            );
        }


        /*
        ===================================================
        USER LOCATION FOR ETA
        ===================================================
        */

        const userLatitude =
            Number(item.user_latitude);

        const userLongitude =
            Number(item.user_longitude);


        if (
            !Number.isFinite(userLatitude) ||
            !Number.isFinite(userLongitude)
        ) {

            throw new Error(
                "User location is not available for ETA calculation"
            );
        }


        /*
        ---------------------------------------------------
        Verify Blood Bank provider request
        ---------------------------------------------------
        */

        const providerResult = await client.query(
            `
            SELECT
                id,
                selected,
                selected_at,
                confirmed_at

            FROM public.provider_requests

            WHERE request_item_id = $1
              AND provider_type = 'BLOOD_BANK'
              AND provider_id = $2

            FOR UPDATE
            `,
            [
                requestItemId,
                bloodBankId
            ]
        );


        if (providerResult.rows.length === 0) {

            throw new Error(
                "Provider request not found"
            );
        }


        const provider =
            providerResult.rows[0];


        if (!provider.selected) {

            throw new Error(
                "Blood Bank has not been selected by the user yet"
            );
        }


        /*
        ---------------------------------------------------
        Get Blood Bank response
        ---------------------------------------------------
        */

        const responseResult = await client.query(
            `
            SELECT
                id,
                status,
                units_offered,
                arrival_deadline

            FROM public.blood_bank_request_responses

            WHERE request_item_id = $1
              AND blood_bank_id = $2

            FOR UPDATE
            `,
            [
                requestItemId,
                bloodBankId
            ]
        );


        if (responseResult.rows.length === 0) {

            throw new Error(
                "Blood Bank response not found"
            );
        }


        const response =
            responseResult.rows[0];


        if (response.status !== "ACCEPTED") {

            throw new Error(
                `Blood Bank response is ${response.status}, not ACCEPTED`
            );
        }


        /*
        ---------------------------------------------------
        Prevent duplicate reservation
        ---------------------------------------------------
        */

        if (
            response.units_offered !== null ||
            response.arrival_deadline !== null
        ) {

            throw new Error(
                "Blood has already been reserved for this request"
            );
        }


        /*
        ===================================================
        FIFO INVENTORY RESERVATION
        ===================================================
        */

        const inventoryResult = await client.query(
            `
            SELECT
                id,
                blood_bank_id,
                blood_group,
                blood_component,
                batch_number,
                units_collected,
                units_available,
                units_reserved,
                collection_date,
                expiry_date,
                status

            FROM public.blood_inventory

            WHERE blood_bank_id = $1
              AND blood_group = $2
              AND blood_component = $3
              AND units_available >= $4
              AND expiry_date >= CURRENT_DATE
              AND status = 'AVAILABLE'

            ORDER BY
                collection_date ASC,
                id ASC

            LIMIT 1

            FOR UPDATE
            `,
            [
                bloodBankId,
                item.blood_group,
                item.blood_component,
                requiredQuantity
            ]
        );


        if (inventoryResult.rows.length === 0) {

            throw new Error(
                "Required blood quantity is not available in one FIFO batch"
            );
        }


        const inventory =
            inventoryResult.rows[0];


        /*
        ---------------------------------------------------
        RESERVE BLOOD
        ---------------------------------------------------
        */

        await client.query(
            `
            UPDATE public.blood_inventory

            SET
                units_available =
                    units_available - $1,

                units_reserved =
                    units_reserved + $1,

                updated_at = NOW(),

                status =
                    CASE
                        WHEN units_available - $1 = 0
                        THEN 'UNAVAILABLE'
                        ELSE 'AVAILABLE'
                    END

            WHERE id = $2
            `,
            [
                requiredQuantity,
                inventory.id
            ]
        );


        /*
        ===================================================
        ETA CALCULATION
        ===================================================
        */

        const bloodBank =
            await getBloodBankLocation(
                bloodBankId,
                client
            );


        const bloodBankLatitude =
            Number(bloodBank.latitude);

        const bloodBankLongitude =
            Number(bloodBank.longitude);


        if (
            !Number.isFinite(bloodBankLatitude) ||
            !Number.isFinite(bloodBankLongitude)
        ) {

            throw new Error(
                "Blood Bank location is not available for ETA calculation"
            );
        }


        /*
        ---------------------------------------------------
        Calculate distance
        ---------------------------------------------------
        */

        const distanceKm =
            calculateDistanceKm(
                userLatitude,
                userLongitude,
                bloodBankLatitude,
                bloodBankLongitude
            );


        /*
        ---------------------------------------------------
        Calculate ETA
        ---------------------------------------------------
        */

        const estimatedArrivalMinutes =
            calculateEtaMinutes(
                distanceKm
            );


        /*
        ---------------------------------------------------
        Buffer
        ---------------------------------------------------
        */

        const bufferMinutes = 10;


        /*
        ---------------------------------------------------
        Arrival deadline
        ---------------------------------------------------
        */

        const arrivalDeadline =
            new Date(
                Date.now() +
                (
                    estimatedArrivalMinutes +
                    bufferMinutes
                ) *
                60 *
                1000
            );


        /*
        ===================================================
        SAVE ETA
        ===================================================
        */

        await client.query(
            `
            UPDATE public.blood_bank_request_responses

            SET
                units_offered = $1,

                estimated_arrival_minutes = $2,

                buffer_minutes = $3,

                arrival_deadline = $4,

                updated_at = NOW()

            WHERE id = $5
            `,
            [
                requiredQuantity,
                estimatedArrivalMinutes,
                bufferMinutes,
                arrivalDeadline,
                response.id
            ]
        );


        await client.query("COMMIT");


        return {

            success: true,

            message:
                "Blood reserved successfully",

            reservation: {

                blood_group:
                    item.blood_group,

                blood_component:
                    item.blood_component,

                quantity:
                    requiredQuantity,

                inventory_id:
                    inventory.id,

                batch_number:
                    inventory.batch_number,

                distance_km:
                    Number(
                        distanceKm.toFixed(2)
                    ),

                estimated_arrival_minutes:
                    estimatedArrivalMinutes,

                buffer_minutes:
                    bufferMinutes,

                arrival_deadline:
                    arrivalDeadline
            }
        };


    } catch (error) {

        await client.query("ROLLBACK");

        throw error;

    } finally {

        client.release();
    }
};


/*
===========================================================
3. RELEASE RESERVATION
===========================================================
*/

const releaseBloodReservation = async (
    client,
    response
) => {

    const reservedQuantity =
        Number(response.units_offered);


    if (
        !reservedQuantity ||
        reservedQuantity <= 0
    ) {
        return;
    }


    /*
    ---------------------------------------------------
    Find FIFO matching reserved inventory
    ---------------------------------------------------
    */

    const inventoryResult =
        await client.query(
            `
            SELECT
                id

            FROM public.blood_inventory

            WHERE blood_bank_id = $1
              AND blood_group = $2
              AND blood_component = $3
              AND units_reserved >= $4

            ORDER BY
                collection_date ASC,
                id ASC

            LIMIT 1

            FOR UPDATE
            `,
            [
                response.blood_bank_id,
                response.blood_group,
                response.blood_component,
                reservedQuantity
            ]
        );


    if (inventoryResult.rows.length === 0) {

        throw new Error(
            "Reserved blood inventory could not be found"
        );
    }


    const inventoryId =
        inventoryResult.rows[0].id;


    await client.query(
        `
        UPDATE public.blood_inventory

        SET
            units_available =
                units_available + $1,

            units_reserved =
                units_reserved - $1,

            status = 'AVAILABLE',

            updated_at = NOW()

        WHERE id = $2
        `,
        [
            reservedQuantity,
            inventoryId
        ]
    );
};


/*
===========================================================
4. USER CANCELLATION
===========================================================
*/

const cancelEmergencyBloodRequest = async ({
    requestId,
    requestItemId,
    bloodBankId
}) => {

    const client = await pool.connect();

    try {

        await client.query("BEGIN");


        const responseResult =
            await client.query(
                `
                SELECT
                    bbr.id,
                    bbr.blood_bank_id,
                    bbr.status,
                    bbr.units_offered,
                    bbr.arrival_deadline,

                    eri.blood_group,
                    eri.blood_component

                FROM public.blood_bank_request_responses bbr

                INNER JOIN public.emergency_request_items eri
                    ON eri.id = bbr.request_item_id

                WHERE bbr.request_item_id = $1
                  AND eri.request_id = $2
                  AND bbr.blood_bank_id = $3

                FOR UPDATE
                `,
                [
                    requestItemId,
                    requestId,
                    bloodBankId
                ]
            );


        if (responseResult.rows.length === 0) {

            throw new Error(
                "Blood Bank response not found"
            );
        }


        const response =
            responseResult.rows[0];


        if (
            response.status !== "ACCEPTED"
        ) {

            throw new Error(
                `Cannot cancel request in ${response.status} status`
            );
        }


        if (response.units_offered) {

            await releaseBloodReservation(
                client,
                response
            );
        }


        await client.query(
            `
            UPDATE public.blood_bank_request_responses

            SET
                status = 'EXPIRED',

                response_message =
                    'Blood reservation cancelled',

                updated_at = NOW()

            WHERE id = $1
            `,
            [
                response.id
            ]
        );


        await client.query("COMMIT");


        return {

            success: true,

            message:
                "Blood reservation released successfully"
        };


    } catch (error) {

        await client.query("ROLLBACK");

        throw error;

    } finally {

        client.release();
    }
};


/*
===========================================================
5. MARK ARRIVED
===========================================================
*/

const markEmergencyBloodArrived = async ({
    requestId,
    requestItemId,
    bloodBankId
}) => {

    const client = await pool.connect();

    try {

        await client.query("BEGIN");


        /*
        ---------------------------------------------------
        Verify selected provider
        ---------------------------------------------------
        */

        const providerResult =
            await client.query(
                `
                SELECT
                    selected

                FROM public.provider_requests

                WHERE request_item_id = $1
                  AND provider_type = 'BLOOD_BANK'
                  AND provider_id = $2

                FOR UPDATE
                `,
                [
                    requestItemId,
                    bloodBankId
                ]
            );


        if (providerResult.rows.length === 0) {

            throw new Error(
                "Provider request not found"
            );
        }


        if (!providerResult.rows[0].selected) {

            throw new Error(
                "User has not selected this Blood Bank"
            );
        }


        /*
        ---------------------------------------------------
        Get response
        ---------------------------------------------------
        */

        const responseResult =
            await client.query(
                `
                SELECT
                    bbr.id,
                    bbr.status,
                    bbr.arrival_deadline

                FROM public.blood_bank_request_responses bbr

                INNER JOIN public.emergency_request_items eri
                    ON eri.id = bbr.request_item_id

                WHERE bbr.request_item_id = $1
                  AND eri.request_id = $2
                  AND bbr.blood_bank_id = $3

                FOR UPDATE
                `,
                [
                    requestItemId,
                    requestId,
                    bloodBankId
                ]
            );


        if (responseResult.rows.length === 0) {

            throw new Error(
                "Blood Bank response not found"
            );
        }


        const response =
            responseResult.rows[0];


        if (response.status !== "ACCEPTED") {

            throw new Error(
                `Cannot mark arrived because status is ${response.status}`
            );
        }


        /*
        ---------------------------------------------------
        Check deadline
        ---------------------------------------------------
        */

        if (
            response.arrival_deadline &&
            new Date(response.arrival_deadline) <= new Date()
        ) {

            const fullResponseResult =
                await client.query(
                    `
                    SELECT
                        bbr.id,
                        bbr.blood_bank_id,
                        bbr.units_offered,

                        eri.blood_group,
                        eri.blood_component

                    FROM public.blood_bank_request_responses bbr

                    INNER JOIN public.emergency_request_items eri
                        ON eri.id = bbr.request_item_id

                    WHERE bbr.id = $1

                    FOR UPDATE
                    `,
                    [
                        response.id
                    ]
                );


            const fullResponse =
                fullResponseResult.rows[0];


            await releaseBloodReservation(
                client,
                fullResponse
            );


            await client.query(
                `
                UPDATE public.blood_bank_request_responses

                SET
                    status = 'EXPIRED',

                    response_message =
                        'Arrival deadline expired',

                    updated_at = NOW()

                WHERE id = $1
                `,
                [
                    response.id
                ]
            );


            await client.query("COMMIT");


            return {

                success: false,

                expired: true,

                message:
                    "Arrival deadline has expired. Reserved blood was released."
            };
        }


        /*
        ---------------------------------------------------
        ARRIVED
        ---------------------------------------------------
        */

        await client.query(
            `
            UPDATE public.blood_bank_request_responses

            SET
                status = 'ARRIVED',

                arrived_at = NOW(),

                updated_at = NOW()

            WHERE id = $1
            `,
            [
                response.id
            ]
        );


        await client.query("COMMIT");


        return {

            success: true,

            message:
                "User marked as arrived successfully"
        };


    } catch (error) {

        await client.query("ROLLBACK");

        throw error;

    } finally {

        client.release();
    }
};


/*
===========================================================
6. ISSUE BLOOD
===========================================================
*/

const issueEmergencyBlood = async ({
    requestId,
    requestItemId,
    bloodBankId
}) => {

    const client = await pool.connect();

    try {

        await client.query("BEGIN");


        /*
        ---------------------------------------------------
        Get response + request item
        ---------------------------------------------------
        */

        const responseResult =
            await client.query(
                `
                SELECT
                    bbr.id,
                    bbr.status,
                    bbr.units_offered,

                    eri.blood_group,
                    eri.blood_component,
                    eri.quantity

                FROM public.blood_bank_request_responses bbr

                INNER JOIN public.emergency_request_items eri
                    ON eri.id = bbr.request_item_id

                WHERE bbr.request_item_id = $1
                  AND eri.request_id = $2
                  AND bbr.blood_bank_id = $3

                FOR UPDATE
                `,
                [
                    requestItemId,
                    requestId,
                    bloodBankId
                ]
            );


        if (responseResult.rows.length === 0) {

            throw new Error(
                "Blood Bank response not found"
            );
        }


        const response =
            responseResult.rows[0];


        if (response.status !== "ARRIVED") {

            throw new Error(
                `Blood cannot be issued because status is ${response.status}`
            );
        }


        const quantity =
            Number(response.units_offered);


        if (!quantity || quantity <= 0) {

            throw new Error(
                "Invalid reserved blood quantity"
            );
        }


        /*
        ---------------------------------------------------
        Find reserved inventory
        ---------------------------------------------------
        */

        const inventoryResult =
            await client.query(
                `
                SELECT
                    id,
                    units_available,
                    units_reserved

                FROM public.blood_inventory

                WHERE blood_bank_id = $1
                  AND blood_group = $2
                  AND blood_component = $3
                  AND units_reserved >= $4

                ORDER BY
                    collection_date ASC,
                    id ASC

                LIMIT 1

                FOR UPDATE
                `,
                [
                    bloodBankId,
                    response.blood_group,
                    response.blood_component,
                    quantity
                ]
            );


        if (inventoryResult.rows.length === 0) {

            throw new Error(
                "Reserved blood inventory not found"
            );
        }


        const inventory =
            inventoryResult.rows[0];


        /*
        ---------------------------------------------------
        ISSUE BLOOD

        reserved decreases.
        available remains unchanged.
        ---------------------------------------------------
        */

        await client.query(
            `
            UPDATE public.blood_inventory

            SET
                units_reserved =
                    units_reserved - $1,

                updated_at = NOW()

            WHERE id = $2
            `,
            [
                quantity,
                inventory.id
            ]
        );


        await client.query("COMMIT");


        return {

            success: true,

            message:
                "Blood issued successfully",

            issued_quantity:
                quantity,

            inventory_id:
                inventory.id
        };


    } catch (error) {

        await client.query("ROLLBACK");

        throw error;

    } finally {

        client.release();
    }
};


/*
===========================================================
7. AUTOMATIC EXPIRY / RELEASE
===========================================================
*/

const releaseExpiredBloodReservations =
    async () => {

        const client =
            await pool.connect();

        try {

            await client.query("BEGIN");


            const expiredResult =
                await client.query(
                    `
                    SELECT
                        bbr.id,
                        bbr.blood_bank_id,
                        bbr.units_offered,

                        eri.blood_group,
                        eri.blood_component

                    FROM public.blood_bank_request_responses bbr

                    INNER JOIN public.emergency_request_items eri
                        ON eri.id = bbr.request_item_id

                    WHERE bbr.status = 'ACCEPTED'

                      AND bbr.units_offered IS NOT NULL

                      AND bbr.arrival_deadline IS NOT NULL

                      AND bbr.arrival_deadline <= NOW()

                    FOR UPDATE
                    `
                );


            let releasedCount = 0;


            for (
                const response
                of expiredResult.rows
            ) {

                await releaseBloodReservation(
                    client,
                    response
                );


                await client.query(
                    `
                    UPDATE public.blood_bank_request_responses

                    SET
                        status = 'EXPIRED',

                        response_message =
                            'Arrival deadline expired. Blood reservation released.',

                        updated_at = NOW()

                    WHERE id = $1
                    `,
                    [
                        response.id
                    ]
                );


                releasedCount++;
            }


            await client.query("COMMIT");


            if (releasedCount > 0) {

                console.log(
                    `Expired blood reservations released: ${releasedCount}`
                );
            }


            return releasedCount;


        } catch (error) {

            await client.query("ROLLBACK");

            console.error(
                "Automatic Blood Reservation Expiry Error:",
                error
            );

            return 0;

        } finally {

            client.release();
        }
    };


/*
===========================================================
EXPORT
===========================================================
*/

module.exports = {

    respondToEmergencyBloodRequest,

    processConfirmedBloodBankSelection,

    cancelEmergencyBloodRequest,

    markEmergencyBloodArrived,

    issueEmergencyBlood,

    releaseExpiredBloodReservations
};