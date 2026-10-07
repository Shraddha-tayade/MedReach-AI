const hospitalEmergencyRequestService =
    require("../services/hospitalEmergencyRequestService");

const getHospitalEmergencyRequests = async (req, res) => {

    try {

        const hospitalId = req.user.id;

        const requests =
            await hospitalEmergencyRequestService
                .getHospitalEmergencyRequests(hospitalId);

        res.status(200).json({
            success: true,
            requests
        });

    } catch (error) {

        console.error(
            "Get Hospital Emergency Requests Error:",
            error
        );

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    getHospitalEmergencyRequests
};