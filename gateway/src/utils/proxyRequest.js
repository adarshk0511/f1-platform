const axios = require("axios");
const createCircuitBreaker = require("./circuitBreaker");

const createProxyRequest = (serviceName, targetUrl, options = {}) => {
    const client = axios.create({
        baseURL: targetUrl,
        timeout: 9000,
        maxRedirects: 0,
        validateStatus: () => true,
    });

    const request = async (requestData) => {
        const response = await client.request(requestData);

        if (response.status >= 500) {
            const error = new Error(
                `${serviceName} returned HTTP ${response.status}`
            );
            error.status = response.status;
            throw error;
        }

        return response;
    };

    const breaker = createCircuitBreaker(request, serviceName);

    return async (req, res) => {
        try {
            const path = req.originalUrl;

            const headers = {
                authorization: req.headers.authorization,
                ...options.headers,
            };

            const response = await breaker.fire({
                method: req.method,
                url: path,
                headers,
                data: req.body,
                responseType: "arraybuffer",
            });

            // Preserve relevant downstream response headers.
            for (const header of [
                "content-type",
                "set-cookie",
                "cache-control",
                "etag",
            ]) {
                if (response.headers[header] !== undefined) {
                    res.setHeader(header, response.headers[header]);
                }
            }

            res.status(response.status).send(response.data);

        } catch (error) {
            console.error(
                `[Gateway] ${serviceName}: ${error.message}`
            );

            if (!res.headersSent) {
                res.status(503).json({
                    success: false,
                    message: `${serviceName} temporarily unavailable`,
                });
            }
        }
    };
};

module.exports = createProxyRequest;