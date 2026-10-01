const request = require("supertest");

jest.mock("jsonwebtoken", () => ({
    verify: jest.fn(),
}));

jest.mock("../src/services/driverService", () => ({
    getAllDrivers1: jest.fn(),
}));

jest.mock("../src/services/cacheService", () => ({
    get: jest.fn(),
    set: jest.fn(),
    delByPattern: jest.fn(),
}));

const jwt = require("jsonwebtoken");

const driverService =
    require("../src/services/driverService");

const app = require("../src/app");

describe("Driver API", () => {

    beforeEach(() => {

        jest.clearAllMocks();

        jwt.verify.mockReturnValue({
            id: "test-user-id",
            email: "test@example.com",
            role: "user",
        });

        driverService.getAllDrivers1.mockResolvedValue({
            success: true,

            data: [
                {
                    driverNumber: 44,
                    fullName: "Lewis Hamilton",
                    abbreviation: "HAM",
                    team: "Ferrari",
                    nationality: "British",
                    championships: 7,
                },
            ],

            pagination: {
                page: 1,
                limit: 5,
            },
        });

    });

    test(
        "GET /api/v1/drivers returns drivers for authenticated user",
        async () => {

            const response =
                await request(app)
                    .get("/api/v1/drivers")
                    .set(
                        "X-Gateway-Key",
                        "test-gateway-key"
                    )
                    .set(
                        "Authorization",
                        "Bearer test-token"
                    );

            expect(response.statusCode)
                .toBe(200);

            expect(response.body)
                .toEqual(
                    expect.objectContaining({
                        success: true,

                        data: expect.arrayContaining([
                            expect.objectContaining({
                                abbreviation: "HAM",
                                team: "Ferrari",
                            }),
                        ]),
                    })
                );

            expect(jwt.verify)
                .toHaveBeenCalledWith(
                    "test-token",
                    expect.any(String),
                    {
                        algorithms: ["RS256"],
                    }
                );

            expect(
                driverService.getAllDrivers1
            ).toHaveBeenCalled();

        }
    );

    test(
        "GET /api/v1/drivers rejects request without gateway authentication",
        async () => {

            const response =
                await request(app)
                    .get("/api/v1/drivers");

            expect(response.statusCode)
                .toBe(401);

            expect(response.body.message)
                .toBe(
                    "Gateway authentication required"
                );

            expect(
                driverService.getAllDrivers1
            ).not.toHaveBeenCalled();

        }
    );

    test(
        "GET /api/v1/drivers rejects request without JWT",
        async () => {

            const response =
                await request(app)
                    .get("/api/v1/drivers")
                    .set(
                        "X-Gateway-Key",
                        "test-gateway-key"
                    );

            expect(response.statusCode)
                .toBe(401);

            expect(response.body.message)
                .toBe(
                    "Authorization header missing"
                );

            expect(
                driverService.getAllDrivers1
            ).not.toHaveBeenCalled();

        }
    );

});