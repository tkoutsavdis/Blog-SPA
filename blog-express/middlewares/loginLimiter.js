// middlewares/loginLimiter.js
const rateLimit = require('express-rate-limit');

// Create the limiter middleware
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, 
  message: {
    message: 'Too many login attempts from this IP, please try again after 15 minutes'
  }
});

module.exports = loginLimiter;
