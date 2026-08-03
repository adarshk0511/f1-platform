const { createClient } = require("redis");

const config = require("./index");

const redisClient = createClient({
    url: `redis://${config.redis.host}:${config.redis.port}`,
});

redisClient.on("error", (err) => {
    console.error("Redis Error", err);
});

module.exports = redisClient;