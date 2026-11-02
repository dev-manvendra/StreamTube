const jwt = require("jsonwebtoken");

/**
 * Blocks the request unless it carries a valid verification token
 * issued by POST /api/otp/verify for the SAME email as in the body.
 *
 * Token can be sent as body.verificationToken or the
 * "x-verification-token" header.
 */
module.exports = function requireVerifiedEmail(req, res, next) {
  const token = req.body.verificationToken || req.headers["x-verification-token"];
  if (!token) {
    return res.status(403).json({ message: "Email verification required." });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const bodyEmail = String(req.body.email || "").trim().toLowerCase();

    if (payload.purpose !== "email-verification" || payload.email !== bodyEmail) {
      return res.status(403).json({ message: "Email verification does not match." });
    }

    req.verifiedEmail = payload.email;
    next();
  } catch (err) {
    return res
      .status(403)
      .json({ message: "Verification expired or invalid. Please verify your email again." });
  }
};