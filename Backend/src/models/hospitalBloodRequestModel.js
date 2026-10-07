const pool = require("../config/db");

// ======================================================
// CREATE HOSPITAL BLOOD REQUEST
// ======================================================
const createRequest = async ({
    hospital_id,
    blood_group,
    blood_component,
    quantity,
    request_address,
    city,
    state,
    pincode,
    latitude,
    longitude,
    search_radius_km,
    description
}) => {
    const query = `
        INSERT INTO public.hospital_blood_requests (
            hospital_id,
            blood_group,
            blood_component,
            quantity,
            request_address,
            city,
            state,
            pincode,
            location,
            search_radius_km,
            description,
            status
        )
        VALUES (
            $1,
            $2,
            $3,
            $4,
            $5,
            $6,
            $7,
            $8,
            CASE
                WHEN $9::double precision IS NOT NULL
                 AND $10::double precision IS NOT NULL
                THEN ST_SetSRID(
                    ST_MakePoint(
                        $10::double precision,
                        $9::double precision
                    ),
                    4326
                )
                ELSE NULL
            END,
            $11,
            $12,
            'PENDING'
        )
        RETURNING *;
    `;

    const values = [
        hospital_id,
        blood_group,
        blood_component,
        quantity,
        request_address || null,
        city || null,
        state || null,
        pincode || null,
        latitude ?? null,
        longitude ?? null,
        search_radius_km ?? null,
        description || null
    ];

    const result = await pool.query(query, values);

    return result.rows[0];
};


// ======================================================
// GET ALL REQUESTS OF A HOSPITAL
// ======================================================
const getRequestsByHospital = async (hospital_id) => {
    const query = `
        SELECT
            id,
            hospital_id,
            blood_group,
            blood_component,
            quantity,
            request_address,
            city,
            state,
            pincode,
            search_radius_km,
            description,
            status,
            created_at,
            updated_at
        FROM public.hospital_blood_requests
        WHERE hospital_id = $1
        ORDER BY created_at DESC;
    `;

    const result = await pool.query(query, [hospital_id]);

    return result.rows;
};


// ======================================================
// GET ONE REQUEST BY HOSPITAL
// ======================================================
const getRequestById = async (hospital_id, request_id) => {
    const requestQuery = `
        SELECT
            id,
            hospital_id,
            blood_group,
            blood_component,
            quantity,
            request_address,
            city,
            state,
            pincode,
            search_radius_km,
            description,
            status,
            created_at,
            updated_at
        FROM public.hospital_blood_requests
        WHERE id = $1
          AND hospital_id = $2;
    `;

    const requestResult = await pool.query(requestQuery, [
        request_id,
        hospital_id
    ]);

    if (requestResult.rows.length === 0) {
        return null;
    }

    const request = requestResult.rows[0];

    const responseQuery = `
        SELECT
            r.id AS response_id,
            r.request_id,
            r.blood_bank_id,
            r.response_status,
            r.available_quantity,
            r.response_message,

            r.distance_km,
            r.reservation_minutes,
            r.reserved_quantity,
            r.reserved_until,
            r.reservation_status,
            r.inventory_id,

            r.responded_at,
            r.created_at,
            r.updated_at,

            b.blood_bank_name,
            b.contact AS blood_bank_contact,
            b.address_line AS blood_bank_address,
            b.city AS blood_bank_city,
            b.state AS blood_bank_state,
            b.pincode AS blood_bank_pincode

        FROM public.hospital_blood_request_responses r

        LEFT JOIN public.blood_banks b
            ON b.id = r.blood_bank_id

        WHERE r.request_id = $1

        ORDER BY
            r.created_at DESC,
            r.id DESC;
    `;

    const responseResult = await pool.query(
        responseQuery,
        [request_id]
    );

    return {
        request,
        responses: responseResult.rows
    };
};


// ======================================================
// GET PENDING REQUESTS FOR BLOOD BANK
// ======================================================
const getPendingRequests = async (blood_bank_id) => {
    const query = `
        SELECT
            r.id,
            r.hospital_id,
            r.blood_group,
            r.blood_component,
            r.quantity,
            r.request_address,
            r.city,
            r.state,
            r.pincode,
            r.search_radius_km,
            r.description,
            r.status,
            r.created_at,
            r.updated_at,

            h.hospital_name,

            COALESCE(
                SUM(
                    CASE
                        WHEN bi.expiry_date >= CURRENT_DATE
                         AND UPPER(TRIM(bi.status)) = 'AVAILABLE'
                        THEN bi.units_available
                        ELSE 0
                    END
                ),
                0
            ) AS available_quantity

        FROM public.hospital_blood_requests r

        LEFT JOIN public.hospitals h
            ON h.id = r.hospital_id

        LEFT JOIN public.blood_inventory bi
            ON bi.blood_bank_id = $1

           AND UPPER(TRIM(bi.blood_group)) =
               UPPER(TRIM(r.blood_group))

           AND (
                UPPER(TRIM(bi.blood_component)) =
                    UPPER(TRIM(r.blood_component))

                OR

                (
                    UPPER(TRIM(bi.blood_component)) = 'PACKED_RBC'
                    AND UPPER(TRIM(r.blood_component)) = 'PRBC'
                )

                OR

                (
                    UPPER(TRIM(bi.blood_component)) = 'PRBC'
                    AND UPPER(TRIM(r.blood_component)) = 'PACKED_RBC'
                )
           )

        WHERE r.status = 'PENDING'

        GROUP BY
            r.id,
            h.hospital_name

        ORDER BY
            r.created_at DESC;
    `;

    const result = await pool.query(
        query,
        [blood_bank_id]
    );

    return result.rows;
};


// ======================================================
// GET ONE REQUEST FOR BLOOD BANK
// ======================================================
const getRequestForBloodBank = async (request_id) => {
    const query = `
        SELECT
            id,
            hospital_id,
            blood_group,
            blood_component,
            quantity,
            request_address,
            city,
            state,
            pincode,
            search_radius_km,
            description,
            status,
            created_at,
            updated_at
        FROM public.hospital_blood_requests
        WHERE id = $1;
    `;

    const result = await pool.query(
        query,
        [request_id]
    );

    return result.rows[0] || null;
};


// ======================================================
// CREATE BLOOD BANK RESPONSE
//
// Every response is inserted as a new history record.
//
// Transaction client is used because ACCEPT operation
// must update inventory and response atomically.
// ======================================================
const createResponse = async (
    client,
    {
        request_id,
        blood_bank_id,
        response_status,
        available_quantity,
        response_message,
        distance_km,
        reservation_minutes,
        reserved_quantity,
        reserved_until,
        reservation_status,
        inventory_id
    }
) => {
    const query = `
        INSERT INTO public.hospital_blood_request_responses (
            request_id,
            blood_bank_id,
            response_status,
            available_quantity,
            response_message,

            distance_km,
            reservation_minutes,
            reserved_quantity,
            reserved_until,
            reservation_status,
            inventory_id,

            responded_at
        )
        VALUES (
            $1,
            $2,
            $3,
            $4,
            $5,

            $6,
            $7,
            $8,
            $9,
            $10,
            $11,

            NOW()
        )
        RETURNING *;
    `;

    const values = [
        request_id,
        blood_bank_id,
        response_status,
        available_quantity ?? null,
        response_message || null,

        distance_km ?? null,
        reservation_minutes ?? null,
        reserved_quantity ?? null,
        reserved_until ?? null,
        reservation_status || "NONE",
        inventory_id ?? null
    ];

    const result = await client.query(
        query,
        values
    );

    return result.rows[0];
};


// ======================================================
// GET HOSPITAL BLOOD REQUEST FOR TRANSACTION
//
// FOR UPDATE locks the request while processing.
// ======================================================
const getHospitalBloodRequest = async (
    client,
    request_id
) => {

    const result = await client.query(
        `
        SELECT
            id,
            hospital_id,
            blood_group,
            blood_component,
            quantity,
            request_address,
            city,
            state,
            pincode,

            ST_Y(location::geometry) AS latitude,
            ST_X(location::geometry) AS longitude,

            search_radius_km,
            description,
            status,
            created_at,
            updated_at

        FROM public.hospital_blood_requests

        WHERE id = $1

        FOR UPDATE;
        `,
        [request_id]
    );

    if (result.rows.length === 0) {
        return null;
    }

    return result.rows[0];
};

// ======================================================
// GET BLOOD BANK LOCATION
// ======================================================
const getBloodBankLocation = async (
    client,
    blood_bank_id
) => {
    const query = `
        SELECT
            id,

            ST_Y(location::geometry) AS latitude,
            ST_X(location::geometry) AS longitude

        FROM public.blood_banks

        WHERE id = $1;
    `;

    const result = await client.query(
        query,
        [blood_bank_id]
    );

    return result.rows[0] || null;
};


// ======================================================
// GET MATCHING BLOOD INVENTORY
//
// Finds one inventory batch that can satisfy the
// complete requested quantity.
//
// Rules:
// - Same blood bank
// - Same blood group
// - Same component
// - PRBC and PACKED_RBC compatible
// - Not expired
// - AVAILABLE
// - Enough units in one batch
//
// Earliest expiry batch is selected first.
// ======================================================
const getBloodInventory = async (
    client,
    blood_bank_id,
    blood_group,
    blood_component,
    quantity
) => {
    const query = `
        SELECT
            id,
            blood_bank_id,
            blood_group,
            blood_component,
            batch_number,
            units_collected,
            units_available,
            collection_date,
            expiry_date,
            status

        FROM public.blood_inventory

        WHERE blood_bank_id = $1

          AND UPPER(TRIM(blood_group)) =
              UPPER(TRIM($2))

          AND (
                UPPER(TRIM(blood_component)) =
                    UPPER(TRIM($3))

                OR

                (
                    UPPER(TRIM(blood_component)) = 'PACKED_RBC'
                    AND UPPER(TRIM($3)) = 'PRBC'
                )

                OR

                (
                    UPPER(TRIM(blood_component)) = 'PRBC'
                    AND UPPER(TRIM($3)) = 'PACKED_RBC'
                )
          )

          AND expiry_date >= CURRENT_DATE

          AND UPPER(TRIM(status)) = 'AVAILABLE'

          AND units_available >= $4

        ORDER BY
            expiry_date ASC,
            id ASC

        LIMIT 1

        FOR UPDATE;
    `;

    const result = await client.query(
        query,
        [
            blood_bank_id,
            blood_group,
            blood_component,
            quantity
        ]
    );

    return result.rows[0] || null;
};


// ======================================================
// RESERVE BLOOD INVENTORY
//
// Deducts the requested quantity from the selected
// inventory batch.
// ======================================================
const reserveInventory = async (
    client,
    inventory_id,
    quantity
) => {
    const query = `
        UPDATE public.blood_inventory

        SET
            units_available =
                units_available - $2,

            status =
                CASE
                    WHEN units_available - $2 > 0
                    THEN 'AVAILABLE'
                    ELSE 'UNAVAILABLE'
                END,

            updated_at = NOW()

        WHERE id = $1

          AND expiry_date >= CURRENT_DATE

          AND units_available >= $2

        RETURNING
            id,
            units_available,
            status;
    `;

    const result = await client.query(
        query,
        [
            inventory_id,
            quantity
        ]
    );

    return result.rows[0] || null;
};


// ======================================================
// GET EXPIRED HOSPITAL BLOOD RESERVATIONS
// ======================================================
const getExpiredReservations = async (
    client
) => {
    const query = `
        SELECT
            id,
            request_id,
            blood_bank_id,

            reserved_quantity,
            reserved_until,

            reservation_status,

            inventory_id

        FROM public.hospital_blood_request_responses

        WHERE reservation_status = 'RESERVED'

          AND reserved_until <= NOW()

        FOR UPDATE;
    `;

    const result = await client.query(query);

    return result.rows;
};


// ======================================================
// RELEASE RESERVED BLOOD
//
// Returns the exact reserved quantity to the same
// inventory batch.
// ======================================================
const releaseInventory = async (
    client,
    inventory_id,
    quantity
) => {
    const query = `
        UPDATE public.blood_inventory

        SET
            units_available =
                units_available + $2,

            status = 'AVAILABLE',

            updated_at = NOW()

        WHERE id = $1

        RETURNING
            id,
            units_available,
            status;
    `;

    const result = await client.query(
        query,
        [
            inventory_id,
            quantity
        ]
    );

    return result.rows[0] || null;
};


// ======================================================
// MARK RESERVATION AS EXPIRED
// ======================================================
const markReservationExpired = async (
    client,
    response_id
) => {
    const query = `
        UPDATE public.hospital_blood_request_responses

        SET
            reservation_status = 'EXPIRED',
            updated_at = NOW()

        WHERE id = $1

        RETURNING *;
    `;

    const result = await client.query(
        query,
        [response_id]
    );

    return result.rows[0] || null;
};


// ======================================================
// UPDATE MAIN REQUEST STATUS
// ======================================================
const updateRequestStatus = async (
    request_id,
    status
) => {
    const query = `
        UPDATE public.hospital_blood_requests

        SET
            status = $1,
            updated_at = NOW()

        WHERE id = $2

        RETURNING *;
    `;

    const result = await pool.query(
        query,
        [
            status,
            request_id
        ]
    );

    return result.rows[0] || null;
};


// ======================================================
// GET RESPONSE SUMMARY
//
// Uses the latest response from each blood bank.
// ======================================================
const getResponseSummary = async (
    request_id
) => {
    const query = `
        WITH latest_responses AS (

            SELECT DISTINCT ON (blood_bank_id)
                id,
                blood_bank_id,
                response_status,
                responded_at,
                created_at

            FROM public.hospital_blood_request_responses

            WHERE request_id = $1

            ORDER BY
                blood_bank_id,
                responded_at DESC NULLS LAST,
                id DESC
        )

        SELECT

            COUNT(*) FILTER (
                WHERE response_status = 'ACCEPTED'
            ) AS accepted_count,

            COUNT(*) FILTER (
                WHERE response_status = 'REJECTED'
            ) AS rejected_count,

            COUNT(*) FILTER (
                WHERE response_status = 'PENDING'
            ) AS pending_count

        FROM latest_responses;
    `;

    const result = await pool.query(
        query,
        [request_id]
    );

    return result.rows[0];
};


// ======================================================
// GET BLOOD BANK RESPONSE HISTORY
//
// Returns every response action.
// ======================================================
const getBloodBankHistory = async (
    blood_bank_id
) => {
    const query = `
        SELECT
            r.id AS response_id,
            r.request_id,
            r.blood_bank_id,

            r.response_status,
            r.available_quantity,
            r.response_message,

            r.distance_km,
            r.reservation_minutes,
            r.reserved_quantity,
            r.reserved_until,
            r.reservation_status,
            r.inventory_id,

            r.responded_at,
            r.created_at,
            r.updated_at,

            br.blood_group,
            br.blood_component,
            br.quantity AS requested_quantity,

            br.request_address,
            br.city,
            br.state,
            br.pincode,

            br.status AS request_status,
            br.created_at AS request_created_at,

            h.hospital_name

        FROM public.hospital_blood_request_responses r

        INNER JOIN public.hospital_blood_requests br
            ON br.id = r.request_id

        LEFT JOIN public.hospitals h
            ON h.id = br.hospital_id

        WHERE r.blood_bank_id = $1

        ORDER BY
            r.created_at DESC,
            r.id DESC;
    `;

    const result = await pool.query(
        query,
        [blood_bank_id]
    );

    return result.rows;
};


// ======================================================
// GET HOSPITAL REQUEST HISTORY
//
// Returns all requests created by the logged-in hospital
// with ALL blood-bank response history.
//
// Every ACCEPTED / REJECTED action remains visible.
// ======================================================
const getHospitalHistory = async (
    hospital_id
) => {
    const query = `
        SELECT
            br.id AS request_id,
            br.hospital_id,

            br.blood_group,
            br.blood_component,
            br.quantity,

            br.request_address,
            br.city,
            br.state,
            br.pincode,

            br.search_radius_km,
            br.description,

            br.status AS request_status,

            br.created_at AS request_created_at,
            br.updated_at AS request_updated_at,

            COALESCE(
                json_agg(
                    json_build_object(

                        'response_id',
                        rr.id,

                        'blood_bank_id',
                        rr.blood_bank_id,

                        'blood_bank_name',
                        bb.blood_bank_name,

                        'blood_bank_contact',
                        bb.contact,

                        'blood_bank_address',
                        bb.address_line,

                        'blood_bank_city',
                        bb.city,

                        'blood_bank_state',
                        bb.state,

                        'blood_bank_pincode',
                        bb.pincode,

                        'response_status',
                        rr.response_status,

                        'available_quantity',
                        rr.available_quantity,

                        'response_message',
                        rr.response_message,

                        'distance_km',
                        rr.distance_km,

                        'reservation_minutes',
                        rr.reservation_minutes,

                        'reserved_quantity',
                        rr.reserved_quantity,

                        'reserved_until',
                        rr.reserved_until,

                        'reservation_status',
                        rr.reservation_status,

                        'inventory_id',
                        rr.inventory_id,

                        'responded_at',
                        rr.responded_at,

                        'created_at',
                        rr.created_at,

                        'updated_at',
                        rr.updated_at
                    )

                    ORDER BY
                        rr.created_at DESC,
                        rr.id DESC

                ) FILTER (
                    WHERE rr.id IS NOT NULL
                ),

                '[]'::json

            ) AS responses

        FROM public.hospital_blood_requests br

        LEFT JOIN public.hospital_blood_request_responses rr
            ON rr.request_id = br.id

        LEFT JOIN public.blood_banks bb
            ON bb.id = rr.blood_bank_id

        WHERE br.hospital_id = $1

        GROUP BY
            br.id,
            br.hospital_id,

            br.blood_group,
            br.blood_component,
            br.quantity,

            br.request_address,
            br.city,
            br.state,
            br.pincode,

            br.search_radius_km,
            br.description,

            br.status,

            br.created_at,
            br.updated_at

        ORDER BY
            br.created_at DESC;
    `;

    const result = await pool.query(
        query,
        [hospital_id]
    );

    return result.rows;
};


// ======================================================
// EXPORT ALL FUNCTIONS
// ======================================================
module.exports = {
    createRequest,
    getRequestsByHospital,
    getRequestById,

    getPendingRequests,
    getRequestForBloodBank,

    createResponse,
    updateRequestStatus,
    getResponseSummary,

    getBloodBankHistory,
    getHospitalHistory,

    // Reservation functions
    getHospitalBloodRequest,
    getBloodBankLocation,
    getBloodInventory,
    reserveInventory,
    getExpiredReservations,
    releaseInventory,
    markReservationExpired
};