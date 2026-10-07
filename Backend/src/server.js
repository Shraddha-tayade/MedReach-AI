const express = require("express");
const cors = require("cors");
require("dotenv").config();

require("./config/db");
const authRoutes = require("./routes/authRoutes");
const authenticateToken = require("./middleware/authMiddleware");

const profilesRoutes = require("./routes/profilesRoutes");
const bloodInventoryRoutes = require("./routes/bloodInventoryRoutes");
const bloodBankHistoryRoutes =require("./routes/bloodBankHistoryRoutes");
const icuBedInventoryRoutes =require("./routes/icuBedInventoryRoutes");
const oxygenBedInventoryRoutes =require("./routes/oxygenBedInventoryRoutes");
const hospitalBloodRequestRoutes =require("./routes/hospitalBloodRequestRoutes");
const bloodBankHospitalRequestRoutes =require("./routes/bloodBankHospitalRequestRoutes");
const emergencyBloodRequestRoutes =require("./routes/emergencyBloodRequestRoutes");
const emergencyBloodResponseRoutes =require("./routes/emergencyBloodResponseRoutes");
const hospitalEmergencyRequestRoutes = require("./routes/hospitalEmergencyRequestRoutes");
const hospitalEmergencyResponseRoutes = require("./routes/hospitalEmergencyResponseRoutes");
const hospitalEmergencyHistoryRoutes = require("./routes/hospitalEmergencyHistoryRoutes");
const bloodBankEmergencyHistoryRoutes =require("./routes/bloodBankEmergencyHistoryRoutes");

const app = express();


app.use(cors());
app.use(express.json());
app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/profile", profilesRoutes);
app.use("/api/blood-bank/inventory", bloodInventoryRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/profile", profilesRoutes);
app.use("/api/blood-bank/inventory", bloodInventoryRoutes);
app.use("/api/blood-bank/history", authenticateToken, bloodBankHistoryRoutes);
app.use("/api/hospital/icu-inventory",icuBedInventoryRoutes);  //http://localhost:5000/api/hospital/icu-inventory
app.use("/api/hospital/oxygen-inventory",oxygenBedInventoryRoutes); //http://localhost:5000/api/hospital/oxygen-inventory
app.use("/api/hospital/blood-requests",hospitalBloodRequestRoutes);
app.use("/api/blood-bank/hospital-requests",bloodBankHospitalRequestRoutes);
app.use("/api/blood-bank/emergency-blood-requests",emergencyBloodRequestRoutes);
app.use("/api/blood-bank/emergency-blood-responses",emergencyBloodResponseRoutes);
app.use("/api/hospital/emergency-bed-requests",hospitalEmergencyRequestRoutes);
app.use("/api/hospital/emergency-bed-responses",hospitalEmergencyResponseRoutes);
app.use( "/api/hospital/emergency-history", hospitalEmergencyHistoryRoutes);
app.use("/api/blood-bank/emergency-history", bloodBankEmergencyHistoryRoutes);


app.get("/", (req, res) => {
    res.json({
        message: "MedReach Backend is running"
    });
});

//http://localhost:5000/api/protected
app.get("/api/protected", authenticateToken, (req, res) => {
    res.json({
        message: "You accessed a protected API",
        user: req.user
    });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});