const express = require("express");
const cors = require("cors");
require("dotenv").config();

require("./config/db");
const authRoutes = require("./routes/authRoutes");
const authenticateToken = require("./middleware/authMiddleware");

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);

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