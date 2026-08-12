const config = {
    port: Number(process.env.PORT) || 8080,

    services: {
        driver: {
            url:
                process.env.DRIVER_SERVICE_URL ||
                "http://localhost:5002",
        },

        auth: {
            url:
                process.env.AUTH_SERVICE_URL ||
                "http://localhost:5001",
        },

        job: {
            url:
                process.env.JOB_SERVICE_URL ||
                "http://localhost:5003",

            internalKey:
        process.env.JOB_SERVICE_INTERNAL_KEY,
        },
    },
};

module.exports = config;