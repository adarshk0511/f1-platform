const express = require("express");

const driverRoutes =
    require("./routes/driverRoutes");
const authRoutes =
    require("./routes/authRoutes");
const jobRoutes =
    require("./routes/jobRoutes");

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

app.use(
    "/api/v1/auth",
    authRoutes
);
    
app.use(
    "/api/v1/jobs",
    jobRoutes
);

module.exports = app;