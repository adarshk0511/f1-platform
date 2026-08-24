require("dotenv").config();

const { Worker } = require("bullmq");

const connectDB = require("../config/db");

const logger = require("../config/logger");

const config = require("../config");

const {
    processImport,
} = require("../processors/importProcessor");

let worker;

async function startWorker() {

    try {

        // 1. Connect Mongo
        await connectDB();

        logger.info("Mongo Connected");

        // 2. Create Worker
        worker = new Worker(

            "import-race",

            async (job) => {

                logger.info({

                    jobId: job.id,

                    payload: job.data,

                });

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

        worker.on(

    "failed",

    (job, err)=>{

        logger.error({

            jobId:job.id,

            attempt:job.attemptsMade,

            maxAttempts:

                job.opts.attempts

        },err.message);

    }

);

    } catch (err) {

        logger.error(err);

        process.exit(1);

    }

}

startWorker();

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