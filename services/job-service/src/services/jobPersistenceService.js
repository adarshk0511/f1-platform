const Job = require("../models/Job");

async function createJob(job) {

    return await Job.findOneAndUpdate(

        {
            bullJobId: job.id,
        },

        {
            $set: {
                status: "PROCESSING",
                error: null,
                payload: job.data,
                type: "IMPORT_RACE",
            },

            $setOnInsert: {
                bullJobId: job.id,
            },
        },

        {
            new: true,
            upsert: true,
        }

    );

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

async function getJobStatus(jobId) {

    return await Job.findOne({

        bullJobId: jobId

    });

}

module.exports = {

    createJob,

    markCompleted,

    markFailed,

    findByBullJobId,

    getJobStatus

};