const hospitalEmergencyRequestModel =
    require("../models/hospitalEmergencyRequestModel");

const getHospitalEmergencyRequests = async (hospitalId) => {
    return await hospitalEmergencyRequestModel
        .getHospitalEmergencyRequests(hospitalId);
};

module.exports = {
    getHospitalEmergencyRequests
};