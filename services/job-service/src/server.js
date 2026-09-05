require("dotenv").config();

const mongoose = require("mongoose");

const connectDB = require("./config/db");
const logger = require("./config/logger");
const app = require("./app");
const {
    initializeQueues
} = require("./config/queue");

const PORT = process.env.PORT || 5001;

let server;

async function startServer() {

    try {

        await connectDB();

        logger.info("MongoDB Connected");

        await initializeQueues();
        
        server = app.listen(PORT, () => {

            logger.info(
                `Auth Service running on ${PORT}`
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