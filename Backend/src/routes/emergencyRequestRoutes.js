const express = require("express");

const router = express.Router();

const emergencyRequestController =
    require("../controllers/emergencyRequestController");

const authMiddleware =
    require("../middleware/authMiddleware");


// =====================================================
// CREATE EMERGENCY REQUEST
// POST /api/emergency-requests
// =====================================================



router.post(
    "/",
    authMiddleware,
    emergencyRequestController.createEmergencyRequest
);


// =====================================================
// USER REQUEST HISTORY
// GET /api/emergency-requests/history
// =====================================================

router.get(
    "/history",
    authMiddleware,
    emergencyRequestController.getEmergencyRequestHistory
);


// =====================================================
// REQUEST STATUS
// GET /api/emergency-requests/:id/status
// =====================================================

router.get(
    "/:id/status",
    authMiddleware,
    emergencyRequestController.getEmergencyRequestStatus
);


// =====================================================
// REQUEST RESPONSES
// GET /api/emergency-requests/:id/responses
// =====================================================

router.get(
    "/:id/responses",
    authMiddleware,
    emergencyRequestController.getRequestResponses
);


// =====================================================
// SEND REQUEST TO SELECTED PROVIDERS
//
// Maximum 3 providers per resource.
//
// POST
// /api/emergency-requests/items/:itemId/providers
// =====================================================

router.post(
    "/items/:itemId/providers",
    authMiddleware,
    emergencyRequestController.sendRequestToProviders
);


// =====================================================
// CONFIRM PROVIDER + START JOURNEY
//
// POST
// /api/emergency-requests/provider-requests/:providerRequestId/confirm
// =====================================================

router.post(
    "/provider-requests/:providerRequestId/confirm",
    authMiddleware,
    emergencyRequestController.confirmProvider
);


// =====================================================
// GET SINGLE EMERGENCY REQUEST
// GET /api/emergency-requests/:id
// =====================================================

router.get(
    "/:id",
    authMiddleware,
    emergencyRequestController.getEmergencyRequest
);

router.post(
    "/items/:itemId/complete",
    authMiddleware,
    emergencyRequestController.completeResourceRequest
);

module.exports = router;

