
const emergencyRequestService =
    require("../services/emergencyRequestService");


// =====================================================
// CREATE EMERGENCY REQUEST
// =====================================================

const createEmergencyRequest = async (req, res) => {

    try {

        const userId = req.user.id;

        const request =
            await emergencyRequestService.createEmergencyRequest(
                userId,
                req.body
            );

        return res.status(201).json({
            message:
                "Emergency request created successfully",
            request
        });

    } catch (error) {

        console.error(
            "Create emergency request error:",
            error
        );

        return res.status(400).json({
            message:
                error.message ||
                "Failed to create emergency request"
        });
    }
};


// =====================================================
// GET SINGLE EMERGENCY REQUEST
// =====================================================

const getEmergencyRequest = async (req, res) => {

    try {

        const userId = req.user.id;
        const requestId = Number(req.params.id);

        if (
            !Number.isInteger(requestId) ||
            requestId <= 0
        ) {
            return res.status(400).json({
                message: "Invalid request ID"
            });
        }

        const request =
            await emergencyRequestService.getEmergencyRequest(
                requestId,
                userId
            );

        if (!request) {
            return res.status(404).json({
                message:
                    "Emergency request not found"
            });
        }

        return res.status(200).json({
            message:
                "Emergency request fetched successfully",
            request
        });

    } catch (error) {

        console.error(
            "Get emergency request error:",
            error
        );

        return res.status(500).json({
            message:
                "Failed to fetch emergency request"
        });
    }
};


// =====================================================
// GET REQUEST STATUS
// =====================================================

const getEmergencyRequestStatus = async (req, res) => {

    try {

        const userId = req.user.id;
        const requestId = Number(req.params.id);

        if (
            !Number.isInteger(requestId) ||
            requestId <= 0
        ) {
            return res.status(400).json({
                message: "Invalid request ID"
            });
        }

        const status =
            await emergencyRequestService.getEmergencyRequestStatus(
                requestId,
                userId
            );

        return res.status(200).json({
            message:
                "Emergency request status fetched successfully",
            status
        });

    } catch (error) {

        console.error(
            "Get emergency request status error:",
            error
        );

        return res.status(404).json({
            message: error.message
        });
    }
};


// =====================================================
// GET PROVIDER RESPONSES
// =====================================================

const getRequestResponses = async (req, res) => {

    try {

        const userId = req.user.id;
        const requestId = Number(req.params.id);

        if (
            !Number.isInteger(requestId) ||
            requestId <= 0
        ) {
            return res.status(400).json({
                message: "Invalid request ID"
            });
        }

        const responses =
            await emergencyRequestService.getRequestResponses(
                requestId,
                userId
            );

        return res.status(200).json({
            message:
                "Emergency request responses fetched successfully",
            count: responses.length,
            responses
        });

    } catch (error) {

        console.error(
            "Get request responses error:",
            error
        );

        return res.status(500).json({
            message:
                "Failed to fetch request responses"
        });
    }
};


// =====================================================
// SEND REQUEST TO SELECTED PROVIDERS
// =====================================================

const sendRequestToProviders = async (req, res) => {

    try {

        const userId = req.user.id;

        const requestItemId =
            Number(req.params.itemId);

        if (
            !Number.isInteger(requestItemId) ||
            requestItemId <= 0
        ) {
            return res.status(400).json({
                message:
                    "Invalid request item ID"
            });
        }

        const providers = req.body.providers;

        if (
            !Array.isArray(providers) ||
            providers.length === 0
        ) {
            return res.status(400).json({
                message:
                    "At least one provider must be selected"
            });
        }

        if (providers.length > 3) {
            return res.status(400).json({
                message:
                    "Maximum 3 providers can be selected"
            });
        }

        const result =
            await emergencyRequestService.sendRequestToProviders(
                requestItemId,
                userId,
                providers
            );

        return res.status(201).json({
            message:
                "Request sent to selected providers successfully",
            providers: result
        });

    } catch (error) {

        console.error(
            "Send request to providers error:",
            error
        );

        return res.status(400).json({
            message:
                error.message ||
                "Failed to send request to providers"
        });
    }
};


// =====================================================
// CONFIRM PROVIDER + START JOURNEY
// =====================================================

const confirmProvider = async (req, res) => {

    try {

        const userId = req.user.id;

        const providerRequestId =
            Number(req.params.providerRequestId);

        if (
            !Number.isInteger(providerRequestId) ||
            providerRequestId <= 0
        ) {
            return res.status(400).json({
                message:
                    "Invalid provider request ID"
            });
        }

        const result =
            await emergencyRequestService.confirmProvider(
                providerRequestId,
                userId
            );

        return res.status(200).json({
            message:
                "Provider confirmed and journey started successfully",
            provider_request: result
        });

    } catch (error) {

        console.error(
            "Confirm provider error:",
            error
        );

        return res.status(400).json({
            message:
                error.message ||
                "Failed to confirm provider"
        });
    }
};


// =====================================================
// USER EMERGENCY HISTORY
// =====================================================

const getEmergencyRequestHistory = async (req, res) => {

    try {

        const userId = req.user.id;

        const history =
            await emergencyRequestService.getEmergencyRequestHistory(
                userId
            );

        return res.status(200).json({
            message:
                "Emergency request history fetched successfully",
            count: history.length,
            requests: history
        });

    } catch (error) {

        console.error(
            "Get emergency request history error:",
            error
        );

        return res.status(500).json({
            message:
                "Failed to fetch emergency request history"
        });
    }
};

const completeResourceRequest = async (req, res) => {
    try {
        const userId = req.user.id;
        const itemId = Number(req.params.itemId);

        if (!Number.isInteger(itemId) || itemId <= 0) {
            return res.status(400).json({
                message: "Invalid resource item ID"
            });
        }

        const result =
            await emergencyRequestService.completeResourceRequest(
                itemId,
                userId
            );

        return res.status(200).json(result);

    } catch (error) {
        console.error("Complete resource request error:", error);

        return res.status(400).json({
            message: error.message
        });
    }
};


module.exports = {

    createEmergencyRequest,

    getEmergencyRequest,

    getEmergencyRequestStatus,

    getRequestResponses,

    sendRequestToProviders,

    confirmProvider,

    getEmergencyRequestHistory,

    completeResourceRequest

};

