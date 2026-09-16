const express = require("express");
const {
    register,
    login
} = require("../controllers/authController");

const router = express.Router();

//http://localhost:5000/api/auth/register
router.post("/register", register);

//http://localhost:5000/api/auth/login
router.post("/login", login);

module.exports = router;