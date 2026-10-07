
const donorRequestModel = require("../models/donorRequestModel");


// =====================================================
// GET DONOR INCOMING REQUESTS
// =====================================================

const getDonorIncomingRequests = async (donorId) => {

    return await donorRequestModel.getDonorIncomingRequests(
        donorId
    );
};


// =====================================================
// ACCEPT DONOR REQUEST
// =====================================================

const acceptDonorRequest = async ({
    responseId,
    donorId,
    responseMessage
}) => {

    return await donorRequestModel.acceptDonorRequest(
        responseId,
        donorId,
        responseMessage
    );
};


// =====================================================
// REJECT DONOR REQUEST
// =====================================================

const rejectDonorRequest = async ({
    responseId,
    donorId,
    responseMessage
}) => {

    return await donorRequestModel.rejectDonorRequest(
        responseId,
        donorId,
        responseMessage
    );
};


module.exports = {
    getDonorIncomingRequests,
    acceptDonorRequest,
    rejectDonorRequest
};
