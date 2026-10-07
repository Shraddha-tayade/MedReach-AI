const donorModel = require("../models/donorModel");


// ===============================
// GET DONOR PROFILE
// ===============================
const getDonorProfile = async (donorId) => {

    const donor = await donorModel.findDonorById(donorId);

    if (!donor) {
        throw new Error("Donor not found");
    }

    return donor;
};
// -------------------------------
    // BASIC VALIDATION
    // -------------------------------

    if (name !== undefined && !String(name).trim()) {
        throw new Error("Name cannot be empty");
    }


    if (phone !== undefined) {

        const phoneRegex = /^[0-9]{10,15}$/;

        if (!phoneRegex.test(String(phone))) {
            throw new Error("Invalid phone number");
        }
    }


    if (latitude !== undefined || longitude !== undefined) {

        if (
            latitude === undefined ||
            longitude === undefined
        ) {
            throw new Error(
                "Both latitude and longitude are required"
            );
        }

        const lat = Number(latitude);
        const lng = Number(longitude);

        if (
            !Number.isFinite(lat) ||
            lat < -90 ||
            lat > 90
        ) {
            throw new Error("Invalid latitude");
        }

        if (
            !Number.isFinite(lng) ||
            lng < -180 ||
            lng > 180
        ) {
            throw new Error("Invalid longitude");
        }
    }

    module.exports = {
    getDonorProfile
};