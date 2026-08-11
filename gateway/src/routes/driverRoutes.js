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

        timeout: 10000,

        proxyTimeout: 10000,

        pathRewrite: (path) => {

            return `/api/v1/drivers${path}`;

        },

        on: {

            proxyReq: (proxyReq, req, res) => {

                console.log(
                    `[Gateway] ${req.method} ${req.originalUrl} -> Driver Service`
                );

                fixRequestBody(
                    proxyReq,
                    req
                );

            },

            proxyRes: (proxyRes, req) => {

                console.log(
                    `[Gateway] Driver responded ${proxyRes.statusCode}`
                );

            },

            error: (err, req, res) => {

                console.error(
                    `[Gateway] Driver Service error: ${err.message}`
                );

                if (!res.headersSent) {

                    res.status(503).json({

                        success: false,

                        message:
                            "Driver Service unavailable",

                    });

                }

            },

        },

    })
);

module.exports = router;