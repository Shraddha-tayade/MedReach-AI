const express = require("express");

const router = express.Router();

const authenticateToken = require("../middleware/authMiddleware");

const hospitalEmergencyRequestController =
    require("../controllers/hospitalEmergencyRequestController");


router.get(
    "/",
    authenticateToken,
    hospitalEmergencyRequestController.getHospitalEmergencyRequests
);

module.exports = router;