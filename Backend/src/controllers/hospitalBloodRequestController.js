const service = require("../services/hospitalBloodRequestService");


// ======================================================
// HOSPITAL - CREATE BLOOD REQUEST
// ======================================================
const createRequest = async (req, res) => {
    try {

        const hospital_id = req.user.id;

        const {
            blood_group,
            blood_component,
            quantity,
            request_address,
            city,
            state,
            pincode,
            latitude,
            longitude,
            search_radius_km,
            description
        } = req.body;

        // ----------------------------------------------
        // Validation
        // ----------------------------------------------
        if (
            !blood_group ||
            !blood_component ||
            quantity === undefined ||
            quantity === null
        ) {
            return res.status(400).json({
                message:
                    "blood_group, blood_component and quantity are required"
            });
        }

        if (
            !Number.isInteger(Number(quantity)) ||
            Number(quantity) <= 0
        ) {
            return res.status(400).json({
                message:
                    "Quantity must be a positive integer"
            });
        }

        // ----------------------------------------------
        // Normalize blood group
        // ----------------------------------------------
        const normalizedBloodGroup =
            blood_group
                .toString()
                .trim()
                .toUpperCase();

        // ----------------------------------------------
        // Normalize component
        //
        // PRBC -> PACKED_RBC
        // ----------------------------------------------
        const componentInput =
            blood_component
                .toString()
                .trim()
                .toUpperCase();

        const normalizedComponent =
            componentInput === "PRBC"
                ? "PACKED_RBC"
                : componentInput;

        const result = await service.createRequest({

            hospital_id,

            blood_group:
                normalizedBloodGroup,

            blood_component:
                normalizedComponent,

            quantity:
                Number(quantity),

            request_address:
                request_address || null,

            city:
                city || null,

            state:
                state || null,

            pincode:
                pincode || null,

            latitude:
                latitude ?? null,

            longitude:
                longitude ?? null,

            search_radius_km:
                search_radius_km ?? null,

            description:
                description || null
        });

        return res.status(201).json({
            message:
                "Blood request created successfully",
            request: result
        });

    } catch (error) {

        console.error(
            "CREATE HOSPITAL BLOOD REQUEST ERROR:",
            error
        );

        return res.status(500).json({
            message:
                "Failed to create blood request",
            error: error.message
        });
    }
};


// ======================================================
// HOSPITAL - GET MY REQUESTS
// ======================================================
const getMyRequests = async (req, res) => {
    try {

        const hospital_id = req.user.id;

        const result =
            await service.getHospitalRequests(
                hospital_id
            );

        return res.status(200).json({
            message:
                "Hospital blood requests fetched successfully",
            requests: result
        });

    } catch (error) {

        console.error(
            "GET HOSPITAL BLOOD REQUESTS ERROR:",
            error
        );

        return res.status(500).json({
            message:
                "Failed to fetch blood requests",
            error: error.message
        });
    }
};


// ======================================================
// HOSPITAL - GET ONE REQUEST
// ======================================================
const getRequestById = async (req, res) => {
    try {

        const hospital_id = req.user.id;
        const request_id = Number(req.params.id);

        if (!Number.isInteger(request_id)) {
            return res.status(400).json({
                message:
                    "Invalid request ID"
            });
        }

        const result =
            await service.getHospitalRequestById(
                hospital_id,
                request_id
            );

        if (!result) {
            return res.status(404).json({
                message:
                    "Blood request not found"
            });
        }

        return res.status(200).json(result);

    } catch (error) {

        console.error(
            "GET HOSPITAL BLOOD REQUEST ERROR:",
            error
        );

        return res.status(500).json({
            message:
                "Failed to fetch blood request",
            error: error.message
        });
    }
};


// ======================================================
// BLOOD BANK - GET PENDING HOSPITAL REQUESTS
// ======================================================
const getPendingRequests = async (req, res) => {
    try {

        const blood_bank_id = req.user.id;

        const result =
            await service.getPendingRequests(
                blood_bank_id
            );

        return res.status(200).json({
            message:
                "Pending hospital blood requests fetched successfully",
            requests: result
        });

    } catch (error) {

        console.error(
            "GET PENDING HOSPITAL BLOOD REQUESTS ERROR:",
            error
        );

        return res.status(500).json({
            message:
                "Failed to fetch pending requests",
            error: error.message
        });
    }
};


// ======================================================
// BLOOD BANK - ACCEPT / REJECT REQUEST
// ======================================================
const respondToRequest = async (req, res) => {
    try {

        const blood_bank_id = req.user.id;

        const request_id =
            Number(req.params.id);

        const {
            response_status,
            available_quantity,
            response_message
        } = req.body;

        // ----------------------------------------------
        // Validate ID
        // ----------------------------------------------
        if (!Number.isInteger(request_id)) {
            return res.status(400).json({
                message:
                    "Invalid request ID"
            });
        }

        // ----------------------------------------------
        // Validate response status
        // ----------------------------------------------
        if (
            !response_status ||
            !["ACCEPTED", "REJECTED"]
                .includes(
                    response_status
                        .toString()
                        .toUpperCase()
                )
        ) {
            return res.status(400).json({
                message:
                    "response_status must be ACCEPTED or REJECTED"
            });
        }

        const normalizedStatus =
            response_status
                .toString()
                .toUpperCase();

        // ----------------------------------------------
        // ACCEPTED requires quantity
        // ----------------------------------------------
        if (
            normalizedStatus === "ACCEPTED" &&
            (
                available_quantity === undefined ||
                available_quantity === null ||
                Number(available_quantity) <= 0
            )
        ) {
            return res.status(400).json({
                message:
                    "available_quantity must be greater than 0 when accepting"
            });
        }

        const result =
            await service.respondToRequest({

                request_id,

                blood_bank_id,

                response_status:
                    normalizedStatus,

                available_quantity:
                    available_quantity !== undefined &&
                    available_quantity !== null
                        ? Number(available_quantity)
                        : 0,

                response_message:
                    response_message || null
            });

        return res.status(200).json({
            message:
                `Blood request ${normalizedStatus.toLowerCase()} successfully`,

            response:
                result.response,

            request_status:
                result.request_status
        });

    } catch (error) {

        console.error(
            "RESPOND TO HOSPITAL BLOOD REQUEST ERROR:",
            error
        );

        return res.status(400).json({
            message:
                error.message
        });
    }
};


// ======================================================
// BLOOD BANK - RESPONSE HISTORY
// ======================================================
const getHistory = async (req, res) => {
    try {

        const blood_bank_id =
            req.user.id;

        const result =
            await service.getBloodBankHistory(
                blood_bank_id
            );

        return res.status(200).json({
            message:
                "Blood bank response history fetched successfully",

            history:
                result
        });

    } catch (error) {

        console.error(
            "GET BLOOD BANK HISTORY ERROR:",
            error
        );

        return res.status(500).json({
            message:
                "Failed to fetch blood bank history",
            error: error.message
        });
    }
};


// ======================================================
// HOSPITAL - REQUEST HISTORY
// ======================================================
const getHospitalHistory = async (req, res) => {
    try {

        const hospital_id =
            req.user.id;

        const result =
            await service.getHospitalHistory(
                hospital_id
            );

        return res.status(200).json({
            message:
                "Hospital blood request history fetched successfully",

            history:
                result
        });

    } catch (error) {

        console.error(
            "GET HOSPITAL BLOOD REQUEST HISTORY ERROR:",
            error
        );

        return res.status(500).json({
            message:
                "Failed to fetch hospital blood request history",
            error: error.message
        });
    }
};


module.exports = {
    createRequest,
    getMyRequests,
    getRequestById,
    getPendingRequests,
    respondToRequest,
    getHistory,
    getHospitalHistory
};