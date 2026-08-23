const axios = require("axios");
const Driver = require("../models/Driver");

const F1_API_URL =
    process.env.F1_API_URL ||
    "https://api.jolpi.ca/ergast/f1";

const importDrivers = async (season = 2026) => {

    const url =
        `${F1_API_URL}/${season}/drivers/?limit=100`;

    const response =
        await axios.get(url);

    const drivers =
        response.data?.MRData?.DriverTable?.Drivers || [];

    const validDrivers =
        drivers.filter(
            driver =>
                driver.permanentNumber &&
                driver.code
        );

    const operations =
        validDrivers.map(driver => ({

            updateOne: {

                filter: {
                    driverNumber:
                        Number(
                            driver.permanentNumber
                        )
                },

                update: {

                    $set: {

                        fullName:
                            `${driver.givenName} ${driver.familyName}`,

                        abbreviation:
                            driver.code,

                        nationality:
                            driver.nationality,

                    }

                },

                upsert: true

            }

        }));

    if (operations.length === 0) {

        return {
            imported: 0,
            message:
                "No valid drivers found"
        };

    }

    const result =
        await Driver.bulkWrite(
            operations
        );

    return {

        imported:
            result.upsertedCount +
            result.modifiedCount,

        matched:
            result.matchedCount,

        upserted:
            result.upsertedCount,

        total:
            validDrivers.length

    };

};

module.exports = {
    importDrivers
};