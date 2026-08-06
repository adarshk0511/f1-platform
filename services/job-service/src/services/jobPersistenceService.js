const Job = require("../models/Job");

async function createJob(job) {

    return await Job.create({

        bullJobId: job.id,

        type: "IMPORT_RACE",

        status: "PROCESSING",

        payload: job.data

    });

}

async function markCompleted(dbJob) {

    dbJob.status = "COMPLETED";

    return await dbJob.save();

}

async function markFailed(dbJob, error) {

    dbJob.status = "FAILED";

    dbJob.error = error.message;

    return await dbJob.save();

}

async function findByBullJobId(jobId) {

    return await Job.findOne({

        bullJobId: jobId

    });

}

module.exports = {

    createJob,

    markCompleted,

    markFailed,

    findByBullJobId

};