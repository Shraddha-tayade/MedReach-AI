const {
    getHospitalEmergencyHistory
} = require("../services/hospitalEmergencyHistoryService");


const getHospitalHistory = async (req, res) => {
    try {
        const hospitalId = Number(req.user.id);

        if (!hospitalId) {
            return res.status(401).json({
                success: false,
                message: "Hospital authentication required"
            });
        }

        const result = await getHospitalEmergencyHistory(hospitalId);

        return res.status(200).json(result);

    } catch (error) {
        console.error("Hospital History Error:", error);

        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    getHospitalHistory
};