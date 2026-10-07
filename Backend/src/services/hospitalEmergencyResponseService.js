const pool = require("../config/db");

const {
    findEmergencyRequestItem,
    findHospitalProviderRequest,
    findHospitalResponse,
    getHospitalLocation,
    upsertHospitalResponse,

    updateProviderRequestJourney,

    reserveICUBeds,
    reserveOxygenBeds,

    releaseICUBeds,
    releaseOxygenBeds,

    moveICUReservedToOccupied,
    moveOxygenReservedToOccupied,

    updateResponseStatus,
    setCompletedByUser,

    getExpiredHospitalResponses
} = require("../models/hospitalEmergencyResponseModel");


// =====================================================
// CALCULATE DISTANCE USING LATITUDE / LONGITUDE
// Haversine formula
// =====================================================
const calculateDistanceKm = (
    userLatitude,
    userLongitude,
    hospitalLatitude,
    hospitalLongitude
) => {

    const toRadians = (degree) =>
        degree * Math.PI / 180;

    const earthRadiusKm = 6371;

    const lat1 =
        toRadians(Number(userLatitude));

    const lat2 =
        toRadians(Number(hospitalLatitude));

    const deltaLat =
        toRadians(
            Number(hospitalLatitude) -
            Number(userLatitude)
        );

    const deltaLon =
        toRadians(
            Number(hospitalLongitude) -
            Number(userLongitude)
        );

    const a =
        Math.sin(deltaLat / 2) *
        Math.sin(deltaLat / 2) +

        Math.cos(lat1) *
        Math.cos(lat2) *
        Math.sin(deltaLon / 2) *
        Math.sin(deltaLon / 2);

    const c =
        2 *
        Math.atan2(
            Math.sqrt(a),
            Math.sqrt(1 - a)
        );

    return earthRadiusKm * c;
};


// =====================================================
// CALCULATE ETA
// =====================================================
// This is an estimated travel time.
// Average emergency travel speed = 40 km/h.
// You can change this later.
// =====================================================
const calculateEtaMinutes = (distanceKm) => {

    const averageSpeedKmPerHour = 40;

    const minutes =
        (distanceKm / averageSpeedKmPerHour) * 60;

    return Math.max(
        1,
        Math.ceil(minutes)
    );
};


// =====================================================
// ACCEPT / REJECT
// =====================================================
const respondToEmergencyRequest = async ({
    requestId,
    requestItemId,
    hospitalId,
    status,
    responseMessage
}) => {

    if (
        !["ACCEPTED", "REJECTED"].includes(status)
    ) {
        throw new Error(
            "Status must be ACCEPTED or REJECTED"
        );
    }


    const requestItem =
        await findEmergencyRequestItem(
            requestId,
            requestItemId
        );


    if (!requestItem) {
        throw new Error(
            "Emergency request item not found"
        );
    }


    // Your actual database values are ICU and OXYGEN
    if (
        requestItem.resource_type !== "ICU" &&
        requestItem.resource_type !== "OXYGEN"
    ) {
        throw new Error(
            "Hospital can only respond to ICU or OXYGEN requests"
        );
    }


    const providerRequest =
        await findHospitalProviderRequest(
            requestItemId,
            hospitalId
        );


    if (!providerRequest) {
        throw new Error(
            "This emergency request was not sent to this hospital"
        );
    }


    // IMPORTANT:
    // No quantity
    // No ETA
    // No buffer
    // No reservation
    //
    // All of those happen after user selects hospital.

    return await upsertHospitalResponse({
        requestItemId,
        hospitalId,
        status,
        responseMessage
    });
};


// =====================================================
// CONFIRM HOSPITAL SELECTION
// =====================================================
const confirmHospitalSelection = async ({
    requestId,
    requestItemId,
    hospitalId
}) => {

    const client =
        await pool.connect();

    try {

        await client.query("BEGIN");


        // ------------------------------------------------
        // 1. Get emergency request
        // ------------------------------------------------
        const requestItem =
            await findEmergencyRequestItem(
                requestId,
                requestItemId,
                client
            );


        if (!requestItem) {
            throw new Error(
                "Emergency request item not found"
            );
        }


        // ------------------------------------------------
        // 2. Check resource
        // ------------------------------------------------
        if (
            requestItem.resource_type !== "ICU" &&
            requestItem.resource_type !== "OXYGEN"
        ) {
            throw new Error(
                "Invalid hospital resource type"
            );
        }


        // ------------------------------------------------
        // 3. Get provider request
        // ------------------------------------------------
        const providerRequest =
            await findHospitalProviderRequest(
                requestItemId,
                hospitalId,
                client
            );


        if (!providerRequest) {
            throw new Error(
                "Hospital provider request not found"
            );
        }


        // ------------------------------------------------
        // 4. User must have selected hospital
        // ------------------------------------------------
        if (providerRequest.selected !== true) {
            throw new Error(
                "Hospital has not been selected by the user"
            );
        }


        // ------------------------------------------------
        // 5. Hospital must have ACCEPTED
        // ------------------------------------------------
        const response =
            await findHospitalResponse(
                requestItemId,
                hospitalId,
                client
            );


        if (!response) {
            throw new Error(
                "Hospital response not found"
            );
        }


        if (response.status !== "ACCEPTED") {
            throw new Error(
                "Hospital response is not ACCEPTED"
            );
        }


        // ------------------------------------------------
        // 6. Get requested quantity
        // ------------------------------------------------
        const quantity =
            Number(requestItem.quantity);


        if (!quantity || quantity <= 0) {
            throw new Error(
                "Invalid requested bed quantity"
            );
        }


        // ------------------------------------------------
        // 7. Get user location
        // ------------------------------------------------
        const userLatitude =
            Number(requestItem.user_latitude);

        const userLongitude =
            Number(requestItem.user_longitude);


        if (
            !Number.isFinite(userLatitude) ||
            !Number.isFinite(userLongitude)
        ) {
            throw new Error(
                "User location is not available for ETA calculation"
            );
        }


        // ------------------------------------------------
        // 8. Get hospital location
        // ------------------------------------------------
        const hospital =
            await getHospitalLocation(
                hospitalId,
                client
            );


        if (!hospital) {
            throw new Error(
                "Hospital not found"
            );
        }


        const hospitalLatitude =
            Number(hospital.latitude);

        const hospitalLongitude =
            Number(hospital.longitude);


        if (
            !Number.isFinite(hospitalLatitude) ||
            !Number.isFinite(hospitalLongitude)
        ) {
            throw new Error(
                "Hospital location is not available for ETA calculation"
            );
        }


        // ------------------------------------------------
        // 9. Calculate distance
        // ------------------------------------------------
        const distanceKm =
            calculateDistanceKm(
                userLatitude,
                userLongitude,
                hospitalLatitude,
                hospitalLongitude
            );


        // ------------------------------------------------
        // 10. Calculate ETA
        // ------------------------------------------------
        const estimatedArrivalMinutes =
            calculateEtaMinutes(
                distanceKm
            );


        // ------------------------------------------------
        // 11. Buffer
        // ------------------------------------------------
        const bufferMinutes = 10;


        // ------------------------------------------------
        // 12. Arrival deadline
        // ------------------------------------------------
        const arrivalDeadline =
            new Date(
                Date.now() +
                (
                    estimatedArrivalMinutes +
                    bufferMinutes
                ) *
                60 *
                1000
            );


        // ------------------------------------------------
        // 13. Reserve beds
        // ------------------------------------------------
        let inventory;


        if (
            requestItem.resource_type === "ICU"
        ) {

            inventory =
                await reserveICUBeds(
                    hospitalId,
                    quantity,
                    client
                );

        } else {

            inventory =
                await reserveOxygenBeds(
                    hospitalId,
                    quantity,
                    client
                );
        }


        if (!inventory) {
            throw new Error(
                `Not enough ${requestItem.resource_type} beds available`
            );
        }


        // ------------------------------------------------
        // 14. Update provider journey
        // ------------------------------------------------
        const updatedProviderRequest =
            await updateProviderRequestJourney(
                requestItemId,
                hospitalId,
                client
            );


        if (!updatedProviderRequest) {
            throw new Error(
                "Hospital selection is no longer valid"
            );
        }


        // ------------------------------------------------
        // 15. Save ETA + buffer + deadline
        // ------------------------------------------------
        const updatedResponse =
            await updateResponseStatus(
                response.id,
                "ACCEPTED",
                {
                    estimatedArrivalMinutes,
                    bufferMinutes,
                    arrivalDeadline
                },
                client
            );


        await client.query("COMMIT");


        return {

            message:
                "Hospital selection confirmed and bed reserved",

            requestItemId:
                requestItemId,

            resourceType:
                requestItem.resource_type,

            quantity:
                quantity,

            distanceKm:
                Number(distanceKm.toFixed(2)),

            estimatedArrivalMinutes:
                estimatedArrivalMinutes,

            bufferMinutes:
                bufferMinutes,

            arrivalDeadline:
                arrivalDeadline,

            response:
                updatedResponse,

            inventory:
                inventory
        };

    } catch (error) {

        await client.query("ROLLBACK");

        throw error;

    } finally {

        client.release();
    }
};


// =====================================================
// CANCEL RESERVATION
// =====================================================
const cancelHospitalReservation = async ({
    requestId,
    requestItemId,
    hospitalId
}) => {

    const client =
        await pool.connect();

    try {

        await client.query("BEGIN");


        const requestItem =
            await findEmergencyRequestItem(
                requestId,
                requestItemId,
                client
            );


        if (!requestItem) {
            throw new Error(
                "Emergency request item not found"
            );
        }


        const response =
            await findHospitalResponse(
                requestItemId,
                hospitalId,
                client
            );


        if (!response) {
            throw new Error(
                "Hospital response not found"
            );
        }


        if (response.status !== "ACCEPTED") {
            throw new Error(
                "Only an ACCEPTED reservation can be cancelled"
            );
        }


        const quantity =
            Number(requestItem.quantity);


        let inventory;


        if (
            requestItem.resource_type === "ICU"
        ) {

            inventory =
                await releaseICUBeds(
                    hospitalId,
                    quantity,
                    client
                );

        } else if (
            requestItem.resource_type === "OXYGEN"
        ) {

            inventory =
                await releaseOxygenBeds(
                    hospitalId,
                    quantity,
                    client
                );

        } else {

            throw new Error(
                "Invalid hospital resource type"
            );
        }


        if (!inventory) {
            throw new Error(
                "Unable to release reserved beds"
            );
        }


        // No CANCELLED status exists in your table.
        const updatedResponse =
            await updateResponseStatus(
                response.id,
                "EXPIRED",
                {},
                client
            );


        await client.query("COMMIT");


        return {
            message:
                "Hospital reservation cancelled and beds released",

            response:
                updatedResponse
        };

    } catch (error) {

        await client.query("ROLLBACK");

        throw error;

    } finally {

        client.release();
    }
};


// =====================================================
// ARRIVED
// =====================================================
const markHospitalArrived = async ({
    requestId,
    requestItemId,
    hospitalId
}) => {

    const client =
        await pool.connect();

    try {

        await client.query("BEGIN");


        const requestItem =
            await findEmergencyRequestItem(
                requestId,
                requestItemId,
                client
            );


        if (!requestItem) {
            throw new Error(
                "Emergency request item not found"
            );
        }


        const response =
            await findHospitalResponse(
                requestItemId,
                hospitalId,
                client
            );


        if (!response) {
            throw new Error(
                "Hospital response not found"
            );
        }


        if (response.status !== "ACCEPTED") {
            throw new Error(
                "Only an ACCEPTED reservation can be marked ARRIVED"
            );
        }


        if (
            response.arrival_deadline &&
            new Date(response.arrival_deadline) < new Date()
        ) {
            throw new Error(
                "Arrival deadline has expired"
            );
        }


        const quantity =
            Number(requestItem.quantity);


        let inventory;


        if (
            requestItem.resource_type === "ICU"
        ) {

            inventory =
                await moveICUReservedToOccupied(
                    hospitalId,
                    quantity,
                    client
                );

        } else if (
            requestItem.resource_type === "OXYGEN"
        ) {

            inventory =
                await moveOxygenReservedToOccupied(
                    hospitalId,
                    quantity,
                    client
                );

        } else {

            throw new Error(
                "Invalid hospital resource type"
            );
        }


        if (!inventory) {
            throw new Error(
                "Unable to move reserved beds to occupied"
            );
        }


        const updatedResponse =
            await updateResponseStatus(
                response.id,
                "ARRIVED",
                {
                    arrivedAt: new Date()
                },
                client
            );


        await client.query("COMMIT");


        return {
            message:
                "Patient arrival confirmed",

            response:
                updatedResponse,

            inventory:
                inventory
        };

    } catch (error) {

        await client.query("ROLLBACK");

        throw error;

    } finally {

        client.release();
    }
};


// =====================================================
// COMPLETE
// =====================================================
const completeHospitalRequest = async ({
    requestId,
    requestItemId,
    hospitalId,
    completedByUserId
}) => {

    const client =
        await pool.connect();

    try {

        await client.query("BEGIN");


        const requestItem =
            await findEmergencyRequestItem(
                requestId,
                requestItemId,
                client
            );


        if (!requestItem) {
            throw new Error(
                "Emergency request item not found"
            );
        }


        const response =
            await findHospitalResponse(
                requestItemId,
                hospitalId,
                client
            );


        if (!response) {
            throw new Error(
                "Hospital response not found"
            );
        }


        if (response.status !== "ARRIVED") {
            throw new Error(
                "Only an ARRIVED request can be completed"
            );
        }


        let updatedResponse =
            await updateResponseStatus(
                response.id,
                "COMPLETED",
                {
                    completedAt: new Date()
                },
                client
            );


        if (completedByUserId) {

            updatedResponse =
                await setCompletedByUser(
                    response.id,
                    completedByUserId,
                    client
                );
        }


        await client.query("COMMIT");


        return {
            message:
                "Hospital emergency request completed",

            response:
                updatedResponse
        };

    } catch (error) {

        await client.query("ROLLBACK");

        throw error;

    } finally {

        client.release();
    }
};


// =====================================================
// AUTOMATIC EXPIRY
// =====================================================
const releaseExpiredHospitalReservations = async () => {

    const expiredResponses =
        await getExpiredHospitalResponses();


    for (const response of expiredResponses) {

        const client =
            await pool.connect();

        try {

            await client.query("BEGIN");


            const currentResponse =
                await findHospitalResponse(
                    response.request_item_id,
                    response.hospital_id,
                    client
                );


            if (
                !currentResponse ||
                currentResponse.status !== "ACCEPTED"
            ) {
                await client.query("ROLLBACK");
                continue;
            }


            const quantity =
                Number(response.quantity);


            let inventory;


            if (
                response.resource_type === "ICU"
            ) {

                inventory =
                    await releaseICUBeds(
                        response.hospital_id,
                        quantity,
                        client
                    );

            } else if (
                response.resource_type === "OXYGEN"
            ) {

                inventory =
                    await releaseOxygenBeds(
                        response.hospital_id,
                        quantity,
                        client
                    );
            }


            if (!inventory) {
                throw new Error(
                    "Unable to release expired reserved beds"
                );
            }


            await updateResponseStatus(
                currentResponse.id,
                "EXPIRED",
                {},
                client
            );


            await client.query("COMMIT");


            console.log(
                `Expired hospital reservation released: response ${currentResponse.id}`
            );

        } catch (error) {

            await client.query("ROLLBACK");

            console.error(
                "Hospital reservation expiry error:",
                error.message
            );

        } finally {

            client.release();
        }
    }
};


module.exports = {
    respondToEmergencyRequest,
    confirmHospitalSelection,
    cancelHospitalReservation,
    markHospitalArrived,
    completeHospitalRequest,
    releaseExpiredHospitalReservations
};