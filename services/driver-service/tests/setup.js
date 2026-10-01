process.env.NODE_ENV = "test";

process.env.REDIS_HOST = "localhost";
process.env.REDIS_PORT = "6379";

process.env.GATEWAY_INTERNAL_KEY =
    "test-gateway-key";

jest.setTimeout(3000);