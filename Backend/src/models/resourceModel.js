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


const searchHospitalBeds = async (
    inventoryTable,
    latitude,
    longitude,
    radius
) => {
    // Allow only predefined table names
    const allowedTables = {
        icu: "icu_bed_inventory",
        oxygen: "oxygen_bed_inventory"
    };

    const tableName = allowedTables[inventoryTable];

    if (!tableName) {
        throw new Error("Invalid inventory type");
    }

    const radiusInMeters = radius * 1000;

    const query = `
        SELECT
            h.id AS hospital_id,
            h.hospital_name,
            h.contact,
            h.address_line,
            h.city,
            h.state,
            h.pincode,

            i.total_beds,
            i.available_beds,
            i.reserved_beds,
            i.occupied_beds,
            i.last_updated_at,

            ROUND(
                (
                    ST_Distance(
                        h.location,
                        ST_SetSRID(
                            ST_MakePoint($1, $2),
                            4326
                        )::geography
                    ) / 1000
                )::numeric,
                2
            ) AS distance_km

        FROM hospitals h

        JOIN ${tableName} i
            ON h.id = i.hospital_id

        WHERE
            h.verification_status = 'APPROVED'
            AND h.location IS NOT NULL
            AND i.status = 'AVAILABLE'
            AND i.available_beds > 0

            AND ST_DWithin(
                h.location,
                ST_SetSRID(
                    ST_MakePoint($1, $2),
                    4326
                )::geography,
                $3
            )

        ORDER BY distance_km ASC;
    `;

    const values = [
        longitude,
        latitude,
        radiusInMeters
    ];

    const result = await pool.query(query, values);

    return result.rows;
};

const searchICUBeds = (latitude, longitude, radius) => {
    return searchHospitalBeds(
        "icu",
        latitude,
        longitude,
        radius
    );
};

const searchOxygenBeds = (latitude, longitude, radius) => {
    return searchHospitalBeds(
        "oxygen",
        latitude,
        longitude,
        radius
    );
};

// =====================================================
// SEARCH DONORS
// =====================================================

const searchDonors = async (
    bloodGroup,
    latitude,
    longitude,
    radiusInKm
) => {

    const radiusInMeters = radiusInKm * 1000;

    const query = `
        SELECT
            d.id AS donor_id,
            d.name,
            d.phone,
            d.blood_group,
            d.city,
            d.state,
            d.pincode,

            ROUND(
                ST_Distance(
                    d.location,
                    ST_SetSRID(
                        ST_MakePoint($1, $2),
                        4326
                    )::geography
                )::numeric / 1000,
                2
            ) AS distance_km,

            ST_Y(d.location::geometry) AS latitude,
            ST_X(d.location::geometry) AS longitude

        FROM donors d

        WHERE
            d.blood_group = $3
            AND d.is_available = true
            AND d.location IS NOT NULL

            AND (
                d.last_donation_date IS NULL
                OR d.last_donation_date <= CURRENT_DATE - INTERVAL '90 days'
            )

            AND ST_DWithin(
                d.location,
                ST_SetSRID(
                    ST_MakePoint($1, $2),
                    4326
                )::geography,
                $4
            )

        ORDER BY distance_km ASC;
    `;

    const values = [
        longitude,
        latitude,
        bloodGroup,
        radiusInMeters
    ];

    const result = await pool.query(query, values);

    return result.rows;
};
module.exports = {
    searchBloodBanks,
    searchICUBeds,
    searchOxygenBeds,
    searchDonors
};