const mongoose = require("mongoose");
const logger = require("./logger");

const connectDB = async () => {

    try {

        logger.info(`Connecting to MongoDB with ${process.env.MONGO_URI}...`);
        await mongoose.connect(process.env.MONGO_URI);

        logger.info("MongoDB Connected");

    } catch (err) {

        logger.error(err);

        process.exit(1);

    }

};

module.exports = connectDB;