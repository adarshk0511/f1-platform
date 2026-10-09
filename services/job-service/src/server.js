require("dotenv").config();

const mongoose = require("mongoose");

const connectDB = require("./config/db");
const logger = require("./config/logger");
const app = require("./app");

const {
    initializeQueues,
    closeQueues,
} = require("./config/queue");

const PORT = process.env.PORT || 5001;

let server;
let isShuttingDown = false;

async function startServer() {
    try {
        await connectDB();

        logger.info("MongoDB Connected");

        await initializeQueues();

        server = app.listen(PORT, () => {
            logger.info(
                `Job Service running on ${PORT}`
            );
        });

    } catch (err) {
        logger.error(err, "Failed to start Job Service");
        process.exit(1);
    }
}

async function gracefulShutdown(signal) {
    if (isShuttingDown) {
        logger.warn("Shutdown already in progress");
        return;
    }

    isShuttingDown = true;

    logger.info(
        `${signal} received. Starting graceful shutdown...`
    );

    const shutdownTimeout = setTimeout(() => {
        logger.error(
            "Graceful shutdown timed out. Forcing exit."
        );

        process.exit(1);
    }, 10000);

    try {
        // Stop accepting new HTTP requests
        if (server) {
            await new Promise((resolve, reject) => {
                server.close((err) => {
                    if (err) {
                        reject(err);
                        return;
                    }

                    logger.info("HTTP server closed");
                    resolve();
                });
            });
        }

        // Close BullMQ queues
        await closeQueues();
        logger.info("BullMQ queues closed");

        // Close MongoDB
        if (mongoose.connection.readyState !== 0) {
            await mongoose.connection.close();
            logger.info(
                "MongoDB connection closed"
            );
        }

        clearTimeout(shutdownTimeout);

        logger.info(
            "Job Service graceful shutdown complete"
        );

        process.exit(0);

    } catch (err) {
        clearTimeout(shutdownTimeout);

        logger.error(
            err,
            "Job Service shutdown failed"
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

startServer();