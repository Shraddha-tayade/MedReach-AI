const express = require("express");

const router = express.Router();

const authenticateToken = require("../middleware/authMiddleware");

const {
    createBloodInventory,
    getInventory,
    updateUnits,
    discardInventory
} = require("../controllers/bloodInventoryController");


// POST /api/blood-bank/inventory
router.post("/", authenticateToken, (req, res, next) => {
    console.log("🔥 POST /api/blood-bank/inventory ROUTE HIT");
    console.log("Request body:", req.body);
    next();
}, createBloodInventory);


// GET /api/blood-bank/inventory
router.get("/", authenticateToken, getInventory);


// PATCH /api/blood-bank/inventory/:id
router.patch("/:id", authenticateToken, updateUnits);


// PATCH /api/blood-bank/inventory/:id/discard
router.patch("/:id/discard", authenticateToken, discardInventory);


module.exports = router;