const hospitalEmergencyResponseService =
    require("../services/hospitalEmergencyResponseService");


// =====================================================
// ACCEPT / REJECT EMERGENCY REQUEST
// =====================================================
const respondToEmergencyRequest = async (req, res) => {
    try {
        const { requestId, requestItemId } = req.params;

        const {
            status,
            responseMessage
        } = req.body;

        const hospitalId = req.user.id;

        const response =
            await hospitalEmergencyResponseService
                .respondToEmergencyRequest({
                    requestId,
                    requestItemId,
                    hospitalId,
                    status,
                    responseMessage
                });

        res.status(200).json({
            success: true,
            message:
                `Emergency request ${status.toLowerCase()} successfully`,
            response
        });

    } catch (error) {
        console.error(
            "Hospital Emergency Response Error:",
            error
        );

        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};


// =====================================================
// CONFIRM HOSPITAL SELECTION
// =====================================================
const confirmHospitalSelection = async (req, res) => {
    try {
        const {
            requestId,
            requestItemId,
            hospitalId
        } = req.params;

        const result =
            await hospitalEmergencyResponseService
                .confirmHospitalSelection({
                    requestId,
                    requestItemId,
                    hospitalId
                });

        res.status(200).json({
            success: true,
            ...result
        });

    } catch (error) {
        console.error(
            "Hospital Confirmation Error:",
            error
        );

        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};


// =====================================================
// CANCEL RESERVATION
// =====================================================
const cancelHospitalReservation = async (req, res) => {
    try {
        const {
            requestId,
            requestItemId
        } = req.params;

        const hospitalId = req.user.id;

        const result =
            await hospitalEmergencyResponseService
                .cancelHospitalReservation({
                    requestId,
                    requestItemId,
                    hospitalId
                });

        res.status(200).json({
            success: true,
            ...result
        });

    } catch (error) {
        console.error(
            "Hospital Cancellation Error:",
            error
        );

        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};


// =====================================================
// PATIENT ARRIVED
// =====================================================
const markHospitalArrived = async (req, res) => {
    try {
        const {
            requestId,
            requestItemId
        } = req.params;

        const hospitalId = req.user.id;

        const result =
            await hospitalEmergencyResponseService
                .markHospitalArrived({
                    requestId,
                    requestItemId,
                    hospitalId
                });

        res.status(200).json({
            success: true,
            ...result
        });

    } catch (error) {
        console.error(
            "Hospital Arrived Error:",
            error
        );

        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};


// =====================================================
// COMPLETE REQUEST
// =====================================================
const completeHospitalRequest = async (req, res) => {
    try {
        const {
            requestId,
            requestItemId
        } = req.params;

        const hospitalId = req.user.id;

        const completedByUserId =
            req.body.completedByUserId || null;

        const result =
            await hospitalEmergencyResponseService
                .completeHospitalRequest({
                    requestId,
                    requestItemId,
                    hospitalId,
                    completedByUserId
                });

        res.status(200).json({
            success: true,
            ...result
        });

    } catch (error) {
        console.error(
            "Hospital Complete Error:",
            error
        );

        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};


module.exports = {
    respondToEmergencyRequest,
    confirmHospitalSelection,
    cancelHospitalReservation,
    markHospitalArrived,
    completeHospitalRequest
};