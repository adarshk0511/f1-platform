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

        target: config.services.job.url,

        changeOrigin: true,

        timeout: 10000,

        proxyTimeout: 10000,

        pathRewrite: (path) => {

            return `/internal/jobs${path}`;

        },

        on: {

            proxyReq: (proxyReq, req, res) => {

                console.log(
                    `[Gateway] ${req.method} ${req.originalUrl} -> Job Service`
                );


    proxyReq.setHeader(
        "X-Service-Key",
        config.services.job.internalKey
    );

                fixRequestBody(
                    proxyReq,
                    req
                );

            },

            proxyRes: (proxyRes) => {

                console.log(
                    `[Gateway] Job responded ${proxyRes.statusCode}`
                );

            },

            error: (err, req, res) => {

                console.error(
                    `[Gateway] Job Service error: ${err.message}`
                );

                if (!res.headersSent) {

                    res.status(503).json({

                        success: false,

                        message:
                            "Job Service unavailable",

                    });

                }

            },

        },

    })
);

module.exports = router;