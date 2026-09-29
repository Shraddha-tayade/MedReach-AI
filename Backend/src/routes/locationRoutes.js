const express = require("express");

const {
    resolveLocation
} = require("../controllers/locationController");

const router = express.Router();

router.post("/resolve", resolveLocation);

module.exports = router;