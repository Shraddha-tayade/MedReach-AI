const axios = require("axios");

const resolveLocation = async (req, res) => {
    try {
        const { address, latitude, longitude } = req.body;

        // CURRENT LOCATION
        if (latitude !== undefined && longitude !== undefined) {
            return res.json({
                latitude,
                longitude
            });
        }

        // MANUAL ADDRESS
        if (!address) {
            return res.status(400).json({
                message: "Address or coordinates are required"
            });
        }

        const response = await axios.get(
            "https://api.geoapify.com/v1/geocode/search",
            {
                params: {
                    text: address,
                    apiKey: process.env.GEOAPIFY_API_KEY,
                    limit: 1
                }
            }
        );

        if (!response.data.features.length) {
            return res.status(404).json({
                message: "Location not found"
            });
        }

        const coordinates =
            response.data.features[0].geometry.coordinates;

        const resolvedLongitude = coordinates[0];
        const resolvedLatitude = coordinates[1];

        return res.json({
            latitude: resolvedLatitude,
            longitude: resolvedLongitude
        });

    } catch (error) {
        console.error(
            "Geoapify Error:",
            error.response?.data || error.message
        );

        return res.status(500).json({
            message: "Unable to resolve location"
        });
    }
};

module.exports = {
    resolveLocation
};