const {
    updateUserProfile,
    updateDonorProfile,
    updateHospitalProfile,
    updateBloodBankProfile,
    updateAmbulanceProfile
} = require("../models/profileModel");


const updateProfile = async (req, res) => {
    try {

        const id = req.user.id;
        const role = req.user.role;

        const {
            name,
            email,
            phone,
            blood_group,
            date_of_birth,
            profile_picture,
            hospital_name,
            blood_bank_name,
            ambulance_number,
            ambulance_type,
            ambulance_category,
            contact,
            address_line,
            city,
            state,
            pincode
        } = req.body;


        let profile;


        // USER
        if (role === "user") {

            profile = await updateUserProfile(
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
            );

        }


        // DONOR
        else if (role === "donor") {

            profile = await updateDonorProfile(
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
            );

        }


        // HOSPITAL
        else if (role === "hospital") {

            profile = await updateHospitalProfile(
                id,
                hospital_name,
                contact,
                address_line,
                city,
                state,
                pincode
            );

        }


        // BLOOD BANK
        else if (role === "blood_bank") {

            profile = await updateBloodBankProfile(
                id,
                blood_bank_name,
                contact,
                address_line,
                city,
                state,
                pincode
            );

        }


        // AMBULANCE
        else if (role === "ambulance") {

            profile = await updateAmbulanceProfile(
                id,
                ambulance_number,
                ambulance_type,
                ambulance_category,
                contact,
                address_line,
                city,
                state,
                pincode
            );

        }


        // INVALID ROLE
        else {

            return res.status(400).json({
                message: "Invalid user role"
            });

        }


        // PROFILE NOT FOUND
        if (!profile) {

            return res.status(404).json({
                message: "Profile not found"
            });

        }


        return res.status(200).json({
            message: "Profile updated successfully",
            profile: profile
        });


    } catch (error) {

        console.error("Update Profile Error:", error);

        if (error.code === "23505") {

            return res.status(409).json({
                message: "Email, phone or unique value already exists"
            });

        }


        return res.status(500).json({
            message: "Internal server error"
        });

    }
};


// VERY IMPORTANT
module.exports = {
    updateProfile
};