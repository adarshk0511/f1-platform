const redisClient =
    require("../config/redis");
const logger = require("../config/logger");

const DEFAULT_EXPIRY = 60;

const get = async (key) => {

    return await redisClient.get(key);

};

const set = async (

    key,

    value,

    expiry = DEFAULT_EXPIRY

) => {

    await redisClient.set(

        key,

        value,

        {

            EX: expiry,

        }

    );

};

const del = async (key) => {

    await redisClient.del(key);

};

const delByPattern = async (pattern) => {

    const keys = await redisClient.keys(pattern);

    if (keys.length === 0) {
        return;
    }

    logger.info(

    {

        pattern,

        deletedKeys: keys,

    },

    "Invalidating Cache"

);

    await redisClient.del(keys);

};

module.exports = {
    get,
    set,
    del,
    delByPattern
};