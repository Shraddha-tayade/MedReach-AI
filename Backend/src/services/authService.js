const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const axios = require("axios");

const userModel = require("../models/userModel");
const donorModel = require("../models/donorModel");
const hospitalModel = require("../models/hospitalModel");
const bloodBankModel = require("../models/bloodBankModel");
const ambulanceModel = require("../models/ambulanceModel");


const generateToken = (id, type) => {
    return jwt.sign(
        { id, type },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
    );
};


// ================= REGISTER =================

const register = async (data, type) => {

    if (!type) {
        throw new Error("Account type is required");
    }


    // USER
    if (type === "USER") {

        if (await userModel.findUserByEmail(data.email)) {
            throw new Error("Email already registered");
        }

        const password = await bcrypt.hash(data.password, 10);

        const user = await userModel.createUser(
            data.name,
            data.email,
            data.phone,
            password,
            data.addressLine,
            data.city,
            data.state,
            data.pincode,
            data.dateOfBirth,
            data.profilePicture
        );

        return {
            message: "User registered successfully",
            user
        };
    }


    // DONOR
    if (type === "DONOR") {

        if (await donorModel.findDonorByEmail(data.email)) {
            throw new Error("Email already registered");
        }

        const password = await bcrypt.hash(data.password, 10);

        const donor = await donorModel.createDonor(
            data.name,
            data.email,
            data.phone,
            password,
            data.bloodGroup,
            data.dateOfBirth,
            data.profilePicture,
            data.addressLine,
            data.city,
            data.state,
            data.pincode
        );

        return {
            message: "Donor registered successfully",
            donor
        };
    }


    // HOSPITAL
    if (type === "HOSPITAL") {

        if (await hospitalModel.findHospitalByUsername(data.username)) {
            throw new Error("Username already registered");
        }

        const password = await bcrypt.hash(data.password, 10);

        const hospital = await hospitalModel.createHospital(
            data.username,
            password,
            data.hospitalName,
            data.registrationNumber,
            data.contact,
            data.addressLine,
            data.city,
            data.state,
            data.pincode,
            data.registrationCertificate,
            data.addressProof
        );

        return {
            message: "Hospital registration submitted",
            hospital
        };
    }


    // BLOOD BANK
    if (type === "BLOOD_BANK") {

        if (await bloodBankModel.findBloodBankByUsername(data.username)) {
            throw new Error("Username already registered");
        }

        const password = await bcrypt.hash(data.password, 10);

        // Combine address
        const address =
            `${data.addressLine}, ${data.city}, ${data.state}, ${data.pincode}`;

        // Get coordinates from Geoapify
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
            throw new Error("Unable to find blood bank location");
        }

        const coordinates =
            response.data.features[0].geometry.coordinates;

        const longitude = coordinates[0];
        const latitude = coordinates[1];

        const bloodBank = await bloodBankModel.createBloodBank(
            data.username,
            password,
            data.bloodBankName,
            data.licenceNumber,
            data.contact,
            data.addressLine,
            data.city,
            data.state,
            data.pincode,
            data.operatingLicence,
            data.addressProof,
            latitude,
            longitude
        );

        return {
            message: "Blood bank registration submitted",
            bloodBank
        };
    }


    // AMBULANCE
    if (type === "AMBULANCE") {

        if (await ambulanceModel.findAmbulanceByUsername(data.username)) {
            throw new Error("Username already registered");
        }

        if (
            data.ambulanceCategory === "PRIVATE" &&
            !data.hospitalId
        ) {
            throw new Error(
                "Hospital is required for private ambulance"
            );
        }

        const password = await bcrypt.hash(data.password, 10);

        const ambulance = await ambulanceModel.createAmbulance(
            data.username,
            password,
            data.ambulanceNumber,
            data.ambulanceType,
            data.ambulanceCategory,
            data.hospitalId || null,
            data.contact,
            data.addressLine,
            data.city,
            data.state,
            data.pincode,
            data.rcDocument,
            data.fitnessCertificate
        );

        return {
            message: "Ambulance registration submitted",
            ambulance
        };
    }


    throw new Error("Invalid account type");
};


// ================= LOGIN =================

const login = async (data, type) => {

    if (!type) {
        throw new Error("Account type is required");
    }


    // ADMIN
    if (type === "ADMIN") {

        if (
            data.username !== process.env.ADMIN_USERNAME ||
            data.password !== process.env.ADMIN_PASSWORD
        ) {
            throw new Error("Invalid admin credentials");
        }

        const token = generateToken(null, "ADMIN");

        return {
            message: "Admin login successful",
            token,
            type: "ADMIN"
        };
    }


    let account;


    // USER
    if (type === "USER") {

        account = await userModel.findUserByEmail(
            data.email
        );
    }


    // DONOR
    else if (type === "DONOR") {

        account = await donorModel.findDonorByEmail(
            data.email
        );
    }


    // HOSPITAL
    else if (type === "HOSPITAL") {

        account = await hospitalModel.findHospitalByUsername(
            data.username
        );
    }


    // BLOOD BANK
    else if (type === "BLOOD_BANK") {

        account = await bloodBankModel.findBloodBankByUsername(
            data.username
        );
    }


    // AMBULANCE
    else if (type === "AMBULANCE") {

        account = await ambulanceModel.findAmbulanceByUsername(
            data.username
        );
    }


    else {
        throw new Error("Invalid account type");
    }


    // ACCOUNT NOT FOUND
    if (!account) {
        throw new Error(
            "Invalid username/email or password"
        );
    }


    // VERIFICATION CHECK
    if (
        ["HOSPITAL", "BLOOD_BANK", "AMBULANCE"].includes(type) &&
        account.verification_status !== "APPROVED"
    ) {
        throw new Error("Account is not verified");
    }


    // PASSWORD CHECK
    const validPassword = await bcrypt.compare(
        data.password,
        account.password
    );

    if (!validPassword) {
        throw new Error(
            "Invalid username/email or password"
        );
    }


    // GENERATE TOKEN
    const token = generateToken(
        account.id,
        type
    );


    // REMOVE PASSWORD
    const { password, ...accountData } = account;


    return {
        message: "Login successful",
        token,
        type,
        account: accountData
    };
};


module.exports = {
    register,
    login
};