const express = require("express");

const router = express.Router();

const authMiddleware =
    require("../middleware/authMiddleware");

const donorController =
    require("../controllers/donorController");


// ===============================
// DONOR PROFILE
// ===============================

router.get(
    "/profile",
    authMiddleware,
    donorController.getProfile
);



module.exports = router;