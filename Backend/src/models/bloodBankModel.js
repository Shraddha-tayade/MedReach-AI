const pool = require("../config/db");

const createBloodBank = async (
    username, password, bloodBankName,
    licenceNumber, contact,
    addressLine, city, state, pincode,
    operatingLicence, addressProof,
    latitude, longitude
) => {

    const result = await pool.query(
        `INSERT INTO blood_banks
        (
            username,
            password,
            blood_bank_name,
            licence_number,
            contact,
            address_line,
            city,
            state,
            pincode,
            operating_licence,
            address_proof,
            location
        )
        VALUES (
            $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,
            ST_SetSRID(ST_MakePoint($13, $12), 4326)::geography
        )
        RETURNING
            id,
            username,
            blood_bank_name,
            licence_number,
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
            username, password, bloodBankName,
            licenceNumber, contact,
            addressLine, city, state, pincode,
            operatingLicence, addressProof,
            latitude, longitude
        ]
    );

    return result.rows[0];
};


const findBloodBankByUsername = async (username) => {

    const result = await pool.query(
        `SELECT * FROM blood_banks WHERE username = $1`,
        [username]
    );

    return result.rows[0];
};


module.exports = {
    createBloodBank,
    findBloodBankByUsername
};