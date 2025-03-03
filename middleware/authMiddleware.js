require("dotenv").config();
const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Protect Routes
const requireAuth = (req, res, next) => {
  const token = req.cookies?.jwt; // ✅ Prevents error if cookies are undefined

  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
      if (err) {
        console.log(err.message);
        return res.redirect("/login"); // ✅ Return after redirect
      } else {
        console.log(decodedToken);
        next();
      }
    });
  } else {
    return res.redirect("/login"); // ✅ Return after redirect
  }
};

// Check Current User
const checkUser = (req, res, next) => {
  const token = req.cookies?.jwt; // ✅ Prevents error if cookies are undefined

  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, async (err, decodedToken) => {
      if (err) {
        res.locals.user = null;
      } else {
        console.log(decodedToken);
        let user = await User.findById(decodedToken.id);
        res.locals.user = user;
      }
      next(); // ✅ Always call next()
    });
  } else {
    res.locals.user = null;
    next(); // ✅ Ensure next() is always called
  }
};

module.exports = { requireAuth, checkUser };
