const jobClient = require("../clients/jobClient");

const importRace = async (payload) => {

    const result =
        await jobClient.importRace(payload);

    return result;
};

module.exports = {
    importRace
};