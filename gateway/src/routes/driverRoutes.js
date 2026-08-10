const express = require("express");

const {
    createProxyMiddleware,
    fixRequestBody,
} = require("http-proxy-middleware");

const config = require("../config");

const router = express.Router();

router.use(
    "/",
    createProxyMiddleware({

        target: config.services.driver.url,

        changeOrigin: true,

        pathRewrite: (path) => {

            return `/api/v1/drivers${path}`;

        },

        on: {

            proxyReq: (proxyReq, req, res) => {

                console.log(
                    `[Gateway] ${req.method} ${req.originalUrl} -> Driver Service`
                );

                // Re-attach JSON body after express.json()
                fixRequestBody(
                    proxyReq,
                    req
                );

            },

            error: (err) => {

                console.error(
                    "[Gateway] Driver Service error:",
                    err.message
                );

            },

        },

    })
);

module.exports = router;