const axios = require("axios");

const JOB_SERVICE_URL =
    process.env.JOB_SERVICE_URL;

async function importRace(payload) {

    const response = await axios.post(

        `${JOB_SERVICE_URL}/internal/jobs/import`,

        payload

    );

    return response.data;

}

module.exports = {

    importRace

};