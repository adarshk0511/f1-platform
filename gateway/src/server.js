require("dotenv").config();

const app = require("./app");

const config =
    require("./config");

const server = app.listen(
    config.port,
    () => {

        console.log(
            `API Gateway running on port ${config.port}`
        );

    }
);

function gracefulShutdown(signal) {

    console.log(
        `${signal} received. Shutting down API Gateway...`
    );

    server.close(() => {

        console.log(
            "API Gateway stopped accepting new connections"
        );

        process.exit(0);

    });

    setTimeout(() => {

        console.error(
            "Forced shutdown after timeout"
        );

        process.exit(1);

    }, 10000);
}

process.on(
    "SIGTERM",
    () => gracefulShutdown("SIGTERM")
);

process.on(
    "SIGINT",
    () => gracefulShutdown("SIGINT")
);