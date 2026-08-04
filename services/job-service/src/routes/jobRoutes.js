const express = require("express");

const router = express.Router();

const {
    importRace
} = require("../controllers/jobController");

router.post(
    "/import",
    importRace
);

module.exports = router;