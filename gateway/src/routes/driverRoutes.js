const express = require("express");
const createProxyRequest = require("../utils/proxyRequest");
const config = require("../config");

const router = express.Router();

const driverProxy = createProxyRequest(
    "Driver Service",
    config.services.driver.url,
    {
        headers: {
            "X-Gateway-Key": config.services.driver.internalKey,
        },
    }
);

router.use("/", driverProxy);

module.exports = router;