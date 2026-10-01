const {
    addBloodInventory,
    getBloodBankInventory,
    changeAvailableUnits,
    discardBloodInventory
} = require("../services/bloodInventoryService");

const createBloodInventory = async (req, res) => {
    try {
        const role = String(req.user.type || "").toLowerCase();

        if (role !== "blood_bank") {
            return res.status(403).json({
                message: "Only blood bank can add blood inventory"
            });
        }

        const blood_bank_id = req.user.id;

        const data = {
            blood_bank_id,
            blood_group: req.body.blood_group,
            blood_component: req.body.blood_component,
            batch_number: req.body.batch_number,
            units_collected: req.body.units_collected,
            units_available: req.body.units_available,
            collection_date: req.body.collection_date,
            expiry_date: req.body.expiry_date
        };

        const inventory = await addBloodInventory(data);

        return res.status(201).json({
            message: "Blood inventory added successfully",
            inventory
        });

    } catch (error) {
        console.error("Create Blood Inventory Error:", error.message);

        if (error.code === "23505") {
            return res.status(409).json({
                message: "This batch number already exists"
            });
        }

        return res.status(400).json({
            message: error.message
        });
    }
};

const getInventory = async (req, res) => {
    try {
        const role = String(req.user.type || "").toLowerCase();

        if (role !== "blood_bank") {
            return res.status(403).json({
                message: "Only blood bank can view inventory"
            });
        }

        const blood_bank_id = req.user.id;

        const inventory = await getBloodBankInventory(blood_bank_id);

        return res.status(200).json({
            message: "Blood inventory fetched successfully",
            inventory
        });

    } catch (error) {
        console.error("Get Inventory Error:", error.message);

        return res.status(500).json({
            message: "Server error"
        });
    }
};

const updateUnits = async (req, res) => {
    try {
        const role = String(req.user.type || "").toLowerCase();

        if (role !== "blood_bank") {
            return res.status(403).json({
                message: "Only blood bank can update inventory"
            });
        }

        const blood_bank_id = req.user.id;
        const id = req.params.id;
        const { units_available } = req.body;

        const inventory = await changeAvailableUnits(
            id,
            blood_bank_id,
            units_available
        );

        return res.status(200).json({
            message: "Blood units updated successfully",
            inventory
        });

    } catch (error) {
        console.error("Update Units Error:", error.message);

        return res.status(400).json({
            message: error.message
        });
    }
};

const discardInventory = async (req, res) => {
    try {
        const role = String(req.user.type || "").toLowerCase();

        if (role !== "blood_bank") {
            return res.status(403).json({
                message: "Only blood bank can discard inventory"
            });
        }

        const blood_bank_id = req.user.id;
        const id = req.params.id;

        const inventory = await discardBloodInventory(
            id,
            blood_bank_id
        );

        return res.status(200).json({
            message: "Blood inventory discarded successfully",
            inventory
        });

    } catch (error) {
        console.error("Discard Inventory Error:", error.message);

        return res.status(404).json({
            message: error.message
        });
    }
};

module.exports = {
    createBloodInventory,
    getInventory,
    updateUnits,
    discardInventory
};