const jobService =
    require("../services/jobService");
const jobPersistenceService =
    require("../services/jobPersistenceService");

const importRace = async (
    req,
    res,
    next
) => {

    try {

        const result =
            await jobService.importRace(
                req.body
            );

        res.status(200).json(result);

    } catch (err) {

        next(err);

    }

};

const getJobStatus = async (
    req,
    res,
    next
) => {

    try {

        const job =
            await jobPersistenceService.getJobStatus(
                req.params.jobId
            );

        if (!job) {

            return res.status(404).json({

                success: false,

                message: "Job not found"

            });

        }

        res.json({

            success: true,

            data: {

                jobId: job.bullJobId,

                status: job.status,

                createdAt: job.createdAt,

                updatedAt: job.updatedAt

            }

        });

    }

    catch(err){

        next(err);

    }

};

module.exports = {

    importRace,
    getJobStatus

};