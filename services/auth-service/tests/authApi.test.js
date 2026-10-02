const request = require("supertest");

jest.mock("../src/services/authService", () => ({
    registerUser: jest.fn(),
    loginUser: jest.fn(),
    refreshAccessToken: jest.fn(),
    logoutUser: jest.fn(),
}));

const authService =
    require("../src/services/authService");

const app = require("../src/app");

describe("Auth API", () => {

    beforeEach(() => {

        jest.clearAllMocks();

    });

    test(
        "POST /api/v1/auth/register registers a user",
        async () => {

            authService.registerUser
                .mockResolvedValue({
                    id: "test-user-id",
                    name: "Test User",
                    email: "test@example.com",
                    role: "user",
                });

            const response =
                await request(app)
                    .post("/api/v1/auth/register")
                    .send({
                        name: "Test User",
                        email: "test@example.com",
                        password: "password123",
                    });

            expect(response.statusCode)
                .toBe(201);

            expect(response.body)
                .toEqual({
                    success: true,
                    message:
                        "User registered successfully",
                    data: {
                        id: "test-user-id",
                        name: "Test User",
                        email: "test@example.com",
                        role: "user",
                    },
                });

            expect(
                authService.registerUser
            ).toHaveBeenCalledWith({
                name: "Test User",
                email: "test@example.com",
                password: "password123",
            });

        }
    );


    test(
        "POST /api/v1/auth/login logs in a user",
        async () => {

            authService.loginUser
                .mockResolvedValue({
                    user: {
                        id: "test-user-id",
                        name: "Test User",
                        email: "test@example.com",
                        role: "user",
                    },

                    accessToken: "test-access-token",

                    refreshToken: "test-refresh-token",
                });

            const response =
                await request(app)
                    .post("/api/v1/auth/login")
                    .send({
                        email: "test@example.com",
                        password: "password123",
                    });

            expect(response.statusCode)
                .toBe(200);

            expect(response.body)
                .toEqual({
                    success: true,
                    message: "Login successful",
                    data: {
                        id: "test-user-id",
                        name: "Test User",
                        email: "test@example.com",
                        role: "user",
                    },
                    accessToken:
                        "test-access-token",
                });

            expect(
                response.headers["set-cookie"]
            ).toEqual(
                expect.arrayContaining([
                    expect.stringContaining(
                        "refreshToken=test-refresh-token"
                    ),
                ])
            );

            expect(
                authService.loginUser
            ).toHaveBeenCalledWith({
                email: "test@example.com",
                password: "password123",
            });

        }
    );


    test(
        "POST /api/v1/auth/refresh refreshes access token",
        async () => {

            authService.refreshAccessToken
                .mockResolvedValue({
                    accessToken:
                        "new-access-token",

                    refreshToken:
                        "new-refresh-token",
                });

            const response =
                await request(app)
                    .post("/api/v1/auth/refresh")
                    .set(
                        "Cookie",
                        "refreshToken=old-refresh-token"
                    );

            expect(response.statusCode)
                .toBe(200);

            expect(response.body)
                .toEqual({
                    success: true,
                    accessToken:
                        "new-access-token",
                });

            expect(
                response.headers["set-cookie"]
            ).toEqual(
                expect.arrayContaining([
                    expect.stringContaining(
                        "refreshToken=new-refresh-token"
                    ),
                ])
            );

            expect(
                authService.refreshAccessToken
            ).toHaveBeenCalledWith(
                "old-refresh-token"
            );

        }
    );


    test(
        "POST /api/v1/auth/logout logs out the user",
        async () => {

            authService.logoutUser
                .mockResolvedValue();

            const response =
                await request(app)
                    .post("/api/v1/auth/logout")
                    .set(
                        "Cookie",
                        "refreshToken=test-refresh-token"
                    );

            expect(response.statusCode)
                .toBe(200);

            expect(response.body)
                .toEqual({
                    success: true,
                    message:
                        "Logged out successfully",
                });

            expect(
                authService.logoutUser
            ).toHaveBeenCalledWith(
                "test-refresh-token"
            );

            expect(
                response.headers["set-cookie"]
            ).toEqual(
                expect.arrayContaining([
                    expect.stringContaining(
                        "refreshToken="
                    ),
                ])
            );

        }
    );

});