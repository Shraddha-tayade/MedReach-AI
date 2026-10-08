const {
    createICUInventory,
    getICUInventoryByHospital,
    updateICUInventory
} = require("../models/icuBedInventoryModel");


const addICUInventory = async ({
    hospital_id,
    total_beds,
    available_beds,
    reserved_beds,
    occupied_beds
}) => {

    if (!hospital_id) {
        throw new Error("Hospital ID is required");
    }

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

    if (total_beds < 0 || available_beds < 0) {
        throw new Error(
            "Bed count cannot be negative"
        );
    }

    if (available_beds > total_beds) {
        throw new Error(
            "Available beds cannot be greater than total beds"
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

   return await createICUInventory({
    hospital_id,
    total_beds,
    available_beds,
    reserved_beds,
    occupied_beds
});
};


const fetchICUInventory = async (hospital_id) => {

    if (!hospital_id) {
        throw new Error(
            "Hospital ID is required"
        );
    }

    return await getICUInventoryByHospital(
        hospital_id
    );
};


const changeICUInventory = async (
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

    return await updateICUInventory(
        hospital_id,
        total_beds,
        available_beds,
        reserved_beds,
        occupied_beds
    );
};


module.exports = {
    addICUInventory,
    fetchICUInventory,
    changeICUInventory
};