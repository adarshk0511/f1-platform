const jwt = require("jsonwebtoken");
const fs = require("fs");
const path = require("path");

const PUBLIC_KEY = fs.readFileSync(
    path.join(
        __dirname,
        "../../keys/access-token-public.pem"
    ),
    "utf8"
);

const authenticate = (req, res, next) => {
    try {

        const authHeader =
            req.headers.authorization;

        if (!authHeader) {

            return res.status(401).json({
                success: false,
                message:
                    "Authorization header missing",
            });

        }

        if (
            !authHeader.startsWith("Bearer ")
        ) {

            return res.status(401).json({
                success: false,
                message:
                    "Invalid Authorization header format",
            });

        }

        const token =
            authHeader.split(" ")[1];

        const decoded =
            jwt.verify(
                token,
                PUBLIC_KEY,
                {
                    algorithms: ["RS256"],
                }
            );

        req.user = {
            id: decoded.id,
            email: decoded.email,
            role: decoded.role,
        };

        next();

    } catch (err) {

        return res.status(401).json({
            success: false,
            message: "Invalid or expired token",
        });

    }
};

module.exports = authenticate;