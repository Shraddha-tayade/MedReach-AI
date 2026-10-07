const {
    getBloodBankHistory
} = require("../models/bloodBankHistoryModel");

//console.log("REAL BLOOD HISTORY SERVICE LOADED");

const fetchBloodBankHistory = async (blood_bank_id) => {
   // console.log("Fetching real history for blood bank:", blood_bank_id);

    if (!blood_bank_id) {
        throw new Error("Blood bank ID is required");
    }

    return await getBloodBankHistory(blood_bank_id);
};

module.exports = {
    fetchBloodBankHistory
};