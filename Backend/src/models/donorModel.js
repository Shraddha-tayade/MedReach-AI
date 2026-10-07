const pool = require("../config/db");

const createDonor = async (
    name,
    email,
    phone,
    password,
    bloodGroup,
    dateOfBirth,
    profilePicture,
    addressLine,
    city,
    state,
    pincode,
     latitude, longitude
) => {
    const result = await pool.query(
        `INSERT INTO donors
        (
            name,
            email,
            phone,
            password,
            blood_group,
            date_of_birth,
            profile_picture,
            address_line,
            city,
            state,
            pincode,
            location
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11,
            ST_SetSRID(ST_MakePoint($13, $12), 4326)::geography
            )
        RETURNING
            id,
            name,
            email,
            phone,
            blood_group,
            date_of_birth,
            profile_picture,
            address_line,
            city,
            state,
            pincode,
            created_at,
            ST_Y(location::geometry) AS latitude,
            ST_X(location::geometry) AS longitude`,
        [
            name,
            email,
            phone,
            password,
            bloodGroup,
            dateOfBirth,
            profilePicture,
            addressLine,
            city,
            state,
            pincode,
            latitude,
            longitude
        ]
    );

    return result.rows[0];
};

const findDonorByEmail = async (email) => {
    const result = await pool.query(
        `SELECT * FROM donors WHERE email = $1`,
        [email]
    );

    return result.rows[0];
};

// FIND DONOR BY ID
// ===============================
const findDonorById = async (id) => {
    const result = await pool.query(
        `SELECT
            id,
            name,
            email,
            phone,
            blood_group,
            date_of_birth,
            profile_picture,
            address_line,
            city,
            state,
            pincode,
            location,
            created_at
         FROM donors
         WHERE id = $1`,
        [id]
    );

    return result.rows[0];
};
module.exports = {
    createDonor,
    findDonorByEmail,
    findDonorById
};