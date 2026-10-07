const pool = require("../config/db");


/*
=========================================================
GET EMERGENCY BLOOD REQUEST
=========================================================
*/

const getEmergencyBloodRequest = async (
    client,
    requestId,
    requestItemId
) => {

    const query = `
        SELECT

            r.id AS request_id,
            r.user_id,

            r.request_address,
            r.city,
            r.state,
            r.pincode,

            r.location,

            ST_Y(r.location::geometry) AS latitude,
            ST_X(r.location::geometry) AS longitude,

            r.description,
            r.status AS request_status,

            ri.id AS request_item_id,
            ri.resource_type,
            ri.blood_group,
            ri.blood_component,
            ri.quantity,
            ri.status AS item_status

        FROM public.emergency_requests r

        INNER JOIN public.emergency_request_items ri
            ON ri.request_id = r.id

        WHERE r.id = $1
          AND ri.id = $2
          AND ri.resource_type = 'BLOOD'

        FOR UPDATE;
    `;

    const result = await client.query(
        query,
        [requestId, requestItemId]
    );

    return result.rows[0] || null;
};


/*
=========================================================
GET BLOOD BANK LOCATION
=========================================================
*/

const getBloodBankLocation = async (
    client,
    bloodBankId
) => {

    const query = `
        SELECT

            id,
            blood_bank_name,

            ST_Y(location::geometry) AS latitude,
            ST_X(location::geometry) AS longitude

        FROM public.blood_banks

        WHERE id = $1;
    `;

    const result = await client.query(
        query,
        [bloodBankId]
    );

    return result.rows[0] || null;
};


/*
=========================================================
GET AVAILABLE BLOOD INVENTORY
=========================================================
*/

const getBloodInventory = async (
    client,
    bloodBankId,
    bloodGroup,
    bloodComponent
) => {

    const normalizedComponent =
        String(bloodComponent || "")
            .trim()
            .toUpperCase()
            .replace(/\s+/g, "_");


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

          AND UPPER(TRIM(blood_group))
              = UPPER(TRIM($2))

          AND (
                UPPER(REPLACE(TRIM(blood_component), ' ', '_'))
                    = $3

                OR (
                    $3 IN ('PRBC', 'PACKED_RBC')
                    AND UPPER(
                        REPLACE(
                            TRIM(blood_component),
                            ' ',
                            '_'
                        )
                    ) IN ('PRBC', 'PACKED_RBC')
                )
          )

          AND expiry_date >= CURRENT_DATE

          AND status = 'AVAILABLE'

          AND units_available > 0

        ORDER BY expiry_date ASC, id ASC

        FOR UPDATE;
    `;

    const result = await client.query(
        query,
        [
            bloodBankId,
            bloodGroup,
            normalizedComponent
        ]
    );

    return result.rows;
};


/*
=========================================================
RESERVE INVENTORY
=========================================================
*/

const reserveInventory = async (
    client,
    inventoryId,
    quantity
) => {

    const query = `
        UPDATE public.blood_inventory
        SET
            units_available = units_available - $2,

            status = CASE
                WHEN units_available - $2 > 0
                    THEN 'AVAILABLE'
                ELSE 'UNAVAILABLE'
            END,

            updated_at = NOW()

        WHERE id = $1
          AND units_available >= $2
          AND expiry_date >= CURRENT_DATE

        RETURNING
            id,
            blood_bank_id,
            blood_group,
            blood_component,
            units_available,
            expiry_date,
            status;
    `;

    const result = await client.query(
        query,
        [
            inventoryId,
            quantity
        ]
    );

    return result.rows[0] || null;
};


/*
=========================================================
CREATE EMERGENCY RESPONSE
=========================================================
*/

const createResponse = async (
    client,
    {
        request_id,
        request_item_id,

        provider_type,
        provider_id,

        response_status,
        response_message,

        available_quantity,

        distance_km,
        travel_time_minutes,
        reservation_minutes,

        reserved_quantity,
        reserved_until,

        reservation_status,

        inventory_id
    }
) => {

    const query = `
        INSERT INTO public.emergency_request_responses (

            request_id,
            request_item_id,

            provider_type,
            provider_id,

            response_status,
            response_message,

            available_quantity,

            distance_km,
            travel_time_minutes,
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
            $12,
            $13,
            $14,
            NOW()
        )

        RETURNING *;
    `;

    const result = await client.query(
        query,
        [
            request_id,
            request_item_id,

            provider_type,
            provider_id,

            response_status,
            response_message,

            available_quantity,

            distance_km,
            travel_time_minutes,
            reservation_minutes,

            reserved_quantity,
            reserved_until,

            reservation_status,

            inventory_id
        ]
    );

    return result.rows[0];
};


/*
=========================================================
GET EXPIRED RESERVATIONS
=========================================================
*/

const getExpiredReservations = async (client) => {
    const query = `
        SELECT
            er.id,
            er.request_id,
            er.request_item_id,
            er.inventory_id,
            er.reserved_quantity
        FROM public.emergency_request_responses er
        INNER JOIN public.emergency_request_items ri
            ON ri.id = er.request_item_id
        WHERE er.provider_type = 'BLOOD_BANK'
          AND er.reservation_status = 'RESERVED'
          AND er.reserved_until IS NOT NULL
          AND er.reserved_until <= NOW()
          AND ri.status = 'ACCEPTED'
        FOR UPDATE OF er;
    `;

    const result = await client.query(query);

    return result.rows;
};


/*
=========================================================
RELEASE INVENTORY
=========================================================
*/

const releaseInventory = async (
    client,
    inventoryId,
    quantity
) => {
    const query = `
        UPDATE public.blood_inventory
        SET
            units_available = units_available + $2,
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
        [inventoryId, quantity]
    );

    return result.rows[0] || null;
};


/*
=========================================================
MARK RESERVATION EXPIRED
=========================================================
*/

const markReservationExpired = async (
    client,
    responseId
) => {

    const query = `
        UPDATE public.emergency_request_responses

        SET

            reservation_status = 'EXPIRED',

            updated_at = NOW()

        WHERE id = $1

        RETURNING *;
    `;

    const result = await client.query(
        query,
        [responseId]
    );

    return result.rows[0] || null;
};


/*
=========================================================
EMERGENCY BLOOD HISTORY
=========================================================
*/

const getEmergencyBloodHistory = async (
    bloodBankId
) => {

    const query = `
        SELECT

            er.id AS response_id,

            er.request_id,
            er.request_item_id,

            er.provider_type,
            er.provider_id,

            er.response_status,
            er.response_message,

            er.available_quantity,

            er.distance_km,
            er.travel_time_minutes,
            er.reservation_minutes,

            er.reserved_quantity,
            er.reserved_until,

            er.reservation_status,

            er.inventory_id,

            er.responded_at,
            er.created_at,
            er.updated_at,

            r.user_id,

            r.request_address,
            r.city,
            r.state,
            r.pincode,
            r.description,

            r.status AS request_status,

            ri.resource_type,
            ri.blood_group,
            ri.blood_component,
            ri.quantity

        FROM public.emergency_request_responses er

        INNER JOIN public.emergency_requests r
            ON r.id = er.request_id

        INNER JOIN public.emergency_request_items ri
            ON ri.id = er.request_item_id

        WHERE er.provider_type = 'BLOOD_BANK'

          AND er.provider_id = $1

          AND ri.resource_type = 'BLOOD'

        ORDER BY er.created_at DESC;
    `;

    const result = await pool.query(
        query,
        [bloodBankId]
    );

    return result.rows;
};


module.exports = {

    getEmergencyBloodRequest,

    getBloodBankLocation,

    getBloodInventory,

    reserveInventory,

    createResponse,

    getExpiredReservations,

    releaseInventory,

    markReservationExpired,

    getEmergencyBloodHistory
};