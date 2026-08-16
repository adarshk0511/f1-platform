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
//const apiKey = require("../middleware/apiKey");

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
router.get("/", authenticate, cacheMiddleware("drivers"), getDrivers1);
router.post("/", validateDriver, createDriver);

router.get("/search/:keyword", authenticate, searchDrivers);

router.get(
    "/grid",
    authenticate,
    getDriverGrid
);

router.get(
    "/stats",
    authenticate,
    getDriverStats
);

router.get(
    "/team-stats",
    authenticate,
    getTeamStats
);
router.get(
    "/stats/team",
    authenticate,
    getDriversByTeamStats
);

router.post(
    "/import-race",
    authenticate,
    importRace
);

router.get(
    "/jobs/:jobId",
    authenticate,
    getJobStatus
);

router.get("/:abbr",authenticate, getDriverByAbbreviation);
router.put("/:abbr", authenticate,  updateDriver);
router.delete("/:abbr", authenticate, deleteDriver);

router.get("/:team", authenticate, getDriversByTeam);



module.exports = router;
