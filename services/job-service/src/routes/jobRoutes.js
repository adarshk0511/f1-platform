const express = require("express");

const router = express.Router();

const authenticateService =
    require("../middleware/serviceAuth");
    
const {
    importRace,
    getJobStatus,
} = require("../controllers/jobController");

router.post(
    "/import",
    authenticateService,
    importRace
);

router.get(
    "/:jobId",
    getJobStatus
);

module.exports = router;