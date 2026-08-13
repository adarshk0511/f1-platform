const jwt = require("jsonwebtoken");
const fs = require("fs");
const path = require("path");

const PRIVATE_KEY = fs.readFileSync(
    path.join(
        __dirname,
        "../../keys/access-token-private.pem"
    ),
    "utf8"
);

const generateAccessToken = (user) => {

    return jwt.sign(

        {
            id: user.id,
            email: user.email,
            role: user.role,
        },

        PRIVATE_KEY,

        {
            algorithm: "RS256",
            expiresIn: "15m",
        }

    );

};


const generateRefreshToken = (user) => {

    return jwt.sign(

        {
            id: user.id,
        },

        process.env.REFRESH_TOKEN_SECRET,

        {
            expiresIn: "7d",
        }

    );

};


module.exports = {

    generateAccessToken,

    generateRefreshToken,

};