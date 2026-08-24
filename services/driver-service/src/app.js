require("dotenv").config();

const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const compression = require("compression");
const driverRoutes = require("./routes/driverRoutes");
const gatewayAuth =
    require("./middleware/gatewayAuth");
const internalImportRoutes =
    require("./routes/internalImportRoutes");

const app = express();

app.use(helmet());

app.use(cors());

app.use(compression());

app.use(express.json());

app.use(
    "/api/v1/drivers",
    gatewayAuth,
    driverRoutes
);

app.use(
    "/internal/drivers",
    internalImportRoutes
);

app.get("/health", (req, res) => {
    res.status(200).json({
        success: true,
        service: "driver-service",
        status: "UP"
    });
});

module.exports = app;