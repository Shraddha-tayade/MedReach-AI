const {
    createInventory,
    getInventoryByBloodBank,
    updateInventoryUnits,
    discardInventory
} = require("../models/bloodInventoryModel");


// ==========================
// ADD INVENTORY
// ==========================
const addBloodInventory = async (data) => {

    const {
        blood_group,
        blood_component,
        batch_number,
        units_collected,
        units_available,
        collection_date,
        expiry_date
    } = data;

    if (
        !blood_group ||
        !blood_component ||
        !batch_number ||
        units_collected === undefined ||
        units_available === undefined ||
        !collection_date ||
        !expiry_date
    ) {
        throw new Error(
            "All inventory fields are required"
        );
    }

    if (Number(units_collected) <= 0) {
        throw new Error(
            "Units collected must be greater than 0"
        );
    }

    if (Number(units_available) < 0) {
        throw new Error(
            "Available units cannot be negative"
        );
    }

    if (
        Number(units_available) >
        Number(units_collected)
    ) {
        throw new Error(
            "Available units cannot be greater than collected units"
        );
    }

    if (
        new Date(expiry_date) <=
        new Date(collection_date)
    ) {
        throw new Error(
            "Expiry date must be after collection date"
        );
    }

    return await createInventory(data);
};


// ==========================
// GET INVENTORY
// ==========================
const getBloodBankInventory = async (
    blood_bank_id
) => {

    return await getInventoryByBloodBank(
        blood_bank_id
    );
};


// ==========================
// UPDATE AVAILABLE UNITS
// ==========================
const changeAvailableUnits = async (
    id,
    blood_bank_id,
    units_available
) => {

    if (units_available === undefined) {
        throw new Error(
            "units_available is required"
        );
    }

    if (Number(units_available) < 0) {
        throw new Error(
            "Available units cannot be negative"
        );
    }

    // Get existing inventory
    const inventoryList =
        await getInventoryByBloodBank(blood_bank_id);

    // Find the requested inventory
    const inventory = inventoryList.find(
        item => Number(item.id) === Number(id)
    );

    if (!inventory) {
        throw new Error(
            "Inventory record not found"
        );
    }

    // Check against collected units BEFORE UPDATE
    if (
        Number(units_available) >
        Number(inventory.units_collected)
    ) {
        throw new Error(
            "Available units cannot be greater than collected units"
        );
    }

    // Update database only after validation
    return await updateInventoryUnits(
        id,
        blood_bank_id,
        units_available
    );
};


// ==========================
// DISCARD INVENTORY
// ==========================
const discardBloodInventory = async (
    id,
    blood_bank_id
) => {

    const inventory = await discardInventory(
        id,
        blood_bank_id
    );

    if (!inventory) {
        throw new Error(
            "Inventory record not found"
        );
    }

    return inventory;
};


module.exports = {
    addBloodInventory,
    getBloodBankInventory,
    changeAvailableUnits,
    discardBloodInventory
};