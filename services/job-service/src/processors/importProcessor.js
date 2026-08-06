const jobPersistenceService =
require("../services/jobPersistenceService");
const logger = require("../config/logger");

const sleep = (ms) =>
    new Promise((resolve) =>
        setTimeout(resolve, ms)
    );

async function processImport(job) {

    const dbJob =
        await jobPersistenceService.createJob(job);

    try {

        logger.info(
            `Processing Job ${job.id}`
        );

        await sleep(5000);

        await jobPersistenceService.markCompleted(dbJob);

    } catch (err) {

        await jobPersistenceService.markFailed(
            dbJob,
            err
        );

        throw err;

    }

}

module.exports = {
    processImport,
};