const pool = require("../config/db");

const getBloodBankEmergencyRequests = async (bloodBankId) => {
    const query = `
        SELECT
            pr.id AS provider_request_id,

            er.id AS request_id,
            eri.id AS request_item_id,

            er.user_id,

            eri.blood_group,
            eri.blood_component,
            eri.quantity,

            er.address_line,
            er.city,
            er.state,
            er.pincode,
            er.location,

            er.description,

            eri.status AS item_status,

            pr.sent_at,
            pr.selected,
            pr.selected_at,
            pr.journey_started_at,
            pr.confirmed_at,

            bbr.id AS response_id,
            bbr.status AS response_status,
            bbr.response_message,
            bbr.units_offered,
            bbr.estimated_arrival_minutes,
            bbr.buffer_minutes,
            bbr.arrival_deadline,
            bbr.responded_at,
            bbr.arrived_at,
            bbr.completed_at

        FROM public.provider_requests pr

        INNER JOIN public.emergency_request_items eri
            ON eri.id = pr.request_item_id

        INNER JOIN public.emergency_requests er
            ON er.id = eri.request_id

        LEFT JOIN public.blood_bank_request_responses bbr
            ON bbr.request_item_id = eri.id
           AND bbr.blood_bank_id = pr.provider_id

        WHERE pr.provider_type = 'BLOOD_BANK'
          AND pr.provider_id = $1
          AND eri.resource_type = 'BLOOD'

        ORDER BY pr.sent_at DESC;
    `;

    const result = await pool.query(query, [bloodBankId]);

    return result.rows;
};

module.exports = {
    getBloodBankEmergencyRequests
};