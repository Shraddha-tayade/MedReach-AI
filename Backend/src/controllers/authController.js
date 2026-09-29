const authService = require("../services/authService");

// ================= REGISTER =================

const register = async (req, res) => {
    try {
        const data = req.body;
        const type = req.query.type;

        const result = await authService.register(
            data,
            type
        );

        return res.status(201).json(result);

    } catch (error) {
        console.error(error);

        return res.status(400).json({
            message: error.message
        });
    }
};

// ================= LOGIN =================

const login = async (req, res) => {
    try {
        const data = req.body;
        const type = req.query.type;

        const result = await authService.login(
            data,
            type
        );

        return res.json(result);

    } catch (error) {
        console.error(error);

        return res.status(401).json({
            message: error.message
        });
    }
};

module.exports = {
    register,
    login
};