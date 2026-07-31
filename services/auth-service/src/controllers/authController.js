const authService = require("../services/authService");

const registerUser = async (req, res) => {
  const user = await authService.registerUser(req.body);

  res.status(201).json({
    success: true,
    message: "User registered successfully",
    data: user,
  });
};

const loginUser = async (req, res) => {
  const loginResponse = await authService.loginUser(req.body);

  res
    .cookie(
      "refreshToken",

      loginResponse.refreshToken,

      {
        httpOnly: true,

        secure: false,

        sameSite: "lax",

        maxAge: 7 * 24 * 60 * 60 * 1000,
      },
    )

    .status(200)

    .json({
      success: true,

      message: "Login successful",

      data: loginResponse.user,

      accessToken: loginResponse.accessToken,
    });
};

const refreshToken = async (req, res) => {
  const tokens = await authService.refreshAccessToken(req.cookies.refreshToken);

  res
    .cookie(
      "refreshToken",

      tokens.refreshToken,

      {
        httpOnly: true,

        secure: false,

        sameSite: "lax",

        maxAge: 7 * 24 * 60 * 60 * 1000,
      },
    )

    .status(200)

    .json({
      success: true,

      accessToken: tokens.accessToken,
    });
};

const logoutUser = async (req, res) => {

    await authService.logoutUser(
        req.cookies.refreshToken
    );

    res.clearCookie(
        "refreshToken",
        {
            httpOnly: true,
            secure: false,
            sameSite: "lax",
        }
    );

    res.status(200).json({

        success: true,

        message: "Logged out successfully",

    });

};

module.exports = {
  registerUser,
  loginUser,
  refreshToken,
  logoutUser, 
};
