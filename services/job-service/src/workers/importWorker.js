const { Worker } = require("bullmq");
const logger = require("../config/logger");
const config = require("../config/index");
const {
    processImport
}=require("../processors/importProcessor");

logger.info(`Connecting to Redis at ${config.redis.host}:${config.redis.port}`);
const worker = new Worker(
    "import-race",
    async (job) => {

        logger.info({
            jobId: job.id,
            payload: job.data
        });
        await processImport(job);

    },
    {
        connection: {
            host: config.redis.host,
            port: config.redis.port
        }
    }
);

worker.on("ready", () => {

    logger.info(
        "Import Worker Ready"
    );

});

worker.on("completed", job => {

    logger.info({
        jobId: job.id
    }, "Job Completed");

});

worker.on("failed", (job, err) => {

    logger.error(err);

});