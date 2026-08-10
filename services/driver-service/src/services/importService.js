const jobClient =
    require("../clients/jobClient");


const importRace = async (payload) => {

    return await jobClient.importRace(
        payload
    );

};


const getJobStatus = async (jobId) => {

    return await jobClient.getJobStatus(
        jobId
    );

};


module.exports = {

    importRace,

    getJobStatus

};