const pool = require("../config/db");


// =====================================================
// FIND EMERGENCY REQUEST ITEM + USER LOCATION
// =====================================================
const findEmergencyRequestItem = async (
    requestId,
    requestItemId,
    client = pool
) => {

    let query;
    let params;

    if (requestId) {

        query = `
            SELECT
                eri.id,
                eri.request_id,
                eri.resource_type,
                eri.quantity,
                eri.status,

                er.user_id,
                er.status AS request_status,

                ST_Y(er.location::geometry) AS user_latitude,
                ST_X(er.location::geometry) AS user_longitude

            FROM public.emergency_request_items eri

            INNER JOIN public.emergency_requests er
                ON er.id = eri.request_id

            WHERE eri.id = $1
              AND eri.request_id = $2
        `;

        params = [
            requestItemId,
            requestId
        ];

    } else {

        query = `
            SELECT
                eri.id,
                eri.request_id,
                eri.resource_type,
                eri.quantity,
                eri.status,

                er.user_id,
                er.status AS request_status,

                ST_Y(er.location::geometry) AS user_latitude,
                ST_X(er.location::geometry) AS user_longitude

            FROM public.emergency_request_items eri

            INNER JOIN public.emergency_requests er
                ON er.id = eri.request_id

            WHERE eri.id = $1
        `;

        params = [
            requestItemId
        ];
    }

    const result = await client.query(query, params);

    return result.rows[0];
};


// =====================================================
// FIND HOSPITAL PROVIDER REQUEST
// =====================================================
const findHospitalProviderRequest = async (
    requestItemId,
    hospitalId,
    client = pool
) => {

    const query = `
        SELECT
            id,
            request_item_id,
            provider_type,
            provider_id,
            selected,
            selected_at,
            journey_started_at,
            confirmed_at

        FROM public.provider_requests

        WHERE request_item_id = $1
          AND provider_type = 'HOSPITAL'
          AND provider_id = $2

        LIMIT 1
    `;

    const result = await client.query(
        query,
        [
            requestItemId,
            hospitalId
        ]
    );

    return result.rows[0];
};


// =====================================================
// FIND HOSPITAL RESPONSE
// =====================================================
const findHospitalResponse = async (
    requestItemId,
    hospitalId,
    client = pool
) => {

    const query = `
        SELECT *
        FROM public.hospital_request_responses

        WHERE request_item_id = $1
          AND hospital_id = $2

        LIMIT 1
    `;

    const result = await client.query(
        query,
        [
            requestItemId,
            hospitalId
        ]
    );

    return result.rows[0];
};


// =====================================================
// GET HOSPITAL LOCATION
// =====================================================
const getHospitalLocation = async (
    hospitalId,
    client = pool
) => {

    const query = `
        SELECT
            id,
            hospital_name,

            ST_Y(location::geometry) AS latitude,
            ST_X(location::geometry) AS longitude

        FROM public.hospitals

        WHERE id = $1

        LIMIT 1
    `;

    const result = await client.query(
        query,
        [hospitalId]
    );

    return result.rows[0];
};


// =====================================================
// INSERT / UPDATE HOSPITAL RESPONSE
// =====================================================
const upsertHospitalResponse = async ({
    requestItemId,
    hospitalId,
    status,
    responseMessage
}, client = pool) => {

    const query = `
        INSERT INTO public.hospital_request_responses (
            request_item_id,
            hospital_id,
            status,
            response_message,
            responded_at,
            updated_at
        )

        VALUES (
            $1,
            $2,
            $3,
            $4,
            NOW(),
            NOW()
        )

        ON CONFLICT (
            request_item_id,
            hospital_id
        )

        DO UPDATE SET
            status = EXCLUDED.status,
            response_message = EXCLUDED.response_message,
            responded_at = NOW(),
            updated_at = NOW()

        RETURNING *
    `;

    const result = await client.query(
        query,
        [
            requestItemId,
            hospitalId,
            status,
            responseMessage || null
        ]
    );

    return result.rows[0];
};


// =====================================================
// UPDATE PROVIDER REQUEST JOURNEY
// =====================================================
const updateProviderRequestJourney = async (
    requestItemId,
    hospitalId,
    client = pool
) => {

    const query = `
        UPDATE public.provider_requests

        SET
            journey_started_at =
                COALESCE(journey_started_at, NOW()),

            confirmed_at = NOW()

        WHERE request_item_id = $1
          AND provider_type = 'HOSPITAL'
          AND provider_id = $2
          AND selected = true

        RETURNING *
    `;

    const result = await client.query(
        query,
        [
            requestItemId,
            hospitalId
        ]
    );

    return result.rows[0];
};


// =====================================================
// RESERVE ICU BEDS
// =====================================================
const reserveICUBeds = async (
    hospitalId,
    quantity,
    client = pool
) => {

    const query = `
        UPDATE public.icu_bed_inventory

        SET
            available_beds = available_beds - $1,
            reserved_beds = reserved_beds + $1,
            updated_at = CURRENT_TIMESTAMP,
            last_updated_at = CURRENT_TIMESTAMP

        WHERE hospital_id = $2
          AND available_beds >= $1

        RETURNING *
    `;

    const result = await client.query(
        query,
        [
            quantity,
            hospitalId
        ]
    );

    return result.rows[0];
};


// =====================================================
// RESERVE OXYGEN BEDS
// =====================================================
const reserveOxygenBeds = async (
    hospitalId,
    quantity,
    client = pool
) => {

    const query = `
        UPDATE public.oxygen_bed_inventory

        SET
            available_beds = available_beds - $1,
            reserved_beds = reserved_beds + $1,
            updated_at = CURRENT_TIMESTAMP,
            last_updated_at = CURRENT_TIMESTAMP

        WHERE hospital_id = $2
          AND available_beds >= $1

        RETURNING *
    `;

    const result = await client.query(
        query,
        [
            quantity,
            hospitalId
        ]
    );

    return result.rows[0];
};


// =====================================================
// RELEASE ICU BEDS
// =====================================================
const releaseICUBeds = async (
    hospitalId,
    quantity,
    client = pool
) => {

    const query = `
        UPDATE public.icu_bed_inventory

        SET
            reserved_beds = reserved_beds - $1,
            available_beds = available_beds + $1,
            updated_at = CURRENT_TIMESTAMP,
            last_updated_at = CURRENT_TIMESTAMP

        WHERE hospital_id = $2
          AND reserved_beds >= $1

        RETURNING *
    `;

    const result = await client.query(
        query,
        [
            quantity,
            hospitalId
        ]
    );

    return result.rows[0];
};


// =====================================================
// RELEASE OXYGEN BEDS
// =====================================================
const releaseOxygenBeds = async (
    hospitalId,
    quantity,
    client = pool
) => {

    const query = `
        UPDATE public.oxygen_bed_inventory

        SET
            reserved_beds = reserved_beds - $1,
            available_beds = available_beds + $1,
            updated_at = CURRENT_TIMESTAMP,
            last_updated_at = CURRENT_TIMESTAMP

        WHERE hospital_id = $2
          AND reserved_beds >= $1

        RETURNING *
    `;

    const result = await client.query(
        query,
        [
            quantity,
            hospitalId
        ]
    );

    return result.rows[0];
};


// =====================================================
// RESERVED → OCCUPIED : ICU
// =====================================================
const moveICUReservedToOccupied = async (
    hospitalId,
    quantity,
    client = pool
) => {

    const query = `
        UPDATE public.icu_bed_inventory

        SET
            reserved_beds = reserved_beds - $1,
            occupied_beds = occupied_beds + $1,
            updated_at = CURRENT_TIMESTAMP,
            last_updated_at = CURRENT_TIMESTAMP

        WHERE hospital_id = $2
          AND reserved_beds >= $1

        RETURNING *
    `;

    const result = await client.query(
        query,
        [
            quantity,
            hospitalId
        ]
    );

    return result.rows[0];
};


// =====================================================
// RESERVED → OCCUPIED : OXYGEN
// =====================================================
const moveOxygenReservedToOccupied = async (
    hospitalId,
    quantity,
    client = pool
) => {

    const query = `
        UPDATE public.oxygen_bed_inventory

        SET
            reserved_beds = reserved_beds - $1,
            occupied_beds = occupied_beds + $1,
            updated_at = CURRENT_TIMESTAMP,
            last_updated_at = CURRENT_TIMESTAMP

        WHERE hospital_id = $2
          AND reserved_beds >= $1

        RETURNING *
    `;

    const result = await client.query(
        query,
        [
            quantity,
            hospitalId
        ]
    );

    return result.rows[0];
};


// =====================================================
// UPDATE RESPONSE STATUS
// =====================================================
const updateResponseStatus = async (
    responseId,
    status,
    extra = {},
    client = pool
) => {

    const {
        arrivalDeadline = null,
        estimatedArrivalMinutes = null,
        bufferMinutes = null,
        arrivedAt = null,
        completedAt = null
    } = extra;

    const query = `
        UPDATE public.hospital_request_responses

        SET
            status = $1,

            estimated_arrival_minutes =
                COALESCE($2, estimated_arrival_minutes),

            buffer_minutes =
                COALESCE($3, buffer_minutes),

            arrival_deadline =
                COALESCE($4, arrival_deadline),

            arrived_at =
                COALESCE($5, arrived_at),

            completed_at =
                COALESCE($6, completed_at),

            updated_at = NOW()

        WHERE id = $7

        RETURNING *
    `;

    const result = await client.query(
        query,
        [
            status,
            estimatedArrivalMinutes,
            bufferMinutes,
            arrivalDeadline,
            arrivedAt,
            completedAt,
            responseId
        ]
    );

    return result.rows[0];
};


// =====================================================
// SET COMPLETED BY USER
// =====================================================
const setCompletedByUser = async (
    responseId,
    completedByUserId,
    client = pool
) => {

    const query = `
        UPDATE public.hospital_request_responses

        SET
            completed_by_user_id = $1,
            updated_at = NOW()

        WHERE id = $2

        RETURNING *
    `;

    const result = await client.query(
        query,
        [
            completedByUserId,
            responseId
        ]
    );

    return result.rows[0];
};


// =====================================================
// GET EXPIRED RESPONSES
// =====================================================
const getExpiredHospitalResponses = async () => {

    const query = `
        SELECT
            hrr.*,
            eri.request_id,
            eri.resource_type,
            eri.quantity

        FROM public.hospital_request_responses hrr

        INNER JOIN public.emergency_request_items eri
            ON eri.id = hrr.request_item_id

        WHERE hrr.status = 'ACCEPTED'
          AND hrr.arrival_deadline IS NOT NULL
          AND hrr.arrival_deadline <= NOW()
    `;

    const result = await pool.query(query);

    return result.rows;
};


// =====================================================
// EXPORTS
// =====================================================
module.exports = {
    findEmergencyRequestItem,
    findHospitalProviderRequest,
    findHospitalResponse,
    getHospitalLocation,
    upsertHospitalResponse,

    updateProviderRequestJourney,

    reserveICUBeds,
    reserveOxygenBeds,

    releaseICUBeds,
    releaseOxygenBeds,

    moveICUReservedToOccupied,
    moveOxygenReservedToOccupied,

    updateResponseStatus,
    setCompletedByUser,

    getExpiredHospitalResponses
};