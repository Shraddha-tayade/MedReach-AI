const {
    addICUInventory,
    fetchICUInventory,
    changeICUInventory
} = require("../services/icuBedInventoryService");


// CREATE ICU INVENTORY
const createICUInventory = async (req, res) => {
    try {
        const role =
            String(req.user.type || "").toLowerCase();

        if (role !== "hospital") {
            return res.status(403).json({
                message:
                    "Only hospitals can create ICU inventory"
            });
        }

        const hospital_id = req.user.id;

        const {
            total_beds,
            available_beds
        } = req.body;

        const inventory =
            await addICUInventory({
                hospital_id,
                total_beds,
                available_beds
            });

        return res.status(201).json({
            message:
                "ICU inventory created successfully",
            inventory
        });

    } catch (error) {
        console.error(
            "Create ICU Inventory Error:",
            error
        );

        if (error.code === "23505") {
            return res.status(409).json({
                message:
                    "ICU inventory already exists for this hospital"
            });
        }

        return res.status(400).json({
            message: error.message
        });
    }
};


// GET ICU INVENTORY
const getICUInventory = async (req, res) => {
    try {
        const role =
            String(req.user.type || "").toLowerCase();

        if (role !== "hospital") {
            return res.status(403).json({
                message:
                    "Only hospitals can view ICU inventory"
            });
        }

        const hospital_id = req.user.id;

        const inventory =
            await fetchICUInventory(
                hospital_id
            );

        if (!inventory) {
            return res.status(404).json({
                message:
                    "ICU inventory not found"
            });
        }

        return res.status(200).json({
            message:
                "ICU inventory fetched successfully",
            inventory
        });

    } catch (error) {
        console.error(
            "Get ICU Inventory Error:",
            error
        );

        return res.status(500).json({
            message:
                "Failed to fetch ICU inventory"
        });
    }
};


// UPDATE ICU INVENTORY
const updateICUInventory = async (req, res) => {
    try {
        const role =
            String(req.user.type || "").toLowerCase();

        if (role !== "hospital") {
            return res.status(403).json({
                message:
                    "Only hospitals can update ICU inventory"
            });
        }

        const hospital_id = req.user.id;

        const {
            total_beds,
            available_beds,
            reserved_beds,
            occupied_beds
        } = req.body;

        const inventory =
            await changeICUInventory(
                hospital_id,
                total_beds,
                available_beds,
                reserved_beds,
                occupied_beds
            );

        if (!inventory) {
            return res.status(404).json({
                message:
                    "ICU inventory not found"
            });
        }

        return res.status(200).json({
            message:
                "ICU inventory updated successfully",
            inventory
        });

    } catch (error) {
        console.error(
            "Update ICU Inventory Error:",
            error
        );

        return res.status(400).json({
            message: error.message
        });
    }
};


// EXPORT FUNCTIONS
module.exports = {
    createICUInventory,
    getICUInventory,
    updateICUInventory
};