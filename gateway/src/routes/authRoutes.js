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

        target: config.services.auth.url,

        changeOrigin: true,

        timeout: 11000,

        proxyTimeout: 10000,

        pathRewrite: (path) => {

            return `/api/v1/auth${path}`;

        },

        on: {

            proxyReq: (proxyReq, req, res) => {

                console.log(
                    `[Gateway] ${req.method} ${req.originalUrl} -> Auth Service`
                );

                fixRequestBody(
                    proxyReq,
                    req
                );

            },

            proxyRes: (proxyRes) => {

                console.log(
                    `[Gateway] Auth responded ${proxyRes.statusCode}`
                );

            },

            error: (err, req, res) => {

                console.error(
                    `[Gateway] Auth Service error: ${err.message}`
                );

                if (!res.headersSent) {

                    res.status(503).json({

                        success: false,

                        message:
                            "Auth Service unavailable",

                    });

                }

            },

        },

    })
);

module.exports = router;