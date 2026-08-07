const importQueue = require("../config/queue").importQueue;
const importRace = async (
    payload
) => {

    const job =
await importQueue.add(

    "import-race",

    payload,

    {

        attempts: 3,

        backoff: {

            type: "exponential",

            delay: 2000

        },

        removeOnComplete: false,

        removeOnFail: false

    }

);
    return {

        success: true,

        message:
            "Job Service reached",
        
        jobId: job.id,

        payload

    };

};

module.exports = {

    importRace

};