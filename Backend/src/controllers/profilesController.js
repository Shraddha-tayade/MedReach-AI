// const {
//     updateUserProfile,
//     updateDonorProfile,
//     updateHospitalProfile,
//     updateBloodBankProfile,
//     updateAmbulanceProfile
// } = require("../models/profileModel");

const profileModel = require("../models/profileModel");
const updateProfile = async (req, res) => {
    try {

        const id = req.user.id;
        const role = req.user.type.toLowerCase();

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

            profile = await profileModel.updateUserProfile(
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

            profile = await profileModel.updateDonorProfile(
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

            profile = await profileModel.updateHospitalProfile(
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

            profile = await profileModel.updateBloodBankProfile(
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

            profile = await profileModel.updateAmbulanceProfile(
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


const viewProfile = async (req, res) => {
    try {
        const { id, type } = req.user;

        let profile;

        switch (type) {
            case "USER":
                profile = await profileModel.getUserProfile(id);
                break;

            case "DONOR":
                profile = await profileModel.getDonorProfile(id);
                break;

            case "HOSPITAL":
                profile = await profileModel.getHospitalProfile(id);
                break;

            case "BLOOD_BANK":
                profile = await profileModel.getBloodBankProfile(id);
                break;

            case "AMBULANCE":
                profile = await profileModel.getAmbulanceProfile(id);
                break;

            default:
                console.error("Invalid type:", type);
                return res.status(400).json({
                    success: false,
                    message: "Invalid type"
                });
        }

        if (!profile) {
            return res.status(404).json({
                success: false,
                message: "Profile not found"
            });
        }

        return res.status(200).json({
            success: true,
            type,
            profile
        });

    } catch (error) {
        console.error("View profile error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch profile"
        });
    }
};

// VERY IMPORTANT
module.exports = {
    updateProfile,
    viewProfile
};