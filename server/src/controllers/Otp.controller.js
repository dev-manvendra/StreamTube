import crypto from "node:crypto";
import jwt from "jsonwebtoken";
import { Otp } from "../models/Otp.model.js";
import { sendOtpEmail } from "../utils/SendMail.js";
import { ApiError } from "../utils/ApiErrors.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const OTP_EXPIRY_MINUTES = 10;
const MAX_ATTEMPTS = 5;
const RESEND_COOLDOWN_SECONDS = 60;
const VERIFICATION_TOKEN_EXPIRY = "15m";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// HMAC with a server secret + email, so a leaked DB can't be brute-forced easily
function hashOtp(email, otp) {
  return crypto
    .createHmac("sha256", process.env.OTP_SECRET)
    .update(`${email}:${otp}`)
    .digest("hex");
}

function safeEqual(a, b) {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  return bufA.length === bufB.length && crypto.timingSafeEqual(bufA, bufB);
}

// POST /api/otp/send   body: { email }
export const sendOtp = async (req, res) => {
  try {
    const email = String(req.body.email || "").trim().toLowerCase();
    if (!EMAIL_REGEX.test(email)) {
      throw new ApiError(500, "Server: Please enter valid email")
    }

    // Optional: reject if the email is already registered
    // const User = require("../models/User");
    // if (await User.exists({ email })) {
    //   return res.status(409).json({ message: "Email already registered." });
    // }

    // Resend cooldown
    const existing = await Otp.findOne({ email });
    if (existing) {
      const secondsSince = (Date.now() - existing.lastSentAt.getTime()) / 1000;
      if (secondsSince < RESEND_COOLDOWN_SECONDS) {
        const wait = Math.ceil(RESEND_COOLDOWN_SECONDS - secondsSince);
        return res
          .status(429)
          .json({ message: `Please wait ${wait}s before requesting a new code.` });
      }
    }

    // Cryptographically secure 6-digit OTP (100000-999999)
    const otp = crypto.randomInt(100000, 1000000).toString();

    await Otp.findOneAndUpdate(
      { email },
      {
        otpHash: hashOtp(email, otp),
        attempts: 0,
        lastSentAt: new Date(),
        expiresAt: new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000),
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    try {
      await sendOtpEmail(email, otp, OTP_EXPIRY_MINUTES);
    } catch (mailErr) {
      await Otp.deleteOne({ email }); // don't leave an OTP the user never received
      console.error("Email send failed:", mailErr);
      throw new ApiError(500, "Server: Could not send email. Try again.")
    }

    return res.status(201).json(
        
        
        new ApiResponse(200, "User registered Successfully")
    )
  } catch (err) {
    console.error("sendOtp error:", err);
    throw new ApiError(500, "Server: Could not send email. Try again.")
  }
};

// POST /api/otp/verify   body: { email, otp }
export const verifyOtp = async (req, res) => {
  try {
    const email = String(req.body.email || "").trim().toLowerCase();
    const otp = String(req.body.otp || "").trim();

    if (!EMAIL_REGEX.test(email) || !/^\d{6}$/.test(otp)) {
      return res.status(400).json({ message: "Email and a 6-digit OTP are required." });
    }

    const record = await Otp.findOne({ email });
    if (!record || record.expiresAt.getTime() < Date.now()) {
      if (record) await Otp.deleteOne({ email });
      return res
        .status(400)
        .json({ message: "OTP expired or not found. Please request a new one." });
    }

    if (record.attempts >= MAX_ATTEMPTS) {
      await Otp.deleteOne({ email });
      return res
        .status(429)
        .json({ message: "Too many incorrect attempts. Please request a new OTP." });
    }

    if (!safeEqual(record.otpHash, hashOtp(email, otp))) {
      record.attempts += 1;
      await record.save();
      const left = MAX_ATTEMPTS - record.attempts;
      return res.status(400).json({
        message: `Incorrect OTP. ${left} attempt${left === 1 ? "" : "s"} left.`,
      });
    }

    // Success: OTP is single-use
    await Otp.deleteOne({ email });

    // Short-lived, signed proof that this email was verified
    const verificationToken = jwt.sign(
      { email, purpose: "email-verification" },
      process.env.JWT_SECRET,
      { expiresIn: VERIFICATION_TOKEN_EXPIRY }
    );

    return res.json({ message: "Email verified.", verificationToken });
  } catch (err) {
    console.error("verifyOtp error:", err);
    return res.status(500).json({ message: "Something went wrong." });
  }
};