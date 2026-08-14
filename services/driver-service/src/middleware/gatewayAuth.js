const AppError = require("../utils/AppError");

const authenticateGateway = (
    req,
    res,
    next
) => {

    const gatewayKey =
        req.headers["x-gateway-key"];

    if (!gatewayKey) {

        return next(
            new AppError(
                "Gateway authentication required",
                401
            )
        );

    }

    if (
        gatewayKey !==
        process.env.GATEWAY_INTERNAL_KEY
    ) {

        return next(
            new AppError(
                "Invalid gateway credentials",
                401
            )
        );

    }

    next();
};

module.exports =
    authenticateGateway;