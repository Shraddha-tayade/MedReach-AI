const express = require("express");

const router = express.Router();

const authenticateToken = require("../middleware/authMiddleware");

const {
    getBloodBankHistory
} = require("../controllers/bloodBankEmergencyHistoryController");

router.get(
    "/",
    authenticateToken,
    getBloodBankHistory
);

module.exports = router;