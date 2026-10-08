const { Queue } = require("bullmq");
const config = require("./index");

const connection = {
    host: config.redis.host,
    port: config.redis.port,
};

const importQueue = new Queue("import-race", {
    connection,
});

const deadLetterQueue = new Queue("dead-letter-queue", {
    connection,
});

async function initializeQueues() {
    await importQueue.waitUntilReady();
    await deadLetterQueue.waitUntilReady();

    console.log("BullMQ queues ready");
}

async function closeQueues() {
    await Promise.all([
        importQueue.close(),
        deadLetterQueue.close(),
    ]);

    console.log("BullMQ queues closed");
}

module.exports = {
    importQueue,
    deadLetterQueue,
    initializeQueues,
    closeQueues,
};