const pool = require("../config/db");

const getBloodBankEmergencyHistory = async (bloodBankId) => {
    const query = `
        SELECT
            bbr.id AS response_id,
            bbr.request_item_id,
            bbr.blood_bank_id,

            eri.request_id,
            eri.resource_type,
            eri.blood_group,
            eri.blood_component,
            eri.quantity,

            bbr.status AS response_status,
            bbr.response_message,
            bbr.units_offered,
            bbr.estimated_arrival_minutes,
            bbr.buffer_minutes,
            bbr.arrival_deadline,
            bbr.responded_at,
            bbr.arrived_at,
            bbr.completed_at,
            bbr.created_at,
            bbr.updated_at,

            er.user_id,
            er.address_line,
            er.city,
            er.state,
            er.pincode,

            ST_Y(er.location::geometry) AS user_latitude,
            ST_X(er.location::geometry) AS user_longitude

        FROM public.blood_bank_request_responses bbr

        INNER JOIN public.emergency_request_items eri
            ON eri.id = bbr.request_item_id

        INNER JOIN public.emergency_requests er
            ON er.id = eri.request_id

        WHERE bbr.blood_bank_id = $1

        ORDER BY bbr.created_at DESC
    `;

    const result = await pool.query(query, [bloodBankId]);

    return result.rows;
};

module.exports = {
    getBloodBankEmergencyHistory
};