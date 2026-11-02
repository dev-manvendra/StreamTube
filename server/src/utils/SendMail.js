const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT) || 587,
  secure: Number(process.env.SMTP_PORT) === 465, // true for 465, false for 587
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

async function sendOtpEmail(to, otp, expiryMinutes) {
  await transporter.sendMail({
    from: process.env.MAIL_FROM || process.env.SMTP_USER,
    to,
    subject: "Your verification code",
    text: `Your verification code is ${otp}. It expires in ${expiryMinutes} minutes. If you didn't request this, you can ignore this email.`,
    html: `
      <div style="font-family:Arial,sans-serif;max-width:420px;margin:auto">
        <h2>Verify your email</h2>
        <p>Use the code below to complete your registration:</p>
        <p style="font-size:32px;letter-spacing:8px;font-weight:bold">${otp}</p>
        <p>This code expires in ${expiryMinutes} minutes.</p>
        <p style="color:#888;font-size:12px">If you didn't request this, you can ignore this email.</p>
      </div>
    `,
  });
}

module.exports = { sendOtpEmail };