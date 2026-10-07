const express = require("express");

const router = express.Router();

const authenticateToken = require("../middleware/authMiddleware");
const { updateProfile , viewProfile} = require("../controllers/profilesController");
//http://localhost:5000/api/profile

router.put("/", authenticateToken, updateProfile);
router.get("/", authenticateToken, viewProfile);

module.exports = router;
