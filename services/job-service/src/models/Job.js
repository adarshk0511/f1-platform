const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema(
    {
        bullJobId: {
            type: String,
            required: true,
            unique: true,
        },

        type: {
            type: String,
            required: true,
        },

        status: {
            type: String,
            enum: [
                "QUEUED",
                "PROCESSING",
                "COMPLETED",
                "FAILED",
            ],
            default: "QUEUED",
        },

        payload: {
            type: Object,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model(
    "Job",
    jobSchema
);