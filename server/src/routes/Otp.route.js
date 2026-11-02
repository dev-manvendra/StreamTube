const express = require("express");
const rateLimit = require("express-rate-limit");
const { sendOtp, verifyOtp } = require("../controllers/otpController");

const router = express.Router();

// Per-IP limits on top of the per-email limits inside the controller
const sendLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Too many requests. Try again later." },
});

const verifyLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Too many requests. Try again later." },
});

router.post("/send", sendLimiter, sendOtp);
router.post("/verify", verifyLimiter, verifyOtp);

module.exports = router;