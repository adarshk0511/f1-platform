require("dotenv").config();

const connectDB = require("./config/db");

const logger = require("./config/logger");

const app = require("./app");

const PORT = process.env.PORT || 5001;
// Change in DB URL to connect to the correct database for the auth-service
async function startServer() {

    try {

        await connectDB();

        logger.info("MongoDB Connected");

        app.listen(PORT, () => {

            logger.info(
                `Auth Service running on ${PORT}`
            );

        });

    }

    catch(err){

        logger.error(err);

        process.exit(1);

    }

}

startServer();