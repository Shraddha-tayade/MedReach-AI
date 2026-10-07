const express = require("express");

const {
    searchBlood,
     searchICU,
    searchOxygen, 
    searchDonors
} = require("../controllers/resourceController");

const router = express.Router();

router.post("/blood/search", searchBlood);
router.post("/icu/search", searchICU);
router.post("/oxygen/search", searchOxygen);
router.post("/donors/search", searchDonors);

module.exports = router;