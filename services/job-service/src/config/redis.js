const { createClient } = require("redis");
const config = require("./index");
const logger = require("./logger");

const redisClient = createClient({
    url: `redis://${config.redis.host}:${config.redis.port}`,
});

redisClient.on("error", (err) => {
    logger.error(err, "Redis Client Error");
});

redisClient.on("ready", () => {
    logger.info("Redis client ready");
});

module.exports = redisClient;