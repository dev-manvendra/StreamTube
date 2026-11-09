import mongoose from "mongoose";

const otpSchema = new mongoose.Schema({
  // One active OTP per email; re-sending overwrites the previous one
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  // Never store the plain OTP, only an HMAC of it
  otpHash: { type: String, required: true },
  attempts: { type: Number, default: 0 },
  lastSentAt: { type: Date, default: Date.now },
  expiresAt: { type: Date, required: true },
});

// TTL index: MongoDB automatically deletes the document once expiresAt passes
// (the TTL monitor runs roughly every 60s, so we still check expiry in code)
otpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const Otp = mongoose.model("Otp", otpSchema);
