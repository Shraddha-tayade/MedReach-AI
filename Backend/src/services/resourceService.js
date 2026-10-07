const resourceModel = require("../models/resourceModel");

const searchBlood = async ({
    bloodGroup,
    bloodComponent,
    unitsRequired,
    latitude,
    longitude,
    radius
}) => {

    const bloodBanks = await resourceModel.searchBloodBanks(
        bloodGroup,
        bloodComponent,
        unitsRequired,
        latitude,
        longitude,
        radius
    );

    return bloodBanks;
};


const searchICU = async ({
    latitude,
    longitude,
    radius
}) => {
    return await resourceModel.searchICUBeds(
        latitude,
        longitude,
        radius
    );
};

const searchOxygen = async ({
    latitude,
    longitude,
    radius
}) => {
    return await resourceModel.searchOxygenBeds(
        latitude,
        longitude,
        radius
    );
};

// Search nearby eligible donors
const searchDonors = async ({
    bloodGroup,
    latitude,
    longitude,
    radius
}) => {

    return await resourceModel.searchDonors(
        bloodGroup,
        latitude,
        longitude,
        radius
    );
};

module.exports = {
    searchBlood,
    searchICU,
    searchOxygen,
    searchDonors
};