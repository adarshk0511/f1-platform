const axios = require("axios");

const JOB_SERVICE_URL =
    process.env.JOB_SERVICE_URL;

const JOB_SERVICE_INTERNAL_KEY =
    process.env.INTERNAL_SERVICE_KEY;

    console.log(
    "Job Service URL:",
    JOB_SERVICE_URL
);



console.log(
    "Job Service key loaded:",
    Boolean(JOB_SERVICE_INTERNAL_KEY),
    JOB_SERVICE_INTERNAL_KEY
);


const importRace = async (payload) => {

    const response =
        await axios.post(

            `${JOB_SERVICE_URL}/internal/jobs/import`,

            payload,

            {
                headers: {

                    "X-Service-Key":
                        JOB_SERVICE_INTERNAL_KEY,

                },
            }

        );

    return response.data;
};


const getJobStatus = async (jobId) => {

    const response =
        await axios.get(

            `${JOB_SERVICE_URL}/internal/jobs/${jobId}`,

            {
                headers: {

                    "X-Service-Key":
                        JOB_SERVICE_INTERNAL_KEY,

                },
            }

        );

    return response.data;
};


module.exports = {

    importRace,

    getJobStatus,

};