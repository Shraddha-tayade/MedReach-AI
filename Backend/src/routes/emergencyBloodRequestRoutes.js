const express = require("express");

const router = express.Router();

const authenticateToken =
    require("../middleware/authMiddleware");

const controller =
    require("../controllers/emergencyBloodRequestController");

const bloodBankOnly = (req, res, next) => {

    const role = String(
        req.user?.type ||
        req.user?.role ||
        ""
    ).toLowerCase();

    if (role !== "blood_bank") {
        return res.status(403).json({
            success: false,
            message: "Only blood banks can access this route"
        });
    }

    next();
};

router.get(
    "/",
    authenticateToken,
    bloodBankOnly,
    controller.getEmergencyBloodRequests
);

module.exports = router;