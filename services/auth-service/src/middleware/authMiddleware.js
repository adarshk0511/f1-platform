const jwt = require("jsonwebtoken");
const AppError = require("../utils/AppError");
const User = require("../models/User");
const logger = require("../config/logger");


const authenticate = async (req, res, next) => {
  try {
    // Step 1: Read Authorization Header
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      throw new AppError("Authorization header missing", 401);
    }

    // Step 2: Check Header Format
    if (!authHeader.startsWith("Bearer ")) {
      throw new AppError("Invalid Authorization header format", 401);
    }

    // Step 3: Extract Token
    const token = authHeader.split(" ")[1];

    logger.info(`Token extracted: ${token}`);

    // Verify JWT
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    // Load latest user from database
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      throw new AppError("User no longer exists", 401);
    }

    // Attach latest user
    req.user = user;

    next();
  } catch (error) {
    next(error);
  }
};

module.exports = authenticate;
