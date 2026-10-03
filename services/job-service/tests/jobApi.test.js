jest.mock("../src/services/jobService", () => ({
    importRace: jest.fn()
}));

jest.mock("../src/services/jobPersistenceService", () => ({
    getJobStatus: jest.fn()
}));

const request = require("supertest");

const app = require("../src/app");

const jobService =
    require("../src/services/jobService");

const jobPersistenceService =
    require("../src/services/jobPersistenceService");


describe("Job Service API", () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });


    test("POST /internal/jobs/import creates an import job", async () => {

        jobService.importRace.mockResolvedValue({
            success: true,
            message: "Job Service reached",
            jobId: "123",
            payload: {
                raceName: "Monaco GP",
                season: 2026
            }
        });

        const response =
            await request(app)
                .post("/internal/jobs/import")
                .set(
                    "x-service-key",
                    "test-service-key"
                )
                .send({
                    raceName: "Monaco GP",
                    season: 2026
                });

        expect(response.statusCode)
            .toBe(200);

        expect(response.body)
            .toEqual({
                success: true,
                message: "Job Service reached",
                jobId: "123",
                payload: {
                    raceName: "Monaco GP",
                    season: 2026
                }
            });

        expect(jobService.importRace)
            .toHaveBeenCalledWith({
                raceName: "Monaco GP",
                season: 2026
            });

    });


    test("POST /internal/jobs/import rejects missing service credentials", async () => {

        const response =
            await request(app)
                .post("/internal/jobs/import")
                .send({
                    raceName: "Monaco GP",
                    season: 2026
                });

        expect(response.statusCode)
            .toBe(401);

    });


    test("POST /internal/jobs/import rejects invalid service credentials", async () => {

        const response =
            await request(app)
                .post("/internal/jobs/import")
                .set(
                    "x-service-key",
                    "wrong-key"
                )
                .send({
                    raceName: "Monaco GP",
                    season: 2026
                });

        expect(response.statusCode)
            .toBe(401);

    });


    test("GET /internal/jobs/:jobId returns job status", async () => {

        jobPersistenceService.getJobStatus
            .mockResolvedValue({
                bullJobId: "123",
                status: "completed",
                createdAt: new Date(),
                updatedAt: new Date()
            });

        const response =
            await request(app)
                .get("/internal/jobs/123");

        expect(response.statusCode)
            .toBe(200);

        expect(response.body.success)
            .toBe(true);

        expect(response.body.data.jobId)
            .toBe("123");

        expect(response.body.data.status)
            .toBe("completed");

        expect(
            jobPersistenceService.getJobStatus
        ).toHaveBeenCalledWith("123");

    });


    test("GET /internal/jobs/:jobId returns 404 when job does not exist", async () => {

        jobPersistenceService.getJobStatus
            .mockResolvedValue(null);

        const response =
            await request(app)
                .get("/internal/jobs/999");

        expect(response.statusCode)
            .toBe(404);

        expect(response.body)
            .toEqual({
                success: false,
                message: "Job not found"
            });

    });

});