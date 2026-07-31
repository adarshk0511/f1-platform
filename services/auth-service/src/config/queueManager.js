const { Queue } = require("bullmq");

let importQueue = null;
let deadLetterQueue = null;

function initializeQueues() {

    const connection = {
        host: "redis",
        port: 6379,
    };

    importQueue = new Queue(
        "import-race",
        { connection }
    );

    deadLetterQueue = new Queue(
        "dead-letter-queue",
        { connection }
    );
}

function getImportQueue() {

    if (process.env.NODE_ENV === "test") {

        return {

            add: async () => {},

            getWaitingCount: async () => 0,

        };

    }

    if (!importQueue) {

        throw new Error(
            "Import Queue has not been initialized."
        );

    }

    return importQueue;

}

function getDeadLetterQueue() {

    if (process.env.NODE_ENV === "test") {

        return {

            add: async () => {},

            getJobs: async () => [],

        };

    }

    if (!deadLetterQueue) {

        throw new Error(
            "Dead Letter Queue has not been initialized."
        );

    }

    return deadLetterQueue;

}

module.exports = {

    initializeQueues,

    getImportQueue,

    getDeadLetterQueue,

};