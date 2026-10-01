const pool = require("../config/db");

const searchBloodBanks = async (
    bloodGroup,
    bloodComponent,
    unitsRequired,
    latitude,
    longitude,
    radiusInKm
) => {

    const radiusInMeters = radiusInKm * 1000;

    const query = `
        SELECT
            bb.id AS blood_bank_id,
            bb.blood_bank_name,
            bb.contact,
            bb.address_line,
            bb.city,
            bb.state,
            bb.pincode,

            bi.blood_group,
            bi.blood_component,
            bi.units_available,

            ROUND(
                ST_Distance(
                    bb.location,
                    ST_SetSRID(
                        ST_MakePoint($1, $2),
                        4326
                    )::geography
                )::numeric / 1000,
                2
            ) AS distance_km

        FROM blood_banks bb

        JOIN blood_inventory bi
            ON bb.id = bi.blood_bank_id

        WHERE
    bb.verification_status = 'APPROVED'
    AND bi.blood_group = $3
    AND bi.blood_component = $4
    AND bi.units_available >= $5
    AND bi.expiry_date >= CURRENT_DATE
    AND bi.status = 'AVAILABLE'
    AND ST_DWithin(
        bb.location,
        ST_SetSRID(
            ST_MakePoint($1, $2),
            4326
        )::geography,
        $6
    )

        ORDER BY distance_km ASC;
    `;

    const values = [
        longitude,       // $1
        latitude,        // $2
        bloodGroup,      // $3
        bloodComponent,  // $4
        unitsRequired,   // $5
        radiusInMeters   // $6
    ];

    const result = await pool.query(query, values);

    return result.rows;
};

module.exports = {
    searchBloodBanks
};