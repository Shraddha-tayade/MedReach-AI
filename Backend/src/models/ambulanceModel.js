const pool = require("../config/db");

const createAmbulance = async (
    username,
    password,
    ambulanceNumber,
    ambulanceType,
    ambulanceCategory,
    hospitalId,
    contact,
    addressLine,
    city,
    state,
    pincode,
    rcDocument,
    fitnessCertificate
) => {
    const result = await pool.query(
        `INSERT INTO ambulances
        (
            username,
            password,
            ambulance_number,
            ambulance_type,
            ambulance_category,
            hospital_id,
            contact,
            address_line,
            city,
            state,
            pincode,
            rc_document,
            fitness_certificate
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
        RETURNING
            id,
            username,
            ambulance_number,
            ambulance_type,
            ambulance_category,
            hospital_id,
            contact,
            address_line,
            city,
            state,
            pincode,
            verification_status,
            created_at`,
        [
            username,
            password,
            ambulanceNumber,
            ambulanceType,
            ambulanceCategory,
            hospitalId,
            contact,
            addressLine,
            city,
            state,
            pincode,
            rcDocument,
            fitnessCertificate
        ]
    );

    return result.rows[0];
};

const findAmbulanceByUsername = async (username) => {
    const result = await pool.query(
        `SELECT * FROM ambulances WHERE username = $1`,
        [username]
    );

    return result.rows[0];
};

module.exports = {
    createAmbulance,
    findAmbulanceByUsername
};