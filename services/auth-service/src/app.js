require("dotenv").config();

const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const compression = require("compression");
const cookieParser = require("cookie-parser");

const app = express();

app.use(helmet());

app.use(
    cors({
        origin: "http://localhost:5173",
        credentials: true,
    })
);

app.use(compression());

app.use(express.json());

app.use(cookieParser());

const authRoutes = require("./routes/authRoutes");

app.use(
    "/api/v1/auth",
    authRoutes
);

app.get("/health", (req, res) => {
    res.status(200).json({
        success: true,
        service: "driver-service",
        status: "UP"
    });
});

module.exports = app;