const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

pool.connect()
    .then(() => {
        console.log("Supabase PostgreSQL connected");
    })
    .catch((err) => {
        console.error("Database connection failed:", err.message);
        console.log("dtabase url exist",!!process.env.DATABASE_URL);
    });

module.exports = pool;