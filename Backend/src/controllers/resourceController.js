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



const validateLocationSearch = ({
    latitude,
    longitude,
    radius
}) => {
    // Check for missing or empty values
    if (
        latitude === undefined || latitude === null || latitude === "" ||
        longitude === undefined || longitude === null || longitude === "" ||
        radius === undefined || radius === null || radius === ""
    ) {
        return false;
    }

    return (
        Number.isFinite(Number(latitude)) &&
        Number.isFinite(Number(longitude)) &&
        Number(latitude) >= -90 &&
        Number(latitude) <= 90 &&
        Number(longitude) >= -180 &&
        Number(longitude) <= 180 &&
        Number.isFinite(Number(radius)) &&
        Number(radius) > 0 &&
        Number(radius) <= 100
    );
};

const searchICU = async (req, res) => {
    try {
        const { latitude, longitude, radius } = req.body;

        if (!validateLocationSearch({ latitude, longitude, radius })) {
            return res.status(400).json({
                message: "Valid latitude, longitude and radius are required. Radius must be between 1 and 100 km."
            });
        }

        const results = await resourceService.searchICU({
            latitude: Number(latitude),
            longitude: Number(longitude),
            radius: Number(radius)
        });

        return res.status(200).json({
            message: "ICU bed search completed successfully",
            count: results.length,
            results
        });

    } catch (error) {
        console.error("ICU search error:", error.message);

        return res.status(500).json({
            message: "Unable to search ICU beds"
        });
    }
};

const searchOxygen = async (req, res) => {
    try {
        const { latitude, longitude, radius } = req.body;

        if (!validateLocationSearch({ latitude, longitude, radius })) {
            return res.status(400).json({
                message: "Valid latitude, longitude and radius are required. Radius must be between 1 and 100 km."
            });
        }

        const results = await resourceService.searchOxygen({
            latitude: Number(latitude),
            longitude: Number(longitude),
            radius: Number(radius)
        });

        return res.status(200).json({
            message: "Oxygen bed search completed successfully",
            count: results.length,
            results
        });

    } catch (error) {
        console.error("Oxygen search error:", error.message);

        return res.status(500).json({
            message: "Unable to search oxygen beds"
        });
    }
};

/*
 * Search nearby eligible donors
 *
 * Used when the user clicks "Find Donors"
 * for a BLOOD emergency request.
 */
const searchDonors = async (req, res) => {

    try {

        const {
            bloodGroup,
            latitude,
            longitude,
            radius
        } = req.body;

        if (
            !bloodGroup ||
            !validateLocationSearch({
                latitude,
                longitude,
                radius
            })
        ) {
            return res.status(400).json({
                message:
                    "bloodGroup, valid latitude, longitude and radius are required. Radius must be between 1 and 100 km."
            });
        }

        const results = await resourceService.searchDonors({
            bloodGroup,
            latitude: Number(latitude),
            longitude: Number(longitude),
            radius: Number(radius)
        });

        return res.status(200).json({
            message: "Donor search completed successfully",
            count: results.length,
            results
        });

    } catch (error) {

        console.error("Donor search error:", error.message);

        return res.status(500).json({
            message: "Unable to search donors"
        });
    }
};


module.exports = {
    searchBlood,
    searchICU,
    searchOxygen,
    searchDonors
};