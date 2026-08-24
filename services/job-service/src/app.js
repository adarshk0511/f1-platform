require("dotenv").config();

const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const compression = require("compression");
const jobRoutes =
    require("./routes/jobRoutes");

const app = express();

app.use(helmet());
app.use(cors());
app.use(compression());
app.use(express.json());

app.use(
    "/internal/jobs",
    jobRoutes
);

app.get("/health", (req, res) => {
    res.status(200).json({
        success: true,
        service: "driver-service",
        status: "UP"
    });
});

module.exports = app;