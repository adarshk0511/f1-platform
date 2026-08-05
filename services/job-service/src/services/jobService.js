const importQueue = require("../config/queue").importQueue;
const importRace = async (
    payload
) => {

    const job =
    await importQueue.add(
        "import-race",
        payload
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