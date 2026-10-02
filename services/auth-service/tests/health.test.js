jest.mock("../src/utils/jwt", () => ({
    generateAccessToken: jest.fn(),
    generateRefreshToken: jest.fn(),
}));

const request = require("supertest");
const app = require("../src/app");

describe("Auth Service Health API", () => {
    test("GET /health returns service health", async () => {
        const response =
            await request(app)
                .get("/health");

        expect(response.statusCode)
            .toBe(200);

        expect(response.body)
            .toEqual(
                expect.objectContaining({
                    success: true,
                    service: "auth-service",
                    status: "UP",
                })
            );
    });
});