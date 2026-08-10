const express = require("express");
const router = express.Router();
const authenticate =
    require("../middleware/authMiddleware");
const cacheMiddleware = require("../middleware/cacheMiddleware");
const {
  createDriver,
  getDrivers,
  getDriverByAbbreviation,
  searchDrivers,
  getDriversByTeam,
  updateDriver,
  deleteDriver,
  getDrivers1,
  getDriverGrid,
  getDriverStats,
  getTeamStats,
  getDriversByTeamStats
} = require("../controllers/driverController");
const {
    getJobStatus
} = require("../controllers/jobController");

const {
    importRace
} = require("../controllers/importController");

const validateDriver = require("../middleware/validateDriver");
const apiKey = require("../middleware/apiKey");

/**
 * @swagger
 * /api/drivers:
 *   get:
 *     summary: Get all Formula 1 drivers
 *     description: Returns all drivers stored in MongoDB.
 *     tags:
 *       - Drivers
 *     responses:
 *       200:
 *         description: Drivers retrieved successfully.
 *       500:
 *         description: Internal Server Error.
 */
router.get("/", apiKey, authenticate, cacheMiddleware("drivers"), getDrivers1);
router.post("/", validateDriver, createDriver);

router.get("/search/:keyword", searchDrivers);

router.get(
    "/grid",
    getDriverGrid
);

router.get(
    "/stats",
    getDriverStats
);

router.get(
    "/team-stats",
    getTeamStats
);
router.get(
    "/stats/team",
    authenticate,
    getDriversByTeamStats
);

router.post(
    "/import-race",
    apiKey,
    authenticate,
    importRace
);

router.get(
    "/jobs/:jobId",
    apiKey,
    authenticate,
    getJobStatus
);

router.get("/:abbr", getDriverByAbbreviation);
router.put("/:abbr",  updateDriver);
router.delete("/:abbr", deleteDriver);

router.get("/:team", getDriversByTeam);



module.exports = router;
