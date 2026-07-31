const logger = require("../config/logger");
const User = require("../models/User");
const bcrypt = require("bcrypt");
const AppError = require("../utils/AppError");
const jwt = require("jsonwebtoken");
const { generateAccessToken, generateRefreshToken } = require("../utils/jwt");
const RefreshToken = require("../models/RefreshToken");

const registerUser = async (userData) => {
  console.log("User received in service:");

  const { name, email, password } = userData;

  const existingUser = await User.findOne({
    email,
  });

  if (existingUser) {
    throw new AppError("User already exists", 409);
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
  });

  return {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    createdAt: user.createdAt,
  };

  logger.info("Email is available");
};

const loginUser = async (loginData) => {
  const { email, password } = loginData;

  // Step 1: Find the user
  const user = await User.findOne({ email });

  if (!user) {
    throw new AppError("User not found", 404);
  }

  // Step 2: Compare passwords
  const isPasswordCorrect = await bcrypt.compare(password, user.password);

  if (!isPasswordCorrect) {
    throw new AppError("Invalid email or password", 401);
  }

  // Step 3: Return user
  // Generate Access Token
  const accessToken = generateAccessToken({
    id: user._id,

    email: user.email,

    role: user.role,
  });

  // Generate Refresh Token
  const refreshToken = generateRefreshToken({
    id: user._id,
  });

  // Store Refresh Token in MongoDB
  await RefreshToken.create({
    user: user._id,

    token: refreshToken,

    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  });

  // Return Login Response
  return {
    user: {
      id: user._id,

      name: user.name,

      email: user.email,

      role: user.role,
    },

    accessToken,

    refreshToken,
  };
};

const refreshAccessToken = async (refreshToken) => {
  if (!refreshToken) {
    throw new AppError(
      "Refresh token missing",

      401,
    );
  }

  // Verify Refresh Token
  const decoded = jwt.verify(
    refreshToken,

    process.env.REFRESH_TOKEN_SECRET,
  );

  // Check if Refresh Token exists in MongoDB
  const storedToken = await RefreshToken.findOne({
    token: refreshToken,
  });

  if (!storedToken) {
    throw new AppError(
      "Refresh token is no longer valid",

      401,
    );
  }

  // Load latest user
  const user = await User.findById(decoded.id);

  if (!user) {
    throw new AppError(
      "User no longer exists",

      401,
    );
  }

  // Remove old Refresh Token
  await RefreshToken.deleteOne({
    _id: storedToken._id,
  });

  const newRefreshToken = generateRefreshToken({
    id: user._id,
  });

  await RefreshToken.create({
    user: user._id,

    token: newRefreshToken,

    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  });

  // Generate new Access Token
  const accessToken = generateAccessToken({
    id: user._id,

    email: user.email,

    role: user.role,
  });

  return {
    accessToken,

    refreshToken: newRefreshToken,
  };
};

const logoutUser = async (refreshToken) => {

    if (!refreshToken) {
        return;
    }

    await RefreshToken.deleteOne({
        token: refreshToken,
    });

};

module.exports = {
  registerUser,
  loginUser,
  refreshAccessToken,
  logoutUser,
};
