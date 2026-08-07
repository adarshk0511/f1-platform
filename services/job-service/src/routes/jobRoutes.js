const express = require("express");

const router = express.Router();

const {
    importRace,
    getJobStatus,
} = require("../controllers/jobController");

router.post(
    "/import",
    importRace
);

router.get(
    "/:jobId",
    getJobStatus
);

module.exports = router;