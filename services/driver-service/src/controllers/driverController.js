const Driver = require("../models/Driver");
const driverService = require("../services/driverService");
const redisClient =
    require("../config/redis");
const AppError =
require("../utils/AppError");
const cacheService =
    require("../services/cacheService");
const generateCacheKey =
    require("../utils/cacheKey");
const logger = require("../config/logger");

const createDriver = async (req, res, next) => {
  try {
    const driver = await driverService.createDriver(req.body);

    await cacheService.delByPattern(
    "drivers*"
);

    res.status(201).json(driver);
  } catch (error) {
    next(error);
  }
};

const getDrivers = async (req, res, next) => {
  try {
    const team = req.query.team;

    const page = Number(req.query.page) || 1;

    const limit = Number(req.query.limit) || 5;

    const sortField = req.query.sort || "driverNumber";

    const sortOrder = req.query.order || "asc";

    const result = await driverService.getAllDrivers(
      team,
      page,
      limit,
      sortField,
      sortOrder,
    );

    res.json(result);
  } catch (error) {
    next(error);
  }
};

const getDriverByAbbreviation = async (req, res, next) => {
  try {
    const driver = await driverService.getDriverByAbbreviation(req.params.abbr);

    if (!driver) {
       throw new AppError(
        "Driver not found",
        404
    );
    }

    res.json(driver);
  } catch (error) {
    next(error);
  }
};

const getDriversByTeam = async (req, res, next) => {
  try {
    const drivers = await Driver.find({
      team: req.params.team,
    });

    res.json(drivers);
  } catch (error) {
    next(error);
  }
};

const searchDrivers = async (
    req,
    res,
    next
) => {

    try {

        const keyword =
            req.params.keyword;

        const drivers =
            await driverService.searchDrivers(
                keyword
            );

        res.json(drivers);

    } catch (error) {

        next(error);

    }

};

const updateDriver = async (
    req,
    res,
    next
) => {

    try {

        const updatedDriver =
            await driverService.updateDriver(
                req.params.abbr,
                req.body
            );

        if (!updatedDriver) {

            return res.status(404).json({
                message: "Driver not found"
            });

        }

        await cacheService.delByPattern(
    "drivers*"
);

        res.json(updatedDriver);

    } catch (error) {

        next(error);

    }

};

const deleteDriver = async (
    req,
    res,
    next
) => {

    try {

        const deletedDriver =
            await driverService.deleteDriver(
                req.params.abbr
            );

        if (!deletedDriver) {

            return res.status(404).json({
                message: "Driver not found"
            });

        }

        await cacheService.delByPattern(
    "drivers*"
);

        res.json({
            success: true,
            message: "Driver deleted"
        });

    } catch (error) {

        next(error);

    }

};

const getDrivers1 = async (
    req,
    res,
    next
) => {

    const CACHE_KEY =
    generateCacheKey(
        "drivers",
        req.query
    );

//     logger.info({
//     cacheKey: CACHE_KEY
// }, "Generated Cache Key");

//     const cachedDrivers =
//     await cacheService.get(
//         CACHE_KEY
//     );

//     if (cachedDrivers) {

//     return res.status(200).json({

//             success: true,

//             source: "redis",

//             data: JSON.parse(cachedDrivers),

//         });

//     }
    try {

        const {
            team,
            search,
            sort,
            order
        } = req.query;

        const page =
            Number(req.query.page) || 1;

        const limit =
            Number(req.query.limit) || 5;

        const result =
            await driverService.getAllDrivers1(
                team,
                search,
                page,
                limit,
                sort,
                order
            );

        await cacheService.set(
            CACHE_KEY, JSON.stringify(result), 60
        );

        res.json(result);

    } catch (error) {

        next(error);

    }

};

const getDriverGrid = async (
    req,
    res,
    next
) => {

    try {

        const drivers =
            await driverService.getDriverGrid();

        res.json(drivers);

    } catch (error) {

        next(error);

    }

};

const getDriverStats = async (
    req,
    res,
    next
) => {

    try {

        console.log("Checking Redis...");
        
        const cachedData =
            await redisClient.get(
                "driverStats"
            );

        if (cachedData) {

            console.log(
                "CACHE HIT"
            );

            return res.json(
                JSON.parse(
                    cachedData
                )
            );

        }

        console.log(
            "CACHE MISS"
        );

        const stats =
            await driverService.getDriverStats();

        await redisClient.set(
            "driverStats",
            JSON.stringify(stats),
            {
                EX: 60
            }
        );

        res.json(stats);

    } catch (error) {

        next(error);

    }

};

const getTeamStats = async (
    req,
    res,
    next
) => {

    try {

        const stats =
            await driverService.getTeamStats();

        res.json(stats);

    } catch (error) {

        next(error);

    }

};

const getDriversByTeamStats = async (req, res, next) => {
    try {

        const stats = await Driver.aggregate([
            {
                $group: {
                    _id: "$team",
                    totalDrivers: {
                        $sum: 1
                    }
                }
            },
            {
                $project: {
                    _id: 0,
                    team: "$_id",
                    totalDrivers: 1
                }
            },
            {
                $sort: {
                    totalDrivers: -1
                }
            }
        ]);

        res.json({
            success: true,
            data: stats
        });

    } catch (err) {
        next(err);
    }
};

const getDriversV2 = async (req, res, next) => {

    try {

        const drivers =
            await driverService.getAllDrivers1(req.query);

        const response =
            drivers.map(driver => ({

                driverId: driver._id,

                fullName: driver.name,

                team: driver.team,

                championships:
                    driver.championships

            }));

        res.json({

            success: true,

            data: response

        });

    }

    catch(err){

        next(err);

    }

};

module.exports = {
  createDriver,
  getDrivers,
  getDriverByAbbreviation,
  updateDriver,
  getDriversByTeam,
  searchDrivers,
  deleteDriver,
  getDrivers1,
  getDriverGrid,
  getDriverStats,
  getTeamStats,
  getDriversByTeamStats,
  getDriversV2
};
