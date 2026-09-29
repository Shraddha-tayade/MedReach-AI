const express = require("express");

const router = express.Router();

const authenticateToken = require("../middleware/authMiddleware");
const { updateProfile } = require("../controllers/profilesController");

router.put("/", authenticateToken, updateProfile);

module.exports = router;