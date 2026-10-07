const express = require("express");

const router = express.Router();

//console.log("Blood inventory routes loaded");

const authenticateToken =
    require("../middleware/authMiddleware");

const {
    createBloodInventory,
    getInventory,
    updateUnits,
    useBloodUnits
} = require("../controllers/bloodInventoryController");


// ADD BLOOD INVENTORY
router.post(
    "/",
    authenticateToken,
    createBloodInventory
);


// GET BLOOD INVENTORY
router.get(
    "/",
    authenticateToken,
    getInventory
);


// UPDATE AVAILABLE UNITS
router.patch(
    "/:id",
    authenticateToken,
    updateUnits
);


// USE BLOOD
router.patch(
    "/:id/use",
    authenticateToken,
    useBloodUnits
);


module.exports = router;