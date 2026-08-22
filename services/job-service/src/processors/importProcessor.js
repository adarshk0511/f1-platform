const jobPersistenceService =
require("../services/jobPersistenceService");
const logger = require("../config/logger");
const driverClient =
    require("../clients/driverClient");

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

        if(job.data.raceName==="FAIL"){

    throw new Error(

        "Simulated Failure"

    );

}

        await driverClient.importDrivers(
    job.data
);

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