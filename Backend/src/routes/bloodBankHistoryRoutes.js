const express = require("express");
const router = express.Router();

//console.log("Blood bank history routes loaded");

const {
    getHistory
} = require("../controllers/bloodBankHistoryController");

router.get("/", getHistory);

module.exports = router;