const jwt = require("jsonwebtoken");
const User = require("../models/User");

// @desc    Protect routes - verify JWT token
exports.protect = async (req, res, next) => {
  let token;

  // Get token from header
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
  }

  // Make sure token exists
  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Not authorized to access this route",
    });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Fetch user by ID
    req.user = await User.findById(decoded.id);

    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "User not found",
      });
    }

    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      message: "Not authorized to access this route",
    });
  }
};

// @desc    Authorize user to access resource they own
exports.authorize = (req, res, next) => {
  if (req.user._id.toString() !== req.params.userId) {
    return res.status(403).json({
      success: false,
      message: "Not authorized to access this resource",
    });
  }
  next();
};