const model = require("../models/emergencyBloodRequestModel");

const getBloodRequestsForBloodBank = async () => {
    return await model.getBloodRequestsForBloodBank();
};

module.exports = {
    getBloodRequestsForBloodBank
};