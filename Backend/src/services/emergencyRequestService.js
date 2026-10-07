
const emergencyRequestModel =
    require("../models/emergencyRequestModel");


const allowedResourceTypes = [
    "BLOOD",
    "ICU",
    "OXYGEN",
    "AMBULANCE"
];


// =====================================================
// VALIDATE CREATE EMERGENCY REQUEST
// =====================================================

const validateEmergencyRequest = (data) => {

    if (!data || typeof data !== "object") {
        throw new Error("Request body is required");
    }

    if (!Array.isArray(data.resources) || data.resources.length === 0) {
        throw new Error("At least one resource is required");
    }

    if (data.resources.length > 10) {
        throw new Error(
            "Maximum 10 resources can be requested at once"
        );
    }

    const hasLatitude =
        data.latitude !== undefined &&
        data.latitude !== null &&
        data.latitude !== "";

    const hasLongitude =
        data.longitude !== undefined &&
        data.longitude !== null &&
        data.longitude !== "";

    if (hasLatitude !== hasLongitude) {
        throw new Error(
            "Latitude and longitude must be provided together"
        );
    }

    if (hasLatitude) {

        const latitude = Number(data.latitude);
        const longitude = Number(data.longitude);

        if (
            !Number.isFinite(latitude) ||
            latitude < -90 ||
            latitude > 90
        ) {
            throw new Error("Invalid latitude");
        }

        if (
            !Number.isFinite(longitude) ||
            longitude < -180 ||
            longitude > 180
        ) {
            throw new Error("Invalid longitude");
        }
    }


    data.resources.forEach((item, index) => {

        if (!item || typeof item !== "object") {
            throw new Error(
                `Invalid resource at index ${index}`
            );
        }

        const resourceType =
            String(item.resourceType || "").toUpperCase();

        if (!allowedResourceTypes.includes(resourceType)) {
            throw new Error(
                `Invalid resource type at index ${index}`
            );
        }

        const quantity = Number(item.quantity);

        if (
            !Number.isInteger(quantity) ||
            quantity <= 0
        ) {
            throw new Error(
                `Quantity must be a positive integer at index ${index}`
            );
        }


        // BLOOD validation

        if (resourceType === "BLOOD") {

            if (!item.bloodGroup) {
                throw new Error(
                    "Blood group is required for BLOOD request"
                );
            }

            if (!item.bloodComponent) {
                throw new Error(
                    "Blood component is required for BLOOD request"
                );
            }

        } else {

            if (
                item.bloodGroup ||
                item.bloodComponent
            ) {
                throw new Error(
                    `Blood details are allowed only for BLOOD at index ${index}`
                );
            }
        }


        // AMBULANCE validation

        if (
            resourceType === "AMBULANCE" &&
            item.ambulanceType
        ) {

            const ambulanceType =
                String(item.ambulanceType).toUpperCase();

            if (!["BLS", "ALS"].includes(ambulanceType)) {
                throw new Error(
                    "Ambulance type must be BLS or ALS"
                );
            }
        }
    });
};


// =====================================================
// CREATE EMERGENCY REQUEST
// =====================================================

const createEmergencyRequest = async (
    userId,
    data
) => {

    validateEmergencyRequest(data);

    const normalizedData = {

        ...data,

        latitude:
            data.latitude !== undefined &&
            data.latitude !== null &&
            data.latitude !== ""
                ? Number(data.latitude)
                : null,

        longitude:
            data.longitude !== undefined &&
            data.longitude !== null &&
            data.longitude !== ""
                ? Number(data.longitude)
                : null,

        resources: data.resources.map(item => ({

            ...item,

            resourceType:
                String(item.resourceType).toUpperCase(),

            quantity:
                Number(item.quantity),

            bloodGroup:
                item.bloodGroup || null,

            bloodComponent:
                item.bloodComponent || null,

            ambulanceType:
                item.ambulanceType
                    ? String(item.ambulanceType).toUpperCase()
                    : null

        }))
    };

    return emergencyRequestModel.createEmergencyRequest(
        userId,
        normalizedData
    );
};


// =====================================================
// GET SINGLE REQUEST
// =====================================================

const getEmergencyRequest = async (
    requestId,
    userId
) => {

    return emergencyRequestModel.findEmergencyRequestById(
        requestId,
        userId
    );
};


// =====================================================
// GET REQUEST STATUS
// =====================================================

const getEmergencyRequestStatus = async (
    requestId,
    userId
) => {

    const request =
        await emergencyRequestModel.getEmergencyRequestStatus(
            requestId,
            userId
        );

    if (!request) {
        throw new Error(
            "Emergency request not found"
        );
    }

    return request;
};


// =====================================================
// GET REQUEST RESPONSES
// =====================================================

const getRequestResponses = async (
    requestId,
    userId
) => {

    return emergencyRequestModel.getRequestResponses(
        requestId,
        userId
    );
};


// =====================================================
// SEND REQUEST TO PROVIDERS
// =====================================================

const sendRequestToProviders = async (
    requestItemId,
    userId,
    providers
) => {

    return emergencyRequestModel.createProviderRequests(
        requestItemId,
        userId,
        providers
    );
};


// =====================================================
// CONFIRM PROVIDER
// =====================================================

const confirmProvider = async (
    providerRequestId,
    userId
) => {

    return emergencyRequestModel.confirmProvider(
        providerRequestId,
        userId
    );
};


// =====================================================
// USER EMERGENCY HISTORY
// =====================================================

const getEmergencyRequestHistory = async (
    userId
) => {

    return emergencyRequestModel.getEmergencyRequestHistory(
        userId
    );
};

const completeResourceRequest = async (itemId, userId) => {
    return await emergencyRequestModel.completeResourceRequest(
        itemId,
        userId
    );
};


module.exports = {

    createEmergencyRequest,

    getEmergencyRequest,

    getEmergencyRequestStatus,

    getRequestResponses,

    sendRequestToProviders,

    confirmProvider,

    getEmergencyRequestHistory,

    completeResourceRequest

};

