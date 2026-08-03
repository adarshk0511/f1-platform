const mongoose = require("mongoose");

const driverSchema = new mongoose.Schema({
    driverNumber: {
        type: Number,
        required: true,
        unique: true
    },

    fullName: {
        type: String,
        required: true
    },

    abbreviation: {
        type: String,
        required: true
    },

    team: {
        type: String,
        required: true
    },

    nationality: {
        type: String
    },

    championships: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

driverSchema.index({
    team: 1
});

driverSchema.index({
    name: 1
});

driverSchema.index({
    championships: -1
});

driverSchema.index({
    team: 1,
    championships: -1
});

driverSchema.index({
    name: "text"
});

module.exports = mongoose.model(
    "Driver",
    driverSchema
);