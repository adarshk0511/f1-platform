const Job = require("../models/Job");
const logger = require("../config/logger");

const sleep = (ms) =>
    new Promise((resolve) =>
        setTimeout(resolve, ms)
    );

async function processImport(job) {

    logger.info(
        `Processing Job ${job.id}`
    );

    // Create DB entry
    try{
        const dbJob = await Job.create({

        bullJobId: job.id,

        type: "IMPORT_RACE",

        status: "PROCESSING",

        payload: job.data,

    });
    }
    catch(err){
        logger.error(
            `Error creating job in DB for Job ${job.id}: ${err.message}`
        );
        throw err;
    }
    

    logger.info(
        `Mongo Job Created : ${dbJob._id}`
    );

    // Simulate processing
    await sleep(5000);

    dbJob.status = "COMPLETED";

    await dbJob.save();

    logger.info(
        `Job ${job.id} Completed`
    );
}

module.exports = {
    processImport,
};