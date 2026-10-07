const {
    addOxygenInventory,
    fetchOxygenInventory,
    changeOxygenInventory
} = require("../services/oxygenBedInventoryService");

// CREATE
const createOxygenInventory = async (req, res) => {
    try {
        const role =
            String(req.user.type || "").toLowerCase();

        if (role !== "hospital") {
            return res.status(403).json({
                message:
                    "Only hospitals can create oxygen bed inventory"
            });
        }

        const hospital_id = req.user.id;

        const {
            total_beds,
            available_beds
        } = req.body;

        const inventory =
            await addOxygenInventory({
                hospital_id,
                total_beds,
                available_beds
            });

        return res.status(201).json({
            message:
                "Oxygen bed inventory created successfully",
            inventory
        });

    } catch (error) {
        console.error(
            "Create Oxygen Inventory Error:",
            error
        );

        if (error.code === "23505") {
            return res.status(409).json({
                message:
                    "Oxygen bed inventory already exists for this hospital"
            });
        }

        return res.status(400).json({
            message: error.message
        });
    }
};

// GET
const getOxygenInventory = async (req, res) => {
    try {
        const role =
            String(req.user.type || "").toLowerCase();

        if (role !== "hospital") {
            return res.status(403).json({
                message:
                    "Only hospitals can view oxygen bed inventory"
            });
        }

        const hospital_id = req.user.id;

        const inventory =
            await fetchOxygenInventory(
                hospital_id
            );

        if (!inventory) {
            return res.status(404).json({
                message:
                    "Oxygen bed inventory not found"
            });
        }

        return res.status(200).json({
            message:
                "Oxygen bed inventory fetched successfully",
            inventory
        });

    } catch (error) {
        console.error(
            "Get Oxygen Inventory Error:",
            error
        );

        return res.status(500).json({
            message:
                "Failed to fetch oxygen bed inventory"
        });
    }
};

// UPDATE
const updateOxygenInventory = async (
    req,
    res
) => {
    try {
        const role =
            String(req.user.type || "").toLowerCase();

        if (role !== "hospital") {
            return res.status(403).json({
                message:
                    "Only hospitals can update oxygen bed inventory"
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
            await changeOxygenInventory(
                hospital_id,
                total_beds,
                available_beds,
                reserved_beds,
                occupied_beds
            );

        if (!inventory) {
            return res.status(404).json({
                message:
                    "Oxygen bed inventory not found"
            });
        }

        return res.status(200).json({
            message:
                "Oxygen bed inventory updated successfully",
            inventory
        });

    } catch (error) {
        console.error(
            "Update Oxygen Inventory Error:",
            error
        );

        return res.status(400).json({
            message: error.message
        });
    }
};

module.exports = {
    createOxygenInventory,
    getOxygenInventory,
    updateOxygenInventory
};