const {
    getBloodBankEmergencyRequests
} = require("../models/emergencyBloodRequestModel");

const getEmergencyBloodRequests = async (req, res) => {
    try {

        const role = String(
            req.user?.type ||
            req.user?.role ||
            ""
        ).toLowerCase();

        if (role !== "blood_bank") {
            return res.status(403).json({
                success: false,
                message: "Only blood banks can access emergency blood requests"
            });
        }

        const bloodBankId = Number(req.user.id);

        if (!bloodBankId) {
            return res.status(400).json({
                success: false,
                message: "Invalid blood bank ID"
            });
        }

        const requests =
            await getBloodBankEmergencyRequests(bloodBankId);

        return res.status(200).json({
            success: true,
            count: requests.length,
            requests
        });

    } catch (error) {

        console.error(
            "Fetch Blood Bank Emergency Requests Error:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Failed to fetch emergency blood requests"
        });
    }
};

module.exports = {
    getEmergencyBloodRequests
};