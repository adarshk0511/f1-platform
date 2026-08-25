require("dotenv").config();

const connectDB = require("./config/db");
const redisClient = require("./config/redis");
const logger = require("./config/logger");

const app = require("./app");

const PORT = process.env.PORT || 5002;

let server;

async function startServer() {

    try {

        await connectDB();

        logger.info("MongoDB Connected");

        await redisClient.connect();

        logger.info("Redis Connected");

        server = app.listen(PORT, () => {

            logger.info(
    `Driver Service running on ${PORT} - ${require("os").hostname()}`
);

        });

    } catch (err) {

        logger.error(err);

        process.exit(1);

    }

}

async function gracefulShutdown(signal) {

    logger.info(
        `${signal} received. Starting graceful shutdown...`
    );

    if (server) {

        server.close(async () => {

            logger.info(
                "HTTP server closed"
            );

            try {

                if (redisClient.isOpen) {

                    await redisClient.quit();

                    logger.info(
                        "Redis connection closed"
                    );

                }

                const mongoose =
                    require("mongoose");

                await mongoose.connection.close();

                logger.info(
                    "MongoDB connection closed"
                );

                logger.info(
                    "Graceful shutdown complete"
                );

                process.exit(0);

            } catch (err) {

                logger.error(
                    err,
                    "Error during shutdown"
                );

                process.exit(1);

            }

        });

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

startServer();