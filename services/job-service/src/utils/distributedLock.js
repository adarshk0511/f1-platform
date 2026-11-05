const crypto = require("crypto");
const redisClient = require("../config/redis");

const DEFAULT_TTL = 30000;

// Atomically release the lock only if we own it.
const RELEASE_SCRIPT = `
    if redis.call("GET", KEYS[1]) == ARGV[1] then
        return redis.call("DEL", KEYS[1])
    end
    return 0
`;

// Extend the lock only if we still own it.
const EXTEND_SCRIPT = `
    if redis.call("GET", KEYS[1]) == ARGV[1] then
        return redis.call("PEXPIRE", KEYS[1], ARGV[2])
    end
    return 0
`;

async function acquireLock(resource, ttl = DEFAULT_TTL) {
    const lockKey = `locks:${resource}`;
    const token = crypto.randomUUID();

    const result = await redisClient.set(
        lockKey,
        token,
        {
            NX: true,
            PX: ttl,
        }
    );

    if (result !== "OK") {
        return null;
    }

    return {
        lockKey,
        token,
        ttl,
    };
}

async function releaseLock(lock) {
    if (!lock) return false;

    const result = await redisClient.eval(
        RELEASE_SCRIPT,
        {
            keys: [lock.lockKey],
            arguments: [lock.token],
        }
    );

    return result === 1;
}

async function extendLock(lock) {
    if (!lock) return false;

    const result = await redisClient.eval(
        EXTEND_SCRIPT,
        {
            keys: [lock.lockKey],
            arguments: [
                lock.token,
                String(lock.ttl),
            ],
        }
    );

    return result === 1;
}

module.exports = {
    acquireLock,
    releaseLock,
    extendLock,
};