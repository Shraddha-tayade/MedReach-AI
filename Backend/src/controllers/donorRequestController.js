
const donorRequestService = require("../services/donorRequestService");


// =====================================================
// GET DONOR INCOMING REQUESTS
// =====================================================

const getDonorIncomingRequests = async (req, res) => {

    try {

        const donorId = req.user.id;

        const requests =
            await donorRequestService.getDonorIncomingRequests(
                donorId
            );

        return res.status(200).json({
            success: true,
            count: requests.length,
            requests
        });

    } catch (error) {

        console.error(
            "Get donor incoming requests error:",
            error.message
        );

        return res.status(500).json({
            success: false,
            message: "Unable to fetch donor requests"
        });
    }
};


// =====================================================
// ACCEPT DONOR REQUEST
// =====================================================

const acceptDonorRequest = async (req, res) => {

    try {

        const donorId = req.user.id;

        const responseId =
            Number(req.params.responseId);

        if (!Number.isInteger(responseId)) {

            return res.status(400).json({
                success: false,
                message: "Invalid response ID"
            });

        }

        const {
            responseMessage
        } = req.body;

        const response =
            await donorRequestService.acceptDonorRequest({
                responseId,
                donorId,
                responseMessage
            });

        return res.status(200).json({
            success: true,
            message: "Donor request accepted successfully",
            response: {
                responseId: response.responseId,
                requestItemId: response.requestItemId,
                donorId: response.donorId,
                status: response.status,
                distanceKm: response.distanceKm,
                estimatedArrivalMinutes:
                    response.estimatedArrivalMinutes,
                bufferMinutes: response.bufferMinutes,
                latestArrival: response.latestArrival
            }
        });

    } catch (error) {

        console.error(
            "Accept donor request error:",
            error.message
        );

        return res.status(400).json({
            success: false,
            message: error.message
        });
    }
};


// =====================================================
// REJECT DONOR REQUEST
// =====================================================

const rejectDonorRequest = async (req, res) => {

    try {

        const donorId = req.user.id;

        const responseId =
            Number(req.params.responseId);

        if (!Number.isInteger(responseId)) {

            return res.status(400).json({
                success: false,
                message: "Invalid response ID"
            });

        }

        const {
            responseMessage
        } = req.body;

        const response =
            await donorRequestService.rejectDonorRequest({
                responseId,
                donorId,
                responseMessage
            });

        return res.status(200).json({
            success: true,
            message: "Donor request rejected successfully",
            response
        });

    } catch (error) {

        console.error(
            "Reject donor request error:",
            error.message
        );

        return res.status(400).json({
            success: false,
            message: error.message
        });
    }
};


module.exports = {
    getDonorIncomingRequests,
    acceptDonorRequest,
    rejectDonorRequest
};

