const { createClient } = require("redis");

const config = require("./index");
const logger = require("./logger");

logger.info(
    `Connecting to Redis at ${config.redis.host}:${config.redis.port}`
);

const redisClient = createClient({
    url: `redis://${config.redis.host}:${config.redis.port}`,
});

redisClient.on("error", (err) => {
    logger.error(err, "Redis Error");
});

module.exports = redisClient;