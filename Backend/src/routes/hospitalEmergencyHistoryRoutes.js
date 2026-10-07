const express = require("express");

const router = express.Router();

const authenticateToken = require("../middleware/authMiddleware");

const {
    getHospitalHistory
} = require("../controllers/hospitalEmergencyHistoryController");


router.get(
    "/",
    authenticateToken,
    getHospitalHistory
);

module.exports = router;