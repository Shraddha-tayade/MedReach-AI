const pool = require("../config/db");


// =====================================================
// GET DONOR INCOMING REQUESTS
// =====================================================

const getDonorIncomingRequests = async (donorId) => {

    const query = `
        SELECT
            drr.id AS response_id,

            drr.status AS response_status,
            drr.response_message,
            drr.estimated_arrival_minutes,
            drr.responded_at,

            pr.id AS provider_request_id,
            pr.request_item_id,
            pr.sent_at,

            eri.resource_type,
            eri.blood_group,
            eri.blood_component,
            eri.quantity,

            er.id AS emergency_request_id,
            er.address_line,
            er.city,
            er.state,
            er.pincode,
            er.description,
            er.status AS emergency_status,
            er.created_at AS request_created_at,

            u.id AS user_id,
            u.name AS user_name,
            u.phone AS user_phone

        FROM donor_request_responses drr

        JOIN provider_requests pr
            ON drr.request_item_id = pr.request_item_id
            AND pr.provider_type = 'DONOR'
            AND pr.provider_id = drr.donor_id

        JOIN emergency_request_items eri
            ON pr.request_item_id = eri.id

        JOIN emergency_requests er
            ON eri.request_id = er.id

        JOIN users u
            ON er.user_id = u.id

        WHERE drr.donor_id = $1

        ORDER BY drr.created_at DESC;
    `;

    const result = await pool.query(query, [donorId]);

    return result.rows;
};


// =====================================================
// ACCEPT DONOR REQUEST
// =====================================================

const acceptDonorRequest = async (
    responseId,
    donorId,
    responseMessage
) => {

    const client = await pool.connect();

    try {

        await client.query("BEGIN");

        const responseResult = await client.query(
            `
            SELECT
                drr.id,
                drr.status,
                drr.donor_id,
                drr.request_item_id,

                eri.status AS item_status,
                er.status AS emergency_status,

                d.location AS donor_location,
                er.location AS request_location

            FROM donor_request_responses drr

            JOIN emergency_request_items eri
                ON drr.request_item_id = eri.id

            JOIN emergency_requests er
                ON eri.request_id = er.id

            JOIN donors d
                ON drr.donor_id = d.id

            WHERE
                drr.id = $1
                AND drr.donor_id = $2

            FOR UPDATE;
            `,
            [responseId, donorId]
        );

        if (responseResult.rows.length === 0) {
            throw new Error("Donor request not found");
        }

        const request = responseResult.rows[0];

        if (request.status !== "PENDING") {
            throw new Error(
                `Request cannot be accepted because its current status is ${request.status}`
            );
        }

        if (request.emergency_status !== "ACTIVE") {
            throw new Error(
                "This emergency request is no longer active"
            );
        }

        if (request.item_status !== "PENDING") {
            throw new Error(
                `Resource request cannot be accepted because its current status is ${request.item_status}`
            );
        }

        if (!request.donor_location) {
            throw new Error(
                "Donor location is not available"
            );
        }

        if (!request.request_location) {
            throw new Error(
                "Emergency request location is not available"
            );
        }


        // =====================================================
        // CALCULATE DISTANCE
        // =====================================================

        const distanceResult = await client.query(
            `
            SELECT
                ROUND(
                    ST_Distance(
                        $1::geography,
                        $2::geography
                    )::numeric / 1000,
                    2
                ) AS distance_km;
            `,
            [
                request.donor_location,
                request.request_location
            ]
        );

        const distanceKm =
            Number(distanceResult.rows[0].distance_km);


        // =====================================================
        // CALCULATE ETA
        // =====================================================

        const speedKmPerHour = 30;

        const estimatedArrivalMinutes =
            Math.ceil(
                (distanceKm / speedKmPerHour) * 60
            );

        const bufferMinutes = 10;

        const totalArrivalMinutes =
            estimatedArrivalMinutes + bufferMinutes;


        // =====================================================
        // CALCULATE ARRIVAL DEADLINE
        // =====================================================

        const arrivalResult = await client.query(
            `
            SELECT
                NOW() +
                ($1 * INTERVAL '1 minute')
                AS arrival_deadline;
            `,
            [totalArrivalMinutes]
        );

        const arrivalDeadline =
            arrivalResult.rows[0].arrival_deadline;


        // =====================================================
        // UPDATE DONOR RESPONSE
        // =====================================================

        const updateResult = await client.query(
            `
            UPDATE donor_request_responses

            SET
                status = 'ACCEPTED',
                estimated_arrival_minutes = $1,
                response_message = $2,
                responded_at = NOW(),
                updated_at = NOW()

            WHERE
                id = $3
                AND donor_id = $4

            RETURNING *;
            `,
            [
                estimatedArrivalMinutes,
                responseMessage || null,
                responseId,
                donorId
            ]
        );


        // =====================================================
        // UPDATE EMERGENCY REQUEST
        // =====================================================

        await client.query(
            `
            UPDATE emergency_requests

            SET
                donor_buffer_minutes = $1,
                donor_arrival_deadline = $2,
                updated_at = NOW()

            WHERE id = $3;
            `,
            [
                bufferMinutes,
                arrivalDeadline,
                request.request_id
            ]
        );


        // =====================================================
        // FORMAT LATEST ARRIVAL
        // =====================================================

        const latestArrivalResult = await client.query(
            `
            SELECT
                TO_CHAR(
                    $1::timestamptz AT TIME ZONE 'Asia/Kolkata',
                    'HH12:MI AM'
                ) AS latest_arrival;
            `,
            [arrivalDeadline]
        );

        const latestArrival =
            latestArrivalResult.rows[0].latest_arrival;


        await client.query("COMMIT");


        return {
            responseId: updateResult.rows[0].id,
            requestItemId:
                updateResult.rows[0].request_item_id,
            donorId:
                updateResult.rows[0].donor_id,
            status: "ACCEPTED",
            distanceKm,
            estimatedArrivalMinutes,
            bufferMinutes,
            latestArrival
        };

    } catch (error) {

        await client.query("ROLLBACK");

        throw error;

    } finally {

        client.release();
    }
};


// =====================================================
// REJECT DONOR REQUEST
// =====================================================

const rejectDonorRequest = async (
    responseId,
    donorId,
    responseMessage
) => {

    const query = `
        UPDATE donor_request_responses drr

        SET
            status = 'REJECTED',
            response_message = $1,
            responded_at = NOW(),
            updated_at = NOW()

        WHERE
            drr.id = $2
            AND drr.donor_id = $3
            AND drr.status = 'PENDING'

        RETURNING *;
    `;

    const result = await pool.query(query, [
        responseMessage || "Donor rejected the request.",
        responseId,
        donorId
    ]);

    if (result.rows.length === 0) {
        throw new Error(
            "Request not found or cannot be rejected"
        );
    }

    return result.rows[0];
};


module.exports = {
    getDonorIncomingRequests,
    acceptDonorRequest,
    rejectDonorRequest
};