const express = require("express");

const router = express.Router();

const serviceAuth =
    require("../middleware/serviceAuth");

const {
    importDrivers,
} = require("../controllers/internalImportController");

router.post(
    "/import",
    serviceAuth,
    importDrivers
);

module.exports = router;