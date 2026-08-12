const AppError = require("../utils/AppError");

const authenticateService = (
    req,
    res,
    next
) => {

    const serviceKey =
        req.headers["x-service-key"];

    if (!serviceKey) {

        return next(
            new AppError(
                "Service authentication required",
                401
            )
        );

    }

    if (
        serviceKey !==
        process.env.INTERNAL_SERVICE_KEY
    ) {

        return next(
            new AppError(
                "Invalid service credentials",
                401
            )
        );

    }

    req.serviceAuthenticated = true;

    next();
};

module.exports = authenticateService;