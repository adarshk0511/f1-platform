const request = require("supertest");
const app = require("../src/app");

describe("API Gateway Health Endpoint", () => {
    it("should return HTTP 200", async () => {
        const response = await request(app)
            .get("/health");

        expect(response.status).toBe(200);
    });

    it("should return the expected health response", async () => {
        const response = await request(app)
            .get("/health");

        expect(response.body).toEqual({
            success: true,
            service: "api-gateway",
        });
    });

    it("should return JSON", async () => {
        const response = await request(app)
            .get("/health");

        expect(response.headers["content-type"])
            .toMatch(/application\/json/);
    });
});