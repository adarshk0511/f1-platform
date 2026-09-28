const axios = require("axios");

const Driver = require("../src/models/Driver");

const {
    importDrivers,
} = require("../src/services/driverImportService");

jest.mock("axios");

jest.mock("../src/models/Driver", () => ({
    bulkWrite: jest.fn(),
}));

describe("driverImportService", () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test("imports drivers successfully", async () => {

        axios.get.mockResolvedValue({
            data: {
                MRData: {
                    StandingsTable: {
                        StandingsLists: [
                            {
                                DriverStandings: [
                                    {
                                        Driver: {
                                            permanentNumber: "44",
                                            givenName: "Lewis",
                                            familyName: "Hamilton",
                                            code: "HAM",
                                            nationality: "British",
                                        },
                                        Constructors: [
                                            {
                                                name: "Ferrari",
                                            },
                                        ],
                                    },
                                    {
                                        Driver: {
                                            permanentNumber: "63",
                                            givenName: "George",
                                            familyName: "Russell",
                                            code: "RUS",
                                            nationality: "British",
                                        },
                                        Constructors: [
                                            {
                                                name: "Mercedes",
                                            },
                                        ],
                                    },
                                ],
                            },
                        ],
                    },
                },
            },
        });

        Driver.bulkWrite.mockResolvedValue({
            upsertedCount: 2,
            modifiedCount: 2,
            matchedCount: 2,
        });

        const result = await importDrivers(2026);

        expect(axios.get).toHaveBeenCalledWith(
            "https://api.jolpi.ca/ergast/f1/2026/driverstandings/?limit=100"
        );

        expect(Driver.bulkWrite).toHaveBeenCalledTimes(1);

        expect(Driver.bulkWrite).toHaveBeenCalledWith(
            expect.arrayContaining([
                expect.objectContaining({
                    updateOne: expect.objectContaining({
                        filter: {
                            driverNumber: 44,
                        },
                    }),
                }),
                expect.objectContaining({
                    updateOne: expect.objectContaining({
                        filter: {
                            driverNumber: 63,
                        },
                    }),
                }),
            ])
        );

        expect(result).toEqual({
            season: 2026,
            processed: 2,
            inserted: 2,
            updated: 2,
            matched: 2,
        });
    });

});