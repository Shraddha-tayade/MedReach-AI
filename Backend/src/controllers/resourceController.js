const resourceService = require("../services/resourceService");

const searchBlood = async (req, res) => {

    try {

        const {
            bloodGroup,
            bloodComponent,
            unitsRequired,
            latitude,
            longitude,
            radius
        } = req.body;

        if (
            !bloodGroup ||
            !bloodComponent ||
            !unitsRequired ||
            !latitude ||
            !longitude ||
            !radius
        ) {
            return res.status(400).json({
                message:
                    "bloodGroup, unitsRequired, latitude, longitude and radius are required"
            });
        }

        const result = await resourceService.searchBlood({
            bloodGroup,
            bloodComponent,
            unitsRequired: Number(unitsRequired),
            latitude: Number(latitude),
            longitude: Number(longitude),
            radius: Number(radius)
        });

        return res.status(200).json({
            message: "Blood search completed successfully",
            count: result.length,
            results: result
        });

    } catch (error) {

        console.error("Blood search error:", error.message);

        return res.status(500).json({
            message: "Unable to search blood resources"
        });
    }
};

module.exports = {
    searchBlood
};