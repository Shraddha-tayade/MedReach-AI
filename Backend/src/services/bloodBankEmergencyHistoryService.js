const {
    getBloodBankEmergencyHistory
} = require("../models/bloodBankEmergencyHistoryModel");

const getHistory = async (bloodBankId) => {
    const history = await getBloodBankEmergencyHistory(bloodBankId);

    return {
        success: true,
        count: history.length,
        history
    };
};

module.exports = {
    getHistory
};