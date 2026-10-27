
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Input from "../components/Input.jsx";

function SignUp() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // OTP state
  const [otp, setOtp] = useState("");
  const [otpSentFor, setOtpSentFor] = useState("");
  const [verifiedEmail, setVerifiedEmail] = useState("");
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);

  // General status messages
  const [otpMessage, setOtpMessage] = useState("");
  const [otpMessageType, setOtpMessageType] = useState("");
  const [formMessage, setFormMessage] = useState("");

  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    trigger,
    getValues,
    formState: {
      errors,
      isSubmitted,
      isSubmitting,
      isValid,
    },
  } = useForm({
    mode: "onSubmit",
    reValidateMode: "onChange",
  });

  const email = watch("email", "");
  const normalizedEmail = email.trim().toLowerCase();

  // An OTP/verification belongs only to the email it was requested for.
  const isOtpSent = Boolean(
    normalizedEmail && otpSentFor === normalizedEmail
  );

  const isEmailVerified = Boolean(
    normalizedEmail && verifiedEmail === normalizedEmail
  );

  // Clear OTP-related state when the email address changes.
  useEffect(() => {
    setOtp("");
    setOtpSentFor("");
    setVerifiedEmail("");
    setOtpMessage("");
    setOtpMessageType("");
  }, [normalizedEmail]);

  // Request an OTP from the backend.
  const handleGetOtp = async () => {
    setOtpMessage("");
    setOtpMessageType("");

    const isEmailValid = await trigger("email");

    if (!isEmailValid) {
      setOtpMessage("Please enter a valid email address.");
      setOtpMessageType("error");
      return;
    }

    const currentEmail = getValues("email").trim().toLowerCase();

    setIsSendingOtp(true);

    try {
      // EXAMPLE ENDPOINT: your backend must implement this route.
      const response = await axios.post(
        "/api/v1/users/send-email-otp",
        { email: currentEmail }
      );

      setOtpSentFor(currentEmail);
      setVerifiedEmail("");
      setOtp("");

      setOtpMessage(
        response.data?.message ||
          "OTP sent successfully. Please check your inbox."
      );
      setOtpMessageType("success");
    } catch (error) {
      setOtpMessage(
        error.response?.data?.message ||
          "Could not send OTP. Please try again."
      );
      setOtpMessageType("error");
    } finally {
      setIsSendingOtp(false);
    }
  };

  // Verify the OTP entered by the user.
  const handleVerifyOtp = async () => {
    setOtpMessage("");
    setOtpMessageType("");

    if (!isOtpSent) {
      setOtpMessage("Please request an OTP first.");
      setOtpMessageType("error");
      return;
    }

    if (!/^\d{6}$/.test(otp)) {
      setOtpMessage("Enter the 6-digit OTP.");
      setOtpMessageType("error");
      return;
    }

    const currentEmail = getValues("email").trim().toLowerCase();

    setIsVerifyingOtp(true);

    try {
      // EXAMPLE ENDPOINT: your backend must implement this route.
      const response = await axios.post(
        "/api/v1/users/verify-email-otp",
        {
          email: currentEmail,
          otp,
        }
      );

      setVerifiedEmail(currentEmail);

      setOtpMessage(
        response.data?.message || "Email verified successfully!"
      );
      setOtpMessageType("success");
    } catch (error) {
      setOtpMessage(
        error.response?.data?.message ||
          "Invalid or expired OTP. Please try again."
      );
      setOtpMessageType("error");
    } finally {
      setIsVerifyingOtp(false);
    }
  };

  // Register only after form validation and email verification.
  const create = async (data) => {
    const currentEmail = data.email.trim().toLowerCase();

    if (verifiedEmail !== currentEmail) {
      setFormMessage(
        "Please verify your email address before creating your account."
      );
      return;
    }

    setFormMessage("");

    try {
      const formData = new FormData();

      formData.append(
        "fullname",
        `${data.FirstName.trim()} ${data.LastName.trim()}`
      );
      formData.append("username", data.username.trim());
      formData.append("email", currentEmail);
      formData.append("password", data.password);

      const imageResponse = await fetch("/logo.png");

      if (!imageResponse.ok) {
        throw new Error("Could not load the avatar image.");
      }

      const blob = await imageResponse.blob();

      const avatarFile = new File([blob], "logo.png", {
        type: blob.type || "image/png",
      });

      formData.append("avatar", avatarFile);

      const response = await axios.post(
        "/api/v1/users/register",
        formData
      );

      setFormMessage("");
      setIsLoggedIn(true);

      console.log("Registration response:", response.data);
    } catch (error) {
      console.error("Registration failed:", error);

      setFormMessage(
        error.response?.data?.message ||
          error.message ||
          "Registration failed. Please try again."
      );
    }
  };

  if (isLoggedIn) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
        <div className="relative w-full max-w-lg p-8 bg-[#161E2E] border border-gray-800 rounded-2xl shadow-2xl text-white">
          <button
            type="button"
            onClick={() => navigate("/home")}
            className="absolute top-4 right-4 text-gray-400 hover:text-white text-2xl font-bold cursor-pointer"
            aria-label="Close"
          >
            &times;
          </button>

          <h1 className="text-3xl font-bold font-serif">
            Start your Journey with Stream
            <span className="text-yellow-500">Tube</span>
          </h1>

          <p className="mt-2 text-sm text-gray-400">
            Your account has been registered successfully.
          </p>

          <button
            type="button"
            onClick={() => navigate("/home")}
            className="w-full py-3 mt-4 bg-yellow-500 hover:bg-yellow-400 text-gray-950 font-bold rounded-lg transition-colors cursor-pointer"
          >
            Go To Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="relative w-full max-w-lg my-4 p-8 bg-[#161E2E] border border-gray-800 rounded-2xl shadow-2xl text-white">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="absolute top-4 right-4 text-gray-400 hover:text-white text-2xl font-bold cursor-pointer"
          aria-label="Close"
        >
          &times;
        </button>

        <h1 className="text-3xl font-bold font-serif">
          Welcome to Stream
          <span className="text-yellow-500">Tube</span>
        </h1>

        <p className="mt-2 text-sm text-gray-400">
          Create your account to upload, subscribe and comment.
        </p>

        <form
          className="mt-6 space-y-4"
          onSubmit={handleSubmit(create)}
          noValidate
        >
          {/* First and last name */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Input
                label="First name"
                {...register("FirstName", {
                  required: "First name is required.",
                  validate: (value) =>
                    value.trim().length > 0 ||
                    "First name cannot be empty.",
                })}
              />

              {errors.FirstName && (
                <p className="mt-1 text-sm text-red-400">
                  {errors.FirstName.message}
                </p>
              )}
            </div>

            <div>
              <Input
                label="Last name"
                {...register("LastName", {
                  required: "Last name is required.",
                  validate: (value) =>
                    value.trim().length > 0 ||
                    "Last name cannot be empty.",
                })}
              />

              {errors.LastName && (
                <p className="mt-1 text-sm text-red-400">
                  {errors.LastName.message}
                </p>
              )}
            </div>
          </div>

          {/* Username */}
          <div>
            <Input
              label="Username"
              {...register("username", {
                required: "Username is required.",
                validate: (value) =>
                  value.trim().length > 0 ||
                  "Username cannot be empty.",
              })}
            />

            {errors.username && (
              <p className="mt-1 text-sm text-red-400">
                {errors.username.message}
              </p>
            )}
          </div>

          {/* Email */}
          <div>
            <Input
              label="Email"
              type="email"
              {...register("email", {
                required: "Email is required.",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Enter a valid email address.",
                },
              })}
            />

            {errors.email && (
              <p className="mt-1 text-sm text-red-400">
                {errors.email.message}
              </p>
            )}

            <div className="mt-2 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={handleGetOtp}
                disabled={
                  isSendingOtp ||
                  isVerifyingOtp ||
                  isSubmitting ||
                  isEmailVerified
                }
                className="px-4 py-2 rounded-lg bg-yellow-500 text-gray-950 font-semibold hover:bg-yellow-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isEmailVerified
                  ? "Email Verified"
                  : isSendingOtp
                    ? "Sending OTP..."
                    : isOtpSent
                      ? "Resend OTP"
                      : "Get OTP"}
              </button>

              {isEmailVerified && (
                <span className="text-sm text-green-400">
                  ✓ Email verified
                </span>
              )}
            </div>

            {/* OTP field appears after OTP is sent */}
            {isOtpSent && !isEmailVerified && (
              <div className="mt-3 space-y-2">
                <label
                  htmlFor="email-otp"
                  className="block text-sm text-gray-300"
                >
                  Enter the 6-digit OTP
                </label>

                <div className="flex gap-2">
                  <input
                    id="email-otp"
                    type="text"
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    maxLength={6}
                    value={otp}
                    onChange={(event) =>
                      setOtp(
                        event.target.value
                          .replace(/\D/g, "")
                          .slice(0, 6)
                      )
                    }
                    placeholder="123456"
                    aria-label="Email verification OTP"
                    className="min-w-0 flex-1 rounded-lg border border-gray-700 bg-[#0F1725] px-3 py-2 text-white outline-none focus:border-yellow-500"
                  />

                  <button
                    type="button"
                    onClick={handleVerifyOtp}
                    disabled={
                      isVerifyingOtp ||
                      isSendingOtp ||
                      otp.length !== 6
                    }
                    className="px-4 py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {isVerifyingOtp ? "Verifying..." : "Verify"}
                  </button>
                </div>
              </div>
            )}

            {/* OTP success/error feedback */}
            {otpMessage && (
              <p
                role="status"
                aria-live="polite"
                className={`mt-2 text-sm ${
                  otpMessageType === "success"
                    ? "text-green-400"
                    : "text-red-400"
                }`}
              >
                {otpMessage}
              </p>
            )}
          </div>

          {/* Password */}
          <div>
            <Input
              label="Password"
              type="password"
              {...register("password", {
                required: "Password is required.",
                minLength: {
                  value: 8,
                  message: "Password must have at least 8 characters.",
                },
              })}
            />

            {errors.password && (
              <p className="mt-1 text-sm text-red-400">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Registration status */}
          {formMessage && (
            <p
              role="alert"
              className="text-sm text-red-400"
            >
              {formMessage}
            </p>
          )}

          <button
            type="submit"
            disabled={
              isSubmitting ||
              (isSubmitted &&
                (!isValid || !isEmailVerified))
            }
            className="w-full py-3 mt-4 bg-yellow-500 hover:bg-yellow-400 text-gray-950 font-bold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            {isSubmitting
              ? "Creating account..."
              : "Create account"}
          </button>

          {isSubmitted && !isEmailVerified && (
            <p className="text-xs text-gray-400 text-center">
              Verify your email before creating your account.
            </p>
          )}
        </form>
      </div>
    </div>
  );
}

export default SignUp;
