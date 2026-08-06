require("dotenv").config();

const { Worker } = require("bullmq");

const connectDB = require("../config/db");

const logger = require("../config/logger");

const config = require("../config");

const {
    processImport,
} = require("../processors/importProcessor");

async function startWorker() {

    try {

        // 1. Connect Mongo
        await connectDB();

        logger.info("Mongo Connected");

        // 2. Create Worker
        const worker = new Worker(

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

        worker.on("failed", (job, err) => {

            logger.error(err);

        });

    } catch (err) {

        logger.error(err);

        process.exit(1);

    }

}

startWorker();