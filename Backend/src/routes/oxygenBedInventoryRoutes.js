const express = require("express");

const router = express.Router();

const authenticateToken =
    require("../middleware/authMiddleware");

const {
    createOxygenInventory,
    getOxygenInventory,
    updateOxygenInventory
} = require("../controllers/oxygenBedInventoryController");

router.post(
    "/",
    authenticateToken,
    createOxygenInventory
);

router.get(
    "/",
    authenticateToken,
    getOxygenInventory
);

router.put(
    "/",
    authenticateToken,
    updateOxygenInventory
);

module.exports = router;