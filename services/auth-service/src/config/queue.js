const { Queue } = require("bullmq");

const connection = {
    host: "redis",
    port: 6379,
};

const importQueue = new Queue(
    "import-race",
    { connection }
);

const deadLetterQueue = new Queue(
    "dead-letter-queue",
    { connection }
);

module.exports = {
    importQueue,
    deadLetterQueue,
};