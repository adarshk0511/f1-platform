const jwt = require("jsonwebtoken");
const AppError = require("../utils/AppError");
const logger = require("../config/logger");

const authenticate = (req, res, next) => {
    try {

        const authHeader = req.headers.authorization;

        if (!authHeader) {
            throw new AppError(
                "Authorization header missing",
                401
            );
        }

        if (!authHeader.startsWith("Bearer ")) {
            throw new AppError(
                "Invalid Authorization header format",
                401
            );
        }

        const token = authHeader.split(" ")[1];

        const decoded = jwt.verify(
            token,
            process.env.ACCESS_TOKEN_SECRET
        );

        req.user = {
            id: decoded.id,
            email: decoded.email,
            role: decoded.role,
        };

        logger.info(
            `Authenticated user: ${decoded.email}`
        );

        next();

    } catch (err) {

        next(err);

    }
};

module.exports = authenticate;