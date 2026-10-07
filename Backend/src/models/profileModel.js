
const pool = require("../config/db");

// ==========================
// USER
// ==========================
const updateUserProfile = async (
    id,
    name,
    email,
    phone,
    address_line,
    city,
    state,
    pincode,
    date_of_birth,
    profile_picture
) => {
    const query = `
        UPDATE users
        SET
            name = COALESCE($1, name),
            email = COALESCE($2, email),
            phone = COALESCE($3, phone),
            address_line = COALESCE($4, address_line),
            city = COALESCE($5, city),
            state = COALESCE($6, state),
            pincode = COALESCE($7, pincode),
            date_of_birth = COALESCE($8, date_of_birth),
            profile_picture = COALESCE($9, profile_picture)
        WHERE id = $10
        RETURNING
            id,
            name,
            email,
            phone,
            address_line,
            city,
            state,
            pincode,
            date_of_birth,
            profile_picture,
            created_at;
    `;

    const values = [
        name,
        email,
        phone,
        address_line,
        city,
        state,
        pincode,
        date_of_birth,
        profile_picture,
        id
    ];

    const result = await pool.query(query, values);
    return result.rows[0];
};


// ==========================
// DONOR
// ==========================
const updateDonorProfile = async (
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
    pincode
) => {
    const query = `
        UPDATE donors
        SET
            name = COALESCE($1, name),
            email = COALESCE($2, email),
            phone = COALESCE($3, phone),
            blood_group = COALESCE($4, blood_group),
            date_of_birth = COALESCE($5, date_of_birth),
            profile_picture = COALESCE($6, profile_picture),
            address_line = COALESCE($7, address_line),
            city = COALESCE($8, city),
            state = COALESCE($9, state),
            pincode = COALESCE($10, pincode)
        WHERE id = $11
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
            created_at;
    `;

    const values = [
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
        id
    ];

    const result = await pool.query(query, values);
    return result.rows[0];
};


// ==========================
// HOSPITAL
// ==========================
const updateHospitalProfile = async (
    id,
    hospital_name,
    contact,
    address_line,
    city,
    state,
    pincode
) => {
    const query = `
        UPDATE hospitals
        SET
            hospital_name = COALESCE($1, hospital_name),
            contact = COALESCE($2, contact),
            address_line = COALESCE($3, address_line),
            city = COALESCE($4, city),
            state = COALESCE($5, state),
            pincode = COALESCE($6, pincode)
        WHERE id = $7
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
            created_at;
    `;

    const values = [
        hospital_name,
        contact,
        address_line,
        city,
        state,
        pincode,
        id
    ];

    const result = await pool.query(query, values);
    return result.rows[0];
};


// ==========================
// BLOOD BANK
// ==========================
const updateBloodBankProfile = async (
    id,
    blood_bank_name,
    contact,
    address_line,
    city,
    state,
    pincode
) => {
    const query = `
        UPDATE blood_banks
        SET
            blood_bank_name = COALESCE($1, blood_bank_name),
            contact = COALESCE($2, contact),
            address_line = COALESCE($3, address_line),
            city = COALESCE($4, city),
            state = COALESCE($5, state),
            pincode = COALESCE($6, pincode)
        WHERE id = $7
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
            created_at;
    `;

    const values = [
        blood_bank_name,
        contact,
        address_line,
        city,
        state,
        pincode,
        id
    ];

    const result = await pool.query(query, values);
    return result.rows[0];
};


// ==========================
// AMBULANCE
// ==========================
const updateAmbulanceProfile = async (
    id,
    ambulance_number,
    ambulance_type,
    ambulance_category,
    contact,
    address_line,
    city,
    state,
    pincode
) => {
    const query = `
        UPDATE ambulances
        SET
            ambulance_number = COALESCE($1, ambulance_number),
            ambulance_type = COALESCE($2, ambulance_type),
            ambulance_category = COALESCE($3, ambulance_category),
            contact = COALESCE($4, contact),
            address_line = COALESCE($5, address_line),
            city = COALESCE($6, city),
            state = COALESCE($7, state),
            pincode = COALESCE($8, pincode)
        WHERE id = $9
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
            created_at;
    `;

    const values = [
        ambulance_number,
        ambulance_type,
        ambulance_category,
        contact,
        address_line,
        city,
        state,
        pincode,
        id
    ];

    const result = await pool.query(query, values);
    return result.rows[0];
};


const getUserProfile = async (id) => {
    const result = await pool.query(
        `
        SELECT
            id,
            name,
            email,
            phone,
            date_of_birth,
            profile_picture,
            address_line,
            city,
            state,
            pincode,
            created_at
        FROM users
        WHERE id = $1
        `,
        [id]
    );

    return result.rows[0];
};

const getDonorProfile = async (id) => {
    const result = await pool.query(
        `
        SELECT
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
            location
        FROM donors
        WHERE id = $1
        `,
        [id]
    );

    return result.rows[0];
};

const getHospitalProfile = async (id) => {
    const result = await pool.query(
        `
        SELECT
            id,
            username,
            hospital_name,
            registration_number,
            contact,
            address_line,
            city,
            state,
            pincode,
            registration_certificate,
            address_proof,
            verification_status,
            created_at,
            location
        FROM hospitals
        WHERE id = $1
        `,
        [id]
    );

    return result.rows[0];
};

const getBloodBankProfile = async (id) => {
    const result = await pool.query(
        `
        SELECT
            id,
            username,
            blood_bank_name,
            registration_number,
            contact,
            address_line,
            city,
            state,
            pincode,
            registration_certificate,
            address_proof,
            verification_status,
            created_at,
            location
        FROM blood_banks
        WHERE id = $1
        `,
        [id]
    );

    return result.rows[0];
};

const getAmbulanceProfile = async (id) => {
    const result = await pool.query(
        `
        SELECT
            id,
            username,
            ambulance_name,
            contact,
            ambulance_type,
            ownership_type,
            address_line,
            city,
            state,
            pincode,
            verification_status,
            created_at,
            location
        FROM ambulances
        WHERE id = $1
        `,
        [id]
    );

    return result.rows[0];
};

// ==========================
// EXPORT FUNCTIONS
// ==========================
module.exports = {
    updateUserProfile,
    updateDonorProfile,
    updateHospitalProfile,
    updateBloodBankProfile,
    updateAmbulanceProfile,
    getUserProfile,
    getDonorProfile,
    getHospitalProfile,
    getBloodBankProfile,
    getAmbulanceProfile
};