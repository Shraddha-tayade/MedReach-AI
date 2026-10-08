const pool = require("../config/db");

// Create ICU inventory
const createICUInventory = async ({
    hospital_id,
    total_beds,
    available_beds,
    reserved_beds,
    occupied_beds
}) => {
    const status =
        available_beds > 0 ? "AVAILABLE" : "UNAVAILABLE";

    const query = `
        INSERT INTO icu_bed_inventory (
            hospital_id,
            total_beds,
            available_beds,
            reserved_beds,
            occupied_beds,
            status
        )
       VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING *;
    `;

    const result = await pool.query(query, [
    hospital_id,
    total_beds,
    available_beds,
    reserved_beds,
    occupied_beds,
    status
]);

    return result.rows[0];
};

// Get ICU inventory
const getICUInventoryByHospital = async (hospital_id) => {
    const query = `
        SELECT *
        FROM icu_bed_inventory
        WHERE hospital_id = $1;
    `;

    const result = await pool.query(query, [hospital_id]);

    return result.rows[0];
};

// Update ICU inventory
const updateICUInventory = async (
    hospital_id,
    total_beds,
    available_beds,
    reserved_beds,
    occupied_beds
) => {
    const status =
        available_beds > 0
            ? "AVAILABLE"
            : "UNAVAILABLE";

    const query = `
        UPDATE icu_bed_inventory
        SET
            total_beds = $1,
            available_beds = $2,
            reserved_beds = $3,
            occupied_beds = $4,
            status = $5,
            last_updated_at = CURRENT_TIMESTAMP,
            updated_at = CURRENT_TIMESTAMP
        WHERE hospital_id = $6
        RETURNING *;
    `;

    const result = await pool.query(query, [
        total_beds,
        available_beds,
        reserved_beds,
        occupied_beds,
        status,
        hospital_id
    ]);

    return result.rows[0];
};

module.exports = {
    createICUInventory,
    getICUInventoryByHospital,
    updateICUInventory
};