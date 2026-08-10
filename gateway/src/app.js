const express = require("express");

const driverRoutes =
    require("./routes/driverRoutes");

const app = express();

app.use(express.json());

app.get("/health", (req, res) => {

    res.json({
        success: true,
        service: "api-gateway",
    });

});

app.use(
    "/api/v1/drivers",
    driverRoutes
);

module.exports = app;