const pool = require("../config/db");

const getHospitalEmergencyRequests = async (hospitalId) => {

    const query = `
        SELECT
            pr.id AS provider_request_id,
            pr.request_item_id,
            pr.provider_type,
            pr.provider_id,
            pr.sent_at,
            pr.selected,
            pr.selected_at,
            pr.journey_started_at,
            pr.confirmed_at,

            eri.resource_type,
            eri.blood_group,
            eri.blood_component,
            eri.quantity,
            eri.status AS item_status,

            er.id AS request_id,
            er.user_id,
            er.status AS request_status,
            er.location,
            er.address_line,
            er.city,
            er.state,
            er.pincode,
            er.description,
            er.created_at,

            hrr.id AS response_id,
            hrr.status AS response_status,
            hrr.response_message,
            hrr.quantity_offered,
            hrr.estimated_arrival_minutes,
            hrr.buffer_minutes,
            hrr.arrival_deadline,
            hrr.responded_at,
            hrr.arrived_at,
            hrr.completed_at

        FROM public.provider_requests pr

        INNER JOIN public.emergency_request_items eri
            ON eri.id = pr.request_item_id

        INNER JOIN public.emergency_requests er
            ON er.id = eri.request_id

        LEFT JOIN public.hospital_request_responses hrr
            ON hrr.request_item_id = eri.id
            AND hrr.hospital_id = pr.provider_id

        WHERE pr.provider_type = 'HOSPITAL'
          AND pr.provider_id = $1

        ORDER BY pr.sent_at DESC
    `;

    const result = await pool.query(query, [hospitalId]);

    return result.rows;
};

module.exports = {
    getHospitalEmergencyRequests
};