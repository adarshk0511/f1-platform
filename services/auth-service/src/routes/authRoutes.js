const express = require("express");
const router = express.Router();

const {
    loginLimiter,
    registerLimiter,
    refreshLimiter,
} = require("../middleware/rateLimiter");

const {
    registerUser,
        loginUser,
        refreshToken,
        logoutUser

} = require(
    "../controllers/authController"
);

router.post(
    "/register",
    registerLimiter,
    registerUser
);

router.post(
    "/login",
    loginLimiter,
    loginUser
);

router.post(
    "/refresh",
    refreshLimiter,
    refreshToken
);

router.post(
    "/logout",
    logoutUser
);

router.get("/delay", async (req, res) => {

    await new Promise(resolve =>
        setTimeout(resolve, 15000)
    );

    res.json({

        success: true

    });

});

module.exports = router;