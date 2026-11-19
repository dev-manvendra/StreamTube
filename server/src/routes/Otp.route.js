import express from "express";
import rateLimit from "express-rate-limit";
import { sendOtp, verifyOtp } from "../controllers/Otp.controller.js";

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

router.route("/send").post(sendLimiter, sendOtp)
router.route("/verify").post(verifyLimiter, verifyOtp)


export default router;
