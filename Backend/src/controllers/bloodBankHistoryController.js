const {
    fetchBloodBankHistory
} = require("../services/bloodBankHistoryService");

const getHistory = async (req, res) => {

    try {

        const role = String(req.user.type || "").toLowerCase();

        if (role !== "blood_bank") {
            return res.status(403).json({
                message: "Only blood banks can view their history"
            });
        }

        const blood_bank_id = req.user.id;

        const history = await fetchBloodBankHistory(
            blood_bank_id
        );

        return res.status(200).json({
            message: "Blood bank history fetched successfully",
            count: history.length,
            history
        });

    } catch (error) {

        console.error(
            "Get Blood Bank History Error:",
            error
        );

        return res.status(500).json({
            message: "Failed to fetch blood bank history"
        });
    }
};

module.exports = {
    getHistory
};