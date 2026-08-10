const importService =
    require("../services/importService");


const getJobStatus = async (
    req,
    res,
    next
) => {

    try {

        const jobId =
            req.params.jobId;

        const result =
            await importService.getJobStatus(
                jobId
            );

        res.status(200).json(result);

    } catch (error) {

        next(error);

    }

};


module.exports = {

    getJobStatus

};