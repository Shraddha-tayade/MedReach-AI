const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const donorRequestController =
    require("../controllers/donorRequestController");

// GET /api/donor/requests
router.get(
    "/requests",
    authMiddleware,
    donorRequestController.getDonorIncomingRequests
);

// POST /api/donor/requests/:responseId/accept
router.post(
    "/requests/:responseId/accept",
    authMiddleware,
    donorRequestController.acceptDonorRequest
);

// POST /api/donor/requests/:responseId/reject
router.post(
    "/requests/:responseId/reject",
    authMiddleware,
    donorRequestController.rejectDonorRequest
);

module.exports = router;