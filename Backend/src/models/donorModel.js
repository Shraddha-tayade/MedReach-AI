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
    pincode
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
            pincode
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
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
            created_at`,
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
            pincode
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

module.exports = {
    createDonor,
    findDonorByEmail
};