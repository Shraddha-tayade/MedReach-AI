const pool = require("../config/db");

const createHistory = async ({
    inventory_id,
    transaction_type,
    units,
    reference_id = null,
    notes = null
}) => {

    const query = `
        INSERT INTO blood_stock_transactions (
            inventory_id,
            transaction_type,
            units,
            reference_id,
            notes
        )
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *;
    `;

    const result = await pool.query(query, [
        inventory_id,
        transaction_type,
        units,
        reference_id,
        notes
    ]);

    return result.rows[0];
};


const getBloodBankHistory = async (blood_bank_id) => {

    const query = `
        SELECT
            t.id AS transaction_id,
            t.inventory_id,
            i.blood_group,
            i.blood_component,
            i.batch_number,
            t.transaction_type,
            t.units,
            t.reference_id,
            t.notes,
            t.created_at
        FROM blood_stock_transactions t
        INNER JOIN blood_inventory i
            ON t.inventory_id = i.id
        WHERE i.blood_bank_id = $1
        ORDER BY t.created_at DESC;
    `;

    const result = await pool.query(query, [
        blood_bank_id
    ]);

    return result.rows;
};


module.exports = {
    createHistory,
    getBloodBankHistory
};