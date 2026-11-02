const CircuitBreaker = require("opossum");

const createCircuitBreaker = (action, serviceName) => {

    const breaker = new CircuitBreaker(action, {

        timeout: 10000,

        errorThresholdPercentage: 50,

        resetTimeout: 10000,

        volumeThreshold: 5,

    });

    breaker.on("open", () => {
        console.warn(`[Circuit Breaker] ${serviceName}: OPEN`);
    });

    breaker.on("halfOpen", () => {
        console.log(`[Circuit Breaker] ${serviceName}: HALF-OPEN`);
    });

    breaker.on("close", () => {
        console.log(`[Circuit Breaker] ${serviceName}: CLOSED`);
    });

    breaker.on("reject", () => {
        console.warn(`[Circuit Breaker] ${serviceName}: Request rejected`);
    });

    breaker.on("timeout", () => {
        console.error(`[Circuit Breaker] ${serviceName}: Timeout`);
    });

    breaker.on("failure", (error) => {
        console.error(
            `[Circuit Breaker] ${serviceName}: ${error.message}`
        );
    });

    return breaker;
};

module.exports = createCircuitBreaker;