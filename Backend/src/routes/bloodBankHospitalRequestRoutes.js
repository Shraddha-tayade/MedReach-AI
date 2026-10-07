const express = require("express");
const router = express.Router();

const authenticateToken = require("../middleware/authMiddleware");
const controller = require("../controllers/hospitalBloodRequestController");

// Role check - Blood Bank only
const bloodBankOnly = (req, res, next) => {
    const userType = req.user?.type || req.user?.role;

    if (!userType || userType.toLowerCase() !== "blood_bank") {
        return res.status(403).json({
            message: "Access denied. Blood bank access required."
        });
    }

    next();
};


// IMPORTANT:
// /history must come before /:id

// Blood bank history
router.get(
    "/history",
    authenticateToken,
    bloodBankOnly,
    controller.getHistory
);


// Blood bank sees pending hospital requests
router.get(
    "/",
    authenticateToken,
    bloodBankOnly,
    controller.getPendingRequests
);


// Blood bank accepts/rejects request
router.put(
    "/:id",
    authenticateToken,
    bloodBankOnly,
    controller.respondToRequest
);

module.exports = router;