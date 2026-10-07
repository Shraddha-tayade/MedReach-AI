const pool = require("../config/db");
const model = require("../models/hospitalBloodRequestModel");


// ======================================================
// CREATE REQUEST
// ======================================================
const createRequest = async (data) => {
    return await model.createRequest(data);
};


// ======================================================
// GET HOSPITAL REQUESTS
// ======================================================
const getHospitalRequests = async (hospital_id) => {
    return await model.getRequestsByHospital(hospital_id);
};


// ======================================================
// GET ONE HOSPITAL REQUEST
// ======================================================
const getHospitalRequestById = async (
    hospital_id,
    request_id
) => {
    return await model.getRequestById(
        hospital_id,
        request_id
    );
};


// ======================================================
// GET PENDING REQUESTS FOR BLOOD BANK
// ======================================================
const getPendingRequests = async (blood_bank_id) => {
    return await model.getPendingRequests(
        blood_bank_id
    );
};


// ======================================================
// RELEASE EXPIRED RESERVATIONS
// ======================================================
const releaseExpiredReservations = async () => {

    const client = await pool.connect();

    try {

        await client.query("BEGIN");

        // ----------------------------------------------
        // 1. Find expired reservations
        // ----------------------------------------------
        const expiredReservations =
            await model.getExpiredReservations(client);

        let releasedCount = 0;

        // ----------------------------------------------
        // 2. Release reserved quantity
        // ----------------------------------------------
        for (const reservation of expiredReservations) {

            if (
                reservation.inventory_id &&
                reservation.reserved_quantity > 0
            ) {

                await model.releaseInventory(
                    client,
                    reservation.inventory_id,
                    reservation.reserved_quantity
                );
            }

            // ------------------------------------------
            // Mark reservation as EXPIRED
            // ------------------------------------------
            await model.markReservationExpired(
                client,
                reservation.id
            );

            releasedCount++;
        }

        await client.query("COMMIT");

        return {
            success: true,
            released_count: releasedCount
        };

    } catch (error) {

        await client.query("ROLLBACK");

        console.error(
            "RELEASE EXPIRED HOSPITAL BLOOD RESERVATIONS ERROR:",
            error
        );

        throw error;

    } finally {

        client.release();
    }
};


// ======================================================
// BLOOD BANK RESPOND TO HOSPITAL REQUEST
// ======================================================
const respondToRequest = async ({
    request_id,
    blood_bank_id,
    response_status,
    available_quantity,
    response_message
}) => {

    /*
     * Before processing a new response,
     * release old expired reservations.
     */
    await releaseExpiredReservations();


    const client = await pool.connect();

    try {

        await client.query("BEGIN");


        // ==================================================
        // 1. GET AND LOCK HOSPITAL REQUEST
        // ==================================================
        const request =
            await model.getHospitalBloodRequest(
                client,
                request_id
            );

        if (!request) {
            throw new Error(
                "Blood request not found"
            );
        }


        // ==================================================
        // 2. REQUEST STATUS VALIDATION
        // ==================================================
        if (request.status === "COMPLETED") {

            throw new Error(
                "This blood request is already completed"
            );
        }


        // ==================================================
        // 3. REJECT
        // ==================================================
        if (response_status === "REJECTED") {

            const response =
                await model.createResponse(
                    client,
                    {
                        request_id,
                        blood_bank_id,
                        response_status: "REJECTED",
                        available_quantity:
                            available_quantity ?? null,
                        response_message:
                            response_message || null,

                        distance_km: null,
                        reservation_minutes: null,
                        reserved_quantity: null,
                        reserved_until: null,
                        reservation_status: "NONE",
                        inventory_id: null
                    }
                );


            // ----------------------------------------------
            // Check latest response of each blood bank
            // ----------------------------------------------
            const summaryResult =
                await client.query(
                    `
                    WITH latest_responses AS (
                        SELECT DISTINCT ON (blood_bank_id)
                            blood_bank_id,
                            response_status,
                            responded_at,
                            id
                        FROM public.hospital_blood_request_responses
                        WHERE request_id = $1
                        ORDER BY
                            blood_bank_id,
                            responded_at DESC NULLS LAST,
                            id DESC
                    )

                    SELECT
                        COUNT(*) FILTER (
                            WHERE response_status = 'ACCEPTED'
                        ) AS accepted_count,

                        COUNT(*) FILTER (
                            WHERE response_status = 'REJECTED'
                        ) AS rejected_count,

                        COUNT(*) FILTER (
                            WHERE response_status = 'PENDING'
                        ) AS pending_count

                    FROM latest_responses;
                    `,
                    [request_id]
                );


            const summary =
                summaryResult.rows[0];


            const acceptedCount =
                Number(
                    summary.accepted_count || 0
                );

            const rejectedCount =
                Number(
                    summary.rejected_count || 0
                );

            const pendingCount =
                Number(
                    summary.pending_count || 0
                );


            let newRequestStatus;


            if (acceptedCount > 0) {

                newRequestStatus = "ACCEPTED";

            } else if (
                rejectedCount > 0 &&
                pendingCount === 0
            ) {

                newRequestStatus = "REJECTED";

            } else {

                newRequestStatus = "PENDING";
            }


            await client.query(
                `
                UPDATE public.hospital_blood_requests
                SET
                    status = $1,
                    updated_at = NOW()
                WHERE id = $2;
                `,
                [
                    newRequestStatus,
                    request_id
                ]
            );


            await client.query("COMMIT");


            return {
                response: response,
                request_status:
                    newRequestStatus
            };
        }


        // ==================================================
        // 4. ACCEPT
        // ==================================================

        if (response_status !== "ACCEPTED") {

            throw new Error(
                "Invalid response status"
            );
        }


        // ==================================================
        // 5. VALIDATE AVAILABLE QUANTITY
        // ==================================================
        if (
            available_quantity === undefined ||
            available_quantity === null ||
            Number(available_quantity) <= 0
        ) {

            throw new Error(
                "Available quantity must be greater than 0"
            );
        }


        const requestedQuantity =
            Number(request.quantity);

        const availableQuantity =
            Number(available_quantity);


        // ==================================================
        // 6. GET MATCHING BLOOD INVENTORY
        // ==================================================
        const inventory =
            await model.getBloodInventory(
                client,
                blood_bank_id,
                request.blood_group,
                request.blood_component,
                requestedQuantity
            );


        // ==================================================
        // 7. INVENTORY NOT FOUND
        // ==================================================
        if (!inventory) {

            throw new Error(
                "Blood bank does not have enough available blood in a single inventory batch"
            );
        }


        const inventoryAvailable =
            Number(
                inventory.units_available
            );


        // ==================================================
        // 8. CHECK AVAILABLE QUANTITY
        // ==================================================
        if (
            inventoryAvailable <
            requestedQuantity
        ) {

            throw new Error(
                `Blood bank has only ${inventoryAvailable} units available, but hospital requested ${requestedQuantity}`
            );
        }


        // ==================================================
        // 9. AVAILABLE QUANTITY CANNOT BE LESS THAN
        //    HOSPITAL REQUEST
        // ==================================================
        if (
            availableQuantity <
            requestedQuantity
        ) {

            throw new Error(
                `Available quantity must be at least ${requestedQuantity} units`
            );
        }


        // ==================================================
        // 10. GET BLOOD BANK LOCATION
        // ==================================================
        const bloodBankLocation =
            await model.getBloodBankLocation(
                client,
                blood_bank_id
            );


        if (
            !bloodBankLocation ||
            bloodBankLocation.latitude === null ||
            bloodBankLocation.longitude === null
        ) {

            throw new Error(
                "Blood bank location is not available"
            );
        }


        // ==================================================
        // 11. CHECK HOSPITAL LOCATION
        // ==================================================
        if (
            request.latitude === null ||
            request.latitude === undefined ||
            request.longitude === null ||
            request.longitude === undefined
        ) {

            throw new Error(
                "Hospital request location is not available"
            );
        }


        // ==================================================
        // 12. CONVERT COORDINATES TO NUMBERS
        // ==================================================
        const hospitalLatitude =
            Number(request.latitude);

        const hospitalLongitude =
            Number(request.longitude);

        const bloodBankLatitude =
            Number(
                bloodBankLocation.latitude
            );

        const bloodBankLongitude =
            Number(
                bloodBankLocation.longitude
            );


        // ==================================================
        // 13. HAVERSINE DISTANCE
        // ==================================================
        const toRadians = (degrees) =>
            degrees * Math.PI / 180;


        const earthRadiusKm = 6371;


        const latitudeDifference =
            toRadians(
                bloodBankLatitude -
                hospitalLatitude
            );


        const longitudeDifference =
            toRadians(
                bloodBankLongitude -
                hospitalLongitude
            );


        const a =
            Math.sin(
                latitudeDifference / 2
            ) ** 2 +

            Math.cos(
                toRadians(hospitalLatitude)
            ) *

            Math.cos(
                toRadians(bloodBankLatitude)
            ) *

            Math.sin(
                longitudeDifference / 2
            ) ** 2;


        const c =
            2 *
            Math.atan2(
                Math.sqrt(a),
                Math.sqrt(1 - a)
            );


        const distanceKm =
            earthRadiusKm * c;


        // ==================================================
        // 14. TRAVEL TIME
        //
        // Average speed = 30 km/h
        // ==================================================
        const travelTimeMinutes =
            Math.max(
                1,
                Math.ceil(
                    (distanceKm / 30) * 60
                )
            );


        // ==================================================
        // 15. RESERVATION TIME
        //
        // Reservation time = travel time × 2
        // ==================================================
        const reservationMinutes =
            travelTimeMinutes * 2;


        // ==================================================
        // 16. RESERVATION EXPIRY
        // ==================================================
        const reservedUntil =
            new Date(
                Date.now() +
                reservationMinutes *
                60 *
                1000
            );


        // ==================================================
        // 17. RESERVE BLOOD INVENTORY
        // ==================================================
        const reservationQuantity =
            requestedQuantity;


        const reservedInventory =
            await model.reserveInventory(
                client,
                inventory.id,
                reservationQuantity
            );


        // ==================================================
        // 18. DOUBLE CHECK INVENTORY UPDATE
        // ==================================================
        if (!reservedInventory) {

            throw new Error(
                "Blood inventory changed before reservation could be completed"
            );
        }


        // ==================================================
        // 19. CREATE ACCEPTED RESPONSE
        // ==================================================
        const response =
            await model.createResponse(
                client,
                {
                    request_id,

                    blood_bank_id,

                    response_status:
                        "ACCEPTED",

                    available_quantity:
                        availableQuantity,

                    response_message:
                        response_message ||
                        `${reservationQuantity} units of ${request.blood_group} ${request.blood_component} reserved successfully.`,

                    distance_km:
                        Number(
                            distanceKm.toFixed(2)
                        ),

                    reservation_minutes:
                        reservationMinutes,

                    reserved_quantity:
                        reservationQuantity,

                    reserved_until:
                        reservedUntil,

                    reservation_status:
                        "RESERVED",

                    inventory_id:
                        inventory.id
                }
            );


        // ==================================================
        // 20. UPDATE PARENT REQUEST STATUS
        // ==================================================
        await client.query(
            `
            UPDATE public.hospital_blood_requests
            SET
                status = 'ACCEPTED',
                updated_at = NOW()
            WHERE id = $1;
            `,
            [request_id]
        );


        // ==================================================
        // 21. COMMIT TRANSACTION
        // ==================================================
        await client.query("COMMIT");


        // ==================================================
        // 22. RETURN RESULT
        // ==================================================
        return {
            response,
            request_status: "ACCEPTED"
        };


    } catch (error) {

        await client.query("ROLLBACK");

        console.error(
            "RESPOND TO HOSPITAL BLOOD REQUEST ERROR:",
            error
        );

        throw error;

    } finally {

        client.release();
    }
};


// ======================================================
// GET BLOOD BANK HISTORY
// ======================================================
const getBloodBankHistory = async (
    blood_bank_id
) => {

    return await model.getBloodBankHistory(
        blood_bank_id
    );
};


// ======================================================
// GET HOSPITAL REQUEST HISTORY
// ======================================================
const getHospitalHistory = async (
    hospital_id
) => {

    return await model.getHospitalHistory(
        hospital_id
    );
};


// ======================================================
// EXPORT
// ======================================================
module.exports = {

    createRequest,

    getHospitalRequests,

    getHospitalRequestById,

    getPendingRequests,

    respondToRequest,

    releaseExpiredReservations,

    getBloodBankHistory,

    getHospitalHistory
};