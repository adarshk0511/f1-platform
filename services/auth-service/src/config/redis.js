const { createClient } = require("redis");

const config = require("./index");
const logger = require("./logger");

const redisClient = createClient({
    url: `redis://${config.redis.host}:${config.redis.port}`,
});

redisClient.on("connect", () => {
    logger.info("Redis connection established");
});

redisClient.on("ready", () => {
    logger.info("Redis client ready");
});

redisClient.on("error", (err) => {
    logger.error(err, "Redis Error");
});

redisClient.on("reconnecting", () => {
    logger.warn("Redis reconnecting...");
});

const connectRedis = async () => {
    if (!redisClient.isOpen) {
        await redisClient.connect();
    }
};

module.exports = {
    redisClient,
    connectRedis,
};