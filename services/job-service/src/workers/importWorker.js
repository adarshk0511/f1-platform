require("dotenv").config();

const { Worker } = require("bullmq");
const mongoose = require("mongoose");

const connectDB = require("../config/db");
const logger = require("../config/logger");
const config = require("../config");

const {
    processImport,
} = require("../processors/importProcessor");

let worker;
let isShuttingDown = false;

async function startWorker() {
    try {
        // Connect MongoDB
        await connectDB();

        logger.info("Mongo Connected");

        // Create BullMQ Worker
        worker = new Worker(
            "import-race",

            async (job) => {
                logger.info(
                    {
                        jobId: job.id,
                        payload: job.data,
                    },
                    "Processing import job"
                );

                await processImport(job);
            },

            {
                connection: {
                    host: config.redis.host,
                    port: config.redis.port,
                },
            }
        );

        worker.on("ready", () => {
            logger.info("Import Worker Ready");
        });

        worker.on("completed", (job) => {
            logger.info(
                {
                    jobId: job.id,
                },
                "Job Completed"
            );
        });

        worker.on("failed", (job, err) => {
            logger.error(
                {
                    jobId: job?.id,
                    attempt: job?.attemptsMade,
                    maxAttempts: job?.opts?.attempts,
                },
                err.message
            );
        });

        worker.on("error", (err) => {
            logger.error(
                err,
                "BullMQ worker error"
            );
        });

    } catch (err) {
        logger.error(
            err,
            "Failed to start import worker"
        );

        process.exit(1);
    }
}

async function gracefulShutdown(signal) {
    if (isShuttingDown) {
        logger.warn("Worker shutdown already in progress");
        return;
    }

    isShuttingDown = true;

    logger.info(
        `${signal} received. Starting worker graceful shutdown...`
    );

    const shutdownTimeout = setTimeout(() => {
        logger.error(
            "Worker graceful shutdown timed out. Forcing exit."
        );

        process.exit(1);
    }, 30000);

    try {
        // Stop accepting new jobs and wait for active work
        if (worker) {
            await worker.close();

            logger.info(
                "BullMQ worker closed"
            );
        }

        // Close MongoDB
        if (mongoose.connection.readyState !== 0) {
            await mongoose.connection.close();

            logger.info(
                "MongoDB connection closed"
            );
        }

        clearTimeout(shutdownTimeout);

        logger.info(
            "Worker graceful shutdown complete"
        );

        process.exit(0);

    } catch (err) {
        clearTimeout(shutdownTimeout);

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

startWorker();