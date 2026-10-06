require("dotenv").config();

const mongoose = require("mongoose");
const connectDB = require("./config/db");
const redisClient = require("./config/redis");
const logger = require("./config/logger");

const app = require("./app");

const PORT = process.env.PORT || 5002;

let server;
let isShuttingDown = false;

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
        logger.error(err, "Failed to start Driver Service");
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

    // Safety timeout
    const shutdownTimeout = setTimeout(() => {
        logger.error("Graceful shutdown timed out. Forcing exit.");
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

        // Close Redis
        if (redisClient.isOpen) {
            await redisClient.quit();
            logger.info("Redis connection closed");
        }

        // Close MongoDB
        if (mongoose.connection.readyState !== 0) {
            await mongoose.connection.close();
            logger.info("MongoDB connection closed");
        }

        clearTimeout(shutdownTimeout);

        logger.info("Graceful shutdown complete");

        process.exit(0);

    } catch (err) {
        clearTimeout(shutdownTimeout);

        logger.error(err, "Error during graceful shutdown");

        process.exit(1);
    }
}

process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
process.on("SIGINT", () => gracefulShutdown("SIGINT"));

startServer();