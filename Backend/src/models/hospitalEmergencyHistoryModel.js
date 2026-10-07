const pool = require("../config/db");

const getHospitalHistory = async (hospitalId) => {
    const query = `
        SELECT
            hrr.id AS response_id,
            hrr.request_item_id,

            eri.resource_type,
            eri.quantity,
            eri.blood_group,
            eri.blood_component,

            er.id AS request_id,
            er.status AS request_status,
            er.address_line,
            er.city,
            er.state,
            er.pincode,
            er.description,
            er.created_at AS request_created_at,

            hrr.status AS response_status,
            hrr.response_message,
            hrr.quantity_offered,
            hrr.estimated_arrival_minutes,
            hrr.buffer_minutes,
            hrr.arrival_deadline,
            hrr.responded_at,
            hrr.arrived_at,
            hrr.completed_at,
            hrr.created_at AS response_created_at,
            hrr.updated_at AS response_updated_at,

            u.id AS user_id,
            u.name AS user_name,
            u.phone AS user_phone

        FROM public.hospital_request_responses hrr

        INNER JOIN public.emergency_request_items eri
            ON eri.id = hrr.request_item_id

        INNER JOIN public.emergency_requests er
            ON er.id = eri.request_id

        INNER JOIN public.users u
            ON u.id = er.user_id

        WHERE hrr.hospital_id = $1

        ORDER BY hrr.created_at DESC
    `;

    const result = await pool.query(query, [hospitalId]);

    return result.rows;
};


module.exports = {
    getHospitalHistory
};

