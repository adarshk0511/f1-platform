process.env.NODE_ENV = "test";
process.env.INTERNAL_SERVICE_KEY = "test-service-key";

jest.setTimeout(30000);

const {
    importQueue,
    deadLetterQueue
} = require("../src/config/queue");

afterAll(async () => {
    await Promise.all([
        importQueue.close(),
        deadLetterQueue.close()
    ]);
});