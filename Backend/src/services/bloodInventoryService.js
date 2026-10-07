const {
    createInventory,
    getInventoryByBloodBank,
    updateInventoryUnits,
    useBloodUnits,
    expireBloodInventory
} = require("../models/bloodInventoryModel");

const {
    createHistory
} = require("../models/bloodBankHistoryModel");


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

    // Create inventory
    const inventory = await createInventory(data);

    // Create RECEIVED history
    await createHistory({
        inventory_id: inventory.id,
        transaction_type: "RECEIVED",
        units: Number(units_collected),
        notes: "Blood inventory added"
    });

    return inventory;
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
// Used only when blood bank needs
// to correct an inventory mistake.

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

    const inventoryList =
        await getInventoryByBloodBank(blood_bank_id);

    const inventory = inventoryList.find(
        item => Number(item.id) === Number(id)
    );

    if (!inventory) {
        throw new Error(
            "Inventory record not found"
        );
    }

    if (
        Number(units_available) >
        Number(inventory.units_collected)
    ) {
        throw new Error(
            "Available units cannot be greater than collected units"
        );
    }

    return await updateInventoryUnits(
        id,
        blood_bank_id,
        units_available
    );
};


// ==========================
// USE BLOOD
// ==========================
// Called when blood bank actually
// gives blood to the patient/user.

const useBlood = async (
    id,
    blood_bank_id,
    units_used,
    reference_id = null
) => {

    if (units_used === undefined) {
        throw new Error(
            "units_used is required"
        );
    }

    if (Number(units_used) <= 0) {
        throw new Error(
            "Units used must be greater than 0"
        );
    }

    // Update inventory
    const inventory = await useBloodUnits(
        id,
        blood_bank_id,
        Number(units_used)
    );

    if (!inventory) {
        throw new Error(
            "Insufficient blood units or inventory is unavailable"
        );
    }

    // Create USED history
    await createHistory({
        inventory_id: inventory.id,
        transaction_type: "USED",
        units: Number(units_used),
        reference_id: reference_id,
        notes: "Blood given to patient"
    });

    return inventory;
};


// ==========================
// EXPIRE BLOOD
// ==========================
// Finds expired blood,
// marks it EXPIRED,
// and creates EXPIRED history.

const expireBlood = async () => {

    const expiredInventory =
        await expireBloodInventory();

    for (const inventory of expiredInventory) {

        await createHistory({
            inventory_id: inventory.id,
            transaction_type: "EXPIRED",
            units: Number(inventory.expired_units),
            notes: "Blood inventory expired"
        });
    }

    return expiredInventory;
};


module.exports = {
    addBloodInventory,
    getBloodBankInventory,
    changeAvailableUnits,
    useBlood,
    expireBlood
};