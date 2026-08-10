const express = require("express");

const {
    createProxyMiddleware,
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

            proxyReq: (proxyReq, req) => {

                console.log(
                    `[Gateway] ${req.method} ${req.originalUrl} -> Driver Service`
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