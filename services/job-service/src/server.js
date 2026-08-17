require("dotenv").config();

const connectDB = require("./config/db");
const redisClient = require("./config/redis");
const logger = require("./config/logger");
const app = require("./app");

const PORT = process.env.PORT || 5003;
// Change in DB URL to connect to the correct database for the job-service

async function startServer() {
    try {
        await connectDB();
        logger.info("MongoDB Connected");

        await redisClient.connect();
        logger.info("Redis Connected");

        app.listen(PORT, () => {
            logger.info(`Job Service running on ${PORT}`);
        });

    } catch (err) {
        logger.error(err);
        process.exit(1);
    }
}

startServer();