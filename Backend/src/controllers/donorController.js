const donorService = require("../services/donorService");


// ===============================
// GET PROFILE
// ===============================
const getProfile = async (req, res) => {

    try {

        const donorId = req.user.id;

        const donor =
            await donorService.getDonorProfile(donorId);

        return res.status(200).json({
            message: "Donor profile fetched successfully",
            donor
        });

    } catch (error) {

        console.error(
            "Get donor profile error:",
            error
        );

        return res.status(404).json({
            message: error.message
        });
    }
};


module.exports = {
    getProfile
};