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
// GET ACTIVE INVENTORY
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
        AND status = 'AVAILABLE'
        AND units_available > 0
        AND expiry_date >= CURRENT_DATE
        ORDER BY expiry_date ASC;
    `;

    const result = await pool.query(query, [blood_bank_id]);

    return result.rows;
};


// ==========================
// CORRECT AVAILABLE UNITS
// ==========================
// Used only when blood bank needs
// to correct an inventory mistake.

const updateInventoryUnits = async (
    id,
    blood_bank_id,
    units_available
) => {

    const query = `
        UPDATE blood_inventory
        SET
            units_available = $1,

            status = CASE
                WHEN $1 = 0
                THEN 'UNAVAILABLE'
                ELSE 'AVAILABLE'
            END,

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
            created_at,
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
// USE BLOOD UNITS
// ==========================
// Called when blood bank actually
// gives blood to the patient/user.

const useBloodUnits = async (
    id,
    blood_bank_id,
    units_used
) => {

    const query = `
        UPDATE blood_inventory
        SET
            units_available = units_available - $1,

            status = CASE
                WHEN units_available - $1 = 0
                THEN 'UNAVAILABLE'
                ELSE 'AVAILABLE'
            END,

            updated_at = NOW()

        WHERE id = $2
        AND blood_bank_id = $3
        AND status = 'AVAILABLE'
        AND expiry_date >= CURRENT_DATE
        AND units_available >= $1

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
        units_used,
        id,
        blood_bank_id
    ]);

    return result.rows[0];
};


// ==========================
// EXPIRE BLOOD INVENTORY
// ==========================
// Finds expired blood,
// changes status to EXPIRED,
// sets available units to 0,
// and returns the OLD available
// units as expired_units.

const expireBloodInventory = async () => {

    const query = `
        WITH expired AS (
            SELECT
                id,
                units_available AS expired_units
            FROM blood_inventory
            WHERE expiry_date < CURRENT_DATE
            AND status = 'AVAILABLE'
            AND units_available > 0
        )

        UPDATE blood_inventory AS i
        SET
            units_available = 0,
            status = 'EXPIRED',
            updated_at = NOW()

        FROM expired AS e

        WHERE i.id = e.id

        RETURNING
            i.id,
            i.blood_bank_id,
            i.blood_group,
            i.blood_component,
            i.batch_number,
            i.units_collected,
            e.expired_units,
            i.collection_date,
            i.expiry_date,
            i.status,
            i.created_at,
            i.updated_at;
    `;

    const result = await pool.query(query);

    return result.rows;
};


module.exports = {
    createInventory,
    getInventoryByBloodBank,
    updateInventoryUnits,
    useBloodUnits,
    expireBloodInventory
};