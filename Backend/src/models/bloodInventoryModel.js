const pool = require("../config/db");

// ==========================
// ADD BLOOD INVENTORY
// ==========================
const createInventory = async (data) => {
    const {
        blood_bank_id,
        blood_group,
        blood_component,
        batch_number,
        units_collected,
        units_available,
        collection_date,
        expiry_date
    } = data;

    const query = `
        INSERT INTO blood_inventory (
            blood_bank_id,
            blood_group,
            blood_component,
            batch_number,
            units_collected,
            units_available,
            collection_date,
            expiry_date
        )
        VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
        RETURNING
            id,
            blood_bank_id,
            blood_group,
            blood_component,
            batch_number,
            units_collected,
            units_available,
            collection_date,
            expiry_date,
            status,
            created_at,
            updated_at;
    `;

    const result = await pool.query(query, [
        blood_bank_id,
        blood_group,
        blood_component,
        batch_number,
        units_collected,
        units_available,
        collection_date,
        expiry_date
    ]);

    return result.rows[0];
};


// ==========================
// GET INVENTORY
// ==========================
const getInventoryByBloodBank = async (blood_bank_id) => {

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
            status,
            created_at,
            updated_at
        FROM blood_inventory
        WHERE blood_bank_id = $1
        ORDER BY expiry_date ASC;
    `;

    const result = await pool.query(query, [blood_bank_id]);

    return result.rows;
};


// ==========================
// UPDATE AVAILABLE UNITS
// ==========================
const updateInventoryUnits = async (
    id,
    blood_bank_id,
    units_available
) => {

    const query = `
        UPDATE blood_inventory
        SET
            units_available = $1,
            updated_at = NOW()
        WHERE id = $2
        AND blood_bank_id = $3
        RETURNING
            id,
            blood_bank_id,
            blood_group,
            blood_component,
            batch_number,
            units_collected,
            units_available,
            collection_date,
            expiry_date,
            status,
            updated_at;
    `;

    const result = await pool.query(query, [
        units_available,
        id,
        blood_bank_id
    ]);

    return result.rows[0];
};


// ==========================
// DISCARD INVENTORY
// ==========================
const discardInventory = async (
    id,
    blood_bank_id
) => {

    const query = `
        UPDATE blood_inventory
        SET
            status = 'DISCARDED',
            units_available = 0,
            updated_at = NOW()
        WHERE id = $1
        AND blood_bank_id = $2
        RETURNING
            id,
            blood_bank_id,
            blood_group,
            blood_component,
            batch_number,
            units_available,
            status,
            updated_at;
    `;

    const result = await pool.query(query, [
        id,
        blood_bank_id
    ]);

    return result.rows[0];
};


module.exports = {
    createInventory,
    getInventoryByBloodBank,
    updateInventoryUnits,
    discardInventory
};