const rateLimit = require("express-rate-limit");

const config = require("../config");

const createRateLimiter = ({
    windowMs,
    limit,
    prefix,
    message,
}) => {

    const options = {
        windowMs,
        limit,

        standardHeaders: true,
        legacyHeaders: false,

        message: {
            success: false,
            message,
        },
    };

    // Use Redis in production.
    if (config.nodeEnv === "production") {

        const { RedisStore } = require("rate-limit-redis");
        const { redisClient } = require("../config/redis");

        options.store = new RedisStore({

            sendCommand: (...args) =>
                redisClient.sendCommand(args),

            prefix,

        });

    }

    return rateLimit(options);
};

const loginLimiter = createRateLimiter({
    windowMs: 15 * 60 * 1000,
    limit: 5,
    prefix: "rl:login:",
    message: "Too many login attempts. Please try again later.",
});

const registerLimiter = createRateLimiter({
    windowMs: 60 * 60 * 1000,
    limit: 5,
    prefix: "rl:register:",
    message: "Too many registration attempts. Please try again later.",
});

const refreshLimiter = createRateLimiter({
    windowMs: 15 * 60 * 1000,
    limit: 10,
    prefix: "rl:refresh:",
    message: "Too many refresh attempts. Please try again later.",
});

module.exports = {
    loginLimiter,
    registerLimiter,
    refreshLimiter,
};