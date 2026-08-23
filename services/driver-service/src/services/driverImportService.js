const axios = require("axios");
const Driver = require("../models/Driver");

const F1_API_URL =
    process.env.F1_API_URL ||
    "https://api.jolpi.ca/ergast/f1";

const importDrivers = async (season = 2026) => {

    const url =
        `${F1_API_URL}/${season}/driverstandings/?limit=100`;

    const response =
        await axios.get(url);

    const standings =
        response.data?.MRData
            ?.StandingsTable
            ?.StandingsLists?.[0]
            ?.DriverStandings || [];

    const validDrivers =
        standings.filter(driver =>
            driver.Driver?.permanentNumber &&
            driver.Driver?.code &&
            driver.Constructors?.[0]?.name
        );

    const operations =
        validDrivers.map(entry => {

            const driver = entry.Driver;

            const constructor =
                entry.Constructors[0];

            return {

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

                            team:
                                constructor.name,

                            nationality:
                                driver.nationality,

                        },

                        $setOnInsert: {

                            championships: 0

                        }

                    },

                    upsert: true

                }

            };

        });

    if (operations.length === 0) {

        return {
            imported: 0,
            message:
                `No valid drivers found for ${season}`
        };

    }

    const result =
        await Driver.bulkWrite(
            operations
        );

    return {

        season,

        processed:
            validDrivers.length,

        inserted:
            result.upsertedCount,

        updated:
            result.modifiedCount,

        matched:
            result.matchedCount

    };

};

module.exports = {
    importDrivers
};