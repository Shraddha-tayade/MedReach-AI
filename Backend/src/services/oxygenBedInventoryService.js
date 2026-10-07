const {
    createOxygenInventory,
    getOxygenInventoryByHospital,
    updateOxygenInventory
} = require("../models/oxygenBedInventoryModel");

const addOxygenInventory = async ({
    hospital_id,
    total_beds,
    available_beds
}) => {
    if (!hospital_id) {
        throw new Error("Hospital ID is required");
    }

    if (
        total_beds === undefined ||
        available_beds === undefined
    ) {
        throw new Error(
            "Total beds and available beds are required"
        );
    }

    if (
        total_beds < 0 ||
        available_beds < 0
    ) {
        throw new Error(
            "Bed count cannot be negative"
        );
    }

    if (available_beds > total_beds) {
        throw new Error(
            "Available beds cannot be greater than total beds"
        );
    }

    return await createOxygenInventory({
        hospital_id,
        total_beds,
        available_beds
    });
};

const fetchOxygenInventory = async (
    hospital_id
) => {
    if (!hospital_id) {
        throw new Error(
            "Hospital ID is required"
        );
    }

    return await getOxygenInventoryByHospital(
        hospital_id
    );
};

const changeOxygenInventory = async (
    hospital_id,
    total_beds,
    available_beds,
    reserved_beds,
    occupied_beds
) => {
    if (
        total_beds === undefined ||
        available_beds === undefined ||
        reserved_beds === undefined ||
        occupied_beds === undefined
    ) {
        throw new Error(
            "All bed counts are required"
        );
    }

    if (
        total_beds < 0 ||
        available_beds < 0 ||
        reserved_beds < 0 ||
        occupied_beds < 0
    ) {
        throw new Error(
            "Bed counts cannot be negative"
        );
    }

    if (
        total_beds !==
        available_beds +
        reserved_beds +
        occupied_beds
    ) {
        throw new Error(
            "Total beds must equal available + reserved + occupied"
        );
    }

    return await updateOxygenInventory(
        hospital_id,
        total_beds,
        available_beds,
        reserved_beds,
        occupied_beds
    );
};

module.exports = {
    addOxygenInventory,
    fetchOxygenInventory,
    changeOxygenInventory
};