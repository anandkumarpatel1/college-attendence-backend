const Teacher = require("../model/Teacher");
const jwt = require("jsonwebtoken");

exports.isAuthenticated = async (req, res, next) => {
  try {
    const { token } = req.cookies;
    if (!token) {
      return res.status(401).json({
        message: "Please Login",
      });
    }
    const decoded = await jwt.verify(token, process.env.JWT_SECRET);

    req.teacher = await Teacher.findById(decoded._id);

    next()
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
