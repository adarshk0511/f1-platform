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

async function gracefulShutdown(signal) {

    logger.info(
        `${signal} received. Shutting down worker...`
    );

    try {

        if (worker) {

            await worker.close();

            logger.info(
                "BullMQ worker closed"
            );

        }

        const mongoose =
            require("mongoose");

        await mongoose.connection.close();

        logger.info(
            "MongoDB connection closed"
        );

        logger.info(
            "Worker graceful shutdown complete"
        );

        process.exit(0);

    } catch (err) {

        logger.error(
            err,
            "Worker shutdown failed"
        );

        process.exit(1);

    }

}

process.on(
    "SIGTERM",
    () => gracefulShutdown("SIGTERM")
);

process.on(
    "SIGINT",
    () => gracefulShutdown("SIGINT")
);