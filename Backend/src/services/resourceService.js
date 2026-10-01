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

module.exports = {
    searchBlood
};