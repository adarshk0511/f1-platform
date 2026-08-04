const config = {

    nodeEnv: process.env.NODE_ENV || "development",

    port: Number(process.env.PORT) || 5000,

    mongoUri: process.env.MONGO_URI,

    jwtSecret: process.env.JWT_SECRET,

    jwtExpiresIn: process.env.JWT_EXPIRES_IN,

    refreshSecret: process.env.REFRESH_TOKEN_SECRET,

    refreshExpiresIn:
        process.env.REFRESH_TOKEN_EXPIRES_IN,

    redis: {

        host: process.env.REDIS_HOST,

        port: Number(process.env.REDIS_PORT)

    },

    instanceName:
    process.env.INSTANCE_NAME || "local"

};

module.exports = config;