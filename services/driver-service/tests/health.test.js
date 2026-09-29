const request = require("supertest");

const app = require("../src/app");

describe("Driver Service Health API", () => {

    test("GET /health returns service health", async () => {

        const response =
            await request(app)
                .get("/health");

        expect(response.statusCode).toBe(200);

        expect(response.body).toEqual(
            expect.objectContaining({
                success: true,
                service: "driver-service",
                status: "UP-v2",
            })
        );

        expect(response.body.instance)
            .toEqual(expect.any(String));
    });

});