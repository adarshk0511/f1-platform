const jwt = require("jsonwebtoken");
const fs = require("fs");
const path = require("path");

const AppError = require("../utils/AppError");
const logger = require("../config/logger");

const PUBLIC_KEY = fs.readFileSync(
    path.join(
        __dirname,
        "../../keys/access-token-public.pem"
    ),
    "utf8"
);

const authenticate = (req, res, next) => {
    try {

        // 1. Read Authorization header
        const authHeader =
            req.headers.authorization;

        if (!authHeader) {
            throw new AppError(
                "Authorization header missing",
                401
            );
        }

        // 2. Validate Bearer format
        if (!authHeader.startsWith("Bearer ")) {
            throw new AppError(
                "Invalid Authorization header format",
                401
            );
        }

        // 3. Extract token
        const token =
            authHeader.split(" ")[1];

        // 4. Verify RS256 JWT
        const decoded = jwt.verify(
            token,
            PUBLIC_KEY,
            {
                algorithms: ["RS256"],
            }
        );

        // 5. Attach claims to request
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