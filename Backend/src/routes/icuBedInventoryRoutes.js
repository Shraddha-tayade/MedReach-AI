const express = require("express");

const router = express.Router();

const authenticateToken = require("../middleware/authMiddleware");

const {
    createICUInventory,
    getICUInventory,
    updateICUInventory
} = require("../controllers/icuBedInventoryController");


router.post(
    "/",
    authenticateToken,
    createICUInventory
);

router.get(
    "/",
    authenticateToken,
    getICUInventory
);

router.put(
    "/",
    authenticateToken,
    updateICUInventory
);

module.exports = router;