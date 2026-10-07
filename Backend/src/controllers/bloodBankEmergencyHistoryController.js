const {
    getHistory
} = require("../services/bloodBankEmergencyHistoryService");

const getBloodBankHistory = async (req, res) => {
    try {
        const role = String(
            req.user?.type ||
            req.user?.role ||
            ""
        ).toLowerCase();

        if (role !== "blood_bank") {
            return res.status(403).json({
                success: false,
                message: "Only blood banks can access this history"
            });
        }

        const bloodBankId = Number(req.user.id);

        if (!bloodBankId) {
            return res.status(400).json({
                success: false,
                message: "Invalid blood bank ID"
            });
        }

        const result = await getHistory(bloodBankId);

        return res.status(200).json(result);

    } catch (error) {
        console.error(
            "Blood Bank Emergency History Error:",
            error
        );

        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    getBloodBankHistory
};