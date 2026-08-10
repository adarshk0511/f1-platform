const axios = require("axios");

const JOB_SERVICE_URL =
    process.env.JOB_SERVICE_URL;


const importRace = async (payload) => {

    const response = await axios.post(
        `${JOB_SERVICE_URL}/internal/jobs/import`,
        payload
    );

    return response.data;
};


const getJobStatus = async (jobId) => {

    const response = await axios.get(
        `${JOB_SERVICE_URL}/internal/jobs/${jobId}`
    );

    return response.data;
};


module.exports = {

    importRace,

    getJobStatus

};