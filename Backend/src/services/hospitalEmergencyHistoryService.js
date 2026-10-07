const {
    getHospitalHistory
} = require("../models/hospitalEmergencyHistoryModel");


const getHospitalEmergencyHistory = async (hospitalId) => {

    if (!hospitalId) {
        throw new Error("Hospital ID is required");
    }

    const history = await getHospitalHistory(hospitalId);

    return {
        success: true,
        count: history.length,
        history
    };
};


module.exports = {
    getHospitalEmergencyHistory
};
