const client = require("prom-client");

client.collectDefaultMetrics();

const raceImportCounter =
    new client.Counter({
        name:
            "race_import_requests_total",
        help:
            "Total number of race import requests"
    });

// const jobsProcessedCounter =
//     new client.Counter({
//         name:
//             "jobs_processed_total",
//         help:
//             "Total number of completed jobs"
//     });

module.exports = {
    client,
    raceImportCounter,
};