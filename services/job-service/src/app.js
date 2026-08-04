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

module.exports = app;