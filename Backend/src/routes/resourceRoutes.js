const express = require("express");

const {
    searchBlood
} = require("../controllers/resourceController");

const router = express.Router();

router.post("/blood/search", searchBlood);

module.exports = router;