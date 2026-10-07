const pool = require("../config/db");

const createHospital = async (
    username,
    password,
    hospitalName,
    registrationNumber,
    contact,
    addressLine,
    city,
    state,
    pincode,
    registrationCertificate,
    addressProof, latitude, longitude
) => {
    const result = await pool.query(
        `INSERT INTO hospitals
        (
            username,
            password,
            hospital_name,
            registration_number,
            contact,
            address_line,
            city,
            state,
            pincode,
            registration_certificate,
            address_proof, 
            location
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11,
        ST_SetSRID(ST_MakePoint($13, $12), 4326)::geography
        )
        RETURNING
            id,
            username,
            hospital_name,
            registration_number,
            contact,
            address_line,
            city,
            state,
            pincode,
            verification_status,
            created_at,
            ST_Y(location::geometry) AS latitude,
            ST_X(location::geometry) AS longitude`,
        [
            username,
            password,
            hospitalName,
            registrationNumber,
            contact,
            addressLine,
            city,
            state,
            pincode,
            registrationCertificate,
            addressProof,
            latitude, 
            longitude
        ]
    );

    return result.rows[0];
};

const findHospitalByUsername = async (username) => {
    const result = await pool.query(
        `SELECT * FROM hospitals WHERE username = $1`,
        [username]
    );

    return result.rows[0];
};

module.exports = {
    createHospital,
    findHospitalByUsername
};