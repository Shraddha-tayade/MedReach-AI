const express = require("express");
const router = express.Router();

const authenticateToken = require("../middleware/authMiddleware");
const controller = require("../controllers/hospitalBloodRequestController");

const hospitalOnly = (req, res, next) => {
    const userType = req.user?.type || req.user?.role;

    if (
        !userType ||
        userType.toLowerCase() !== "hospital"
    ) {
        return res.status(403).json({
            message:
                "Access denied. Hospital access required."
        });
    }

    next();
};

router.post(
    "/",
    authenticateToken,
    hospitalOnly,
    controller.createRequest
);

router.get(
    "/",
    authenticateToken,
    hospitalOnly,
    controller.getMyRequests
);

// IMPORTANT: /history must come BEFORE /:id
router.get(
    "/history",
    authenticateToken,
    hospitalOnly,
    controller.getHospitalHistory
);

router.get(
    "/:id",
    authenticateToken,
    hospitalOnly,
    controller.getRequestById
);

module.exports = router;