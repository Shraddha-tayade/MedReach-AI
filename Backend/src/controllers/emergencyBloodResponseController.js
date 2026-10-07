const {
    respondToEmergencyBloodRequest,
    processConfirmedBloodBankSelection,
    cancelEmergencyBloodRequest,
    markEmergencyBloodArrived,
    issueEmergencyBlood
} = require("../services/emergencyBloodResponseService");


/*
===========================================================
BLOOD BANK ONLY
===========================================================
*/

const checkBloodBankRole = (req, res) => {

    const role = String(
        req.user?.type ||
        req.user?.role ||
        ""
    ).toLowerCase();

    if (role !== "blood_bank") {

        res.status(403).json({
            success: false,
            message:
                "Only blood banks can access this route"
        });

        return false;
    }

    return true;
};


/*
===========================================================
1. ACCEPT / REJECT
===========================================================
*/

const respondToEmergencyBloodRequestController =
    async (req, res) => {

        try {

            if (!checkBloodBankRole(req, res)) {
                return;
            }

            const requestId =
                Number(req.params.requestId);

            const requestItemId =
                Number(req.params.requestItemId);

            const bloodBankId =
                Number(req.user.id);

            const {
                status,
                response_message
            } = req.body;

            if (!requestId || !requestItemId) {

                return res.status(400).json({
                    success: false,
                    message:
                        "Invalid request ID or request item ID"
                });
            }

            if (
                status !== "ACCEPTED" &&
                status !== "REJECTED"
            ) {

                return res.status(400).json({
                    success: false,
                    message:
                        "Status must be ACCEPTED or REJECTED"
                });
            }

            const result =
                await respondToEmergencyBloodRequest({
                    requestId,
                    requestItemId,
                    bloodBankId,
                    status,
                    responseMessage:
                        response_message
                });

            return res.status(200).json(result);

        } catch (error) {

            console.error(
                "Emergency Blood Response Error:",
                error
            );

            return res.status(400).json({
                success: false,
                message: error.message
            });
        }
    };


/*
===========================================================
2. USER CONFIRMED BLOOD BANK
   → RESERVE BLOOD
===========================================================
*/

const confirmBloodBank =
    async (req, res) => {

        try {

            if (!checkBloodBankRole(req, res)) {
                return;
            }

            const requestId =
                Number(req.params.requestId);

            const requestItemId =
                Number(req.params.requestItemId);

            const bloodBankId =
                Number(req.params.bloodBankId);

            const loggedInBloodBankId =
                Number(req.user.id);

            /*
            ------------------------------------------------
            Security check
            ------------------------------------------------
            */

            if (
                bloodBankId !==
                loggedInBloodBankId
            ) {

                return res.status(403).json({
                    success: false,
                    message:
                        "You cannot reserve blood for another blood bank"
                });
            }

            const result =
                await processConfirmedBloodBankSelection({
                    requestId,
                    requestItemId,
                    bloodBankId
                });

            return res.status(200).json(result);

        } catch (error) {

            console.error(
                "Confirm Blood Bank Error:",
                error
            );

            return res.status(400).json({
                success: false,
                message: error.message
            });
        }
    };


/*
===========================================================
3. CANCEL
===========================================================
*/

const cancelEmergencyBloodRequestController =
    async (req, res) => {

        try {

            if (!checkBloodBankRole(req, res)) {
                return;
            }

            const requestId =
                Number(req.params.requestId);

            const requestItemId =
                Number(req.params.requestItemId);

            const bloodBankId =
                Number(req.user.id);

            const result =
                await cancelEmergencyBloodRequest({
                    requestId,
                    requestItemId,
                    bloodBankId
                });

            return res.status(200).json(result);

        } catch (error) {

            console.error(
                "Cancel Emergency Blood Error:",
                error
            );

            return res.status(400).json({
                success: false,
                message: error.message
            });
        }
    };


/*
===========================================================
4. ARRIVED
===========================================================
*/

const markEmergencyBloodArrivedController =
    async (req, res) => {

        try {

            if (!checkBloodBankRole(req, res)) {
                return;
            }

            const requestId =
                Number(req.params.requestId);

            const requestItemId =
                Number(req.params.requestItemId);

            const bloodBankId =
                Number(req.user.id);

            const result =
                await markEmergencyBloodArrived({
                    requestId,
                    requestItemId,
                    bloodBankId
                });

            return res.status(200).json(result);

        } catch (error) {

            console.error(
                "Mark Blood Arrival Error:",
                error
            );

            return res.status(400).json({
                success: false,
                message: error.message
            });
        }
    };


/*
===========================================================
5. ISSUE BLOOD
===========================================================
*/

const issueEmergencyBloodController =
    async (req, res) => {

        try {

            if (!checkBloodBankRole(req, res)) {
                return;
            }

            const requestId =
                Number(req.params.requestId);

            const requestItemId =
                Number(req.params.requestItemId);

            const bloodBankId =
                Number(req.user.id);

            const result =
                await issueEmergencyBlood({
                    requestId,
                    requestItemId,
                    bloodBankId
                });

            return res.status(200).json(result);

        } catch (error) {

            console.error(
                "Issue Emergency Blood Error:",
                error
            );

            return res.status(400).json({
                success: false,
                message: error.message
            });
        }
    };


module.exports = {
    respondToEmergencyBloodRequest:
        respondToEmergencyBloodRequestController,

    confirmBloodBank,

    cancelEmergencyBloodRequest:
        cancelEmergencyBloodRequestController,

    markEmergencyBloodArrived:
        markEmergencyBloodArrivedController,

    issueEmergencyBlood:
        issueEmergencyBloodController
};