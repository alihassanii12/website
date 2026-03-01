"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import gsap from "gsap";

// ==================== API CONFIGURATION ====================
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

// Configure axios defaults
axios.defaults.withCredentials = true;
axios.defaults.timeout = 30000;

type Step = "email" | "otp" | "reset";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const cardRef = useRef<HTMLDivElement>(null);

  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // 🔹 GSAP entry + step animation
  useEffect(() => {
    if (cardRef.current) {
      gsap.fromTo(
        cardRef.current,
        { opacity: 0, y: 30, scale: 0.97 },
        { opacity: 1, y: 0, scale: 1, duration: 0.5, ease: "power3.out" }
      );
    }
  }, [step]);

  // -------------------- Step 1: Send OTP --------------------
  const handleSendOtp = async () => {
    if (!email) return toast.error("Enter your email");

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return toast.error("Please enter a valid email address");
    }

    setLoading(true);
    try {
      const response = await axios.post(`${API_BASE_URL}/forgotPassword/send-otp`, {
        email,
      });
      toast.success(response.data?.message || "OTP sent successfully ✅");
      setStep("otp");
    } catch (err: any) {
      console.error("Send OTP error:", err);
      toast.error(err?.response?.data?.message || "Failed to send OTP ❌");
    } finally {
      setLoading(false);
    }
  };

  // -------------------- Step 2: Verify OTP --------------------
  const handleVerifyOtp = async () => {
    if (!otp) return toast.error("Enter OTP");
    if (otp.length < 4) return toast.error("OTP must be at least 4 digits");

    setLoading(true);
    try {
      const response = await axios.post(`${API_BASE_URL}/forgotPassword/verify-otp`, {
        email,
        otp,
      });
      toast.success(response.data?.message || "OTP verified successfully ✅");
      setStep("reset");
    } catch (err: any) {
      console.error("Verify OTP error:", err);
      toast.error(err?.response?.data?.message || "Invalid OTP ❌");
    } finally {
      setLoading(false);
    }
  };

  // -------------------- Step 3: Reset Password --------------------
  const handleResetPassword = async () => {
    if (!password) return toast.error("Enter new password");
    
    // Password validation
    if (password.length < 6) {
      return toast.error("Password must be at least 6 characters");
    }

    setLoading(true);
    try {
      const response = await axios.post(`${API_BASE_URL}/forgotPassword/reset-password`, {
        email,
        password,
      });
      toast.success(response.data?.message || "Password reset successful ✅");
      
      // Redirect to login after success
      setTimeout(() => router.push("/login"), 1500);
    } catch (err: any) {
      console.error("Reset password error:", err);
      toast.error(err?.response?.data?.message || "Reset failed ❌");
    } finally {
      setLoading(false);
    }
  };

  // -------------------- Go Back --------------------
  const handleBack = () => {
    if (step === "otp") {
      setStep("email");
      setOtp("");
    } else if (step === "reset") {
      setStep("otp");
      setPassword("");
    }
  };

  return (
    <>
      <Toaster position="top-right" />

      <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-gray-100 to-gray-200 px-4">
        <div
          ref={cardRef}
          className="w-full max-w-sm bg-white rounded-2xl shadow-xl p-6 space-y-5"
        >
          {/* Back button */}
          {step !== "email" && (
            <button
              onClick={handleBack}
              className="text-sm text-gray-500 hover:text-gray-700 flex items-center space-x-1 transition"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span>Back</span>
            </button>
          )}

          {/* Header */}
          <h1 className="text-2xl font-bold text-center text-gray-900">
            {step === "email" && "Forgot Password"}
            {step === "otp" && "Enter OTP"}
            {step === "reset" && "Reset Password"}
          </h1>

          <p className="text-center text-sm text-gray-500">
            {step === "email" && "We'll send an OTP to your email"}
            {step === "otp" && "Check your email for the OTP"}
            {step === "reset" && "Set a new secure password"}
          </p>

          {/* -------------------- Step 1: Email -------------------- */}
          {step === "email" && (
            <>
              <input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-300
                           bg-gray-50 text-sm text-gray-900
                           focus:outline-none focus:ring-2 focus:ring-black/10
                           focus:border-black transition"
                disabled={loading}
              />

              <button
                disabled={!email || loading}
                onClick={handleSendOtp}
                className="w-full py-2.5 rounded-xl bg-black text-white font-medium
                           transition hover:bg-gray-800 transform hover:scale-105 active:scale-95
                           disabled:bg-gray-400 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {loading ? (
                  <span className="flex items-center justify-center space-x-2">
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Sending...</span>
                  </span>
                ) : (
                  "Send OTP"
                )}
              </button>
            </>
          )}

          {/* -------------------- Step 2: OTP -------------------- */}
          {step === "otp" && (
            <>
              <input
                type="text"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, ''))}
                maxLength={6}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-300
                           bg-gray-50 text-sm text-gray-900 text-center tracking-widest
                           focus:outline-none focus:ring-2 focus:ring-black/10
                           focus:border-black transition"
                disabled={loading}
              />

              <button
                disabled={!otp || loading}
                onClick={handleVerifyOtp}
                className="w-full py-2.5 rounded-xl bg-black text-white font-medium
                           transition hover:bg-gray-800 transform hover:scale-105 active:scale-95
                           disabled:bg-gray-400 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {loading ? (
                  <span className="flex items-center justify-center space-x-2">
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Verifying...</span>
                  </span>
                ) : (
                  "Verify OTP"
                )}
              </button>

              <div className="text-center">
                <button
                  onClick={handleSendOtp}
                  className="text-sm text-blue-600 hover:text-blue-700 transition"
                  disabled={loading}
                >
                  Resend OTP
                </button>
              </div>
            </>
          )}

          {/* -------------------- Step 3: Reset Password -------------------- */}
          {step === "reset" && (
            <>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="New password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-300
                             bg-gray-50 text-sm text-gray-900
                             focus:outline-none focus:ring-2 focus:ring-black/10
                             focus:border-black transition pr-12"
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>

              <div className="text-xs text-gray-500 space-y-1">
                <p className={password.length >= 6 ? "text-green-600" : ""}>
                  ✓ At least 6 characters
                </p>
                <p className={/[A-Z]/.test(password) ? "text-green-600" : ""}>
                  ✓ At least one uppercase letter
                </p>
                <p className={/[0-9]/.test(password) ? "text-green-600" : ""}>
                  ✓ At least one number
                </p>
              </div>

              <button
                disabled={!password || loading}
                onClick={handleResetPassword}
                className="w-full py-2.5 rounded-xl bg-black text-white font-medium
                           transition hover:bg-gray-800 transform hover:scale-105 active:scale-95
                           disabled:bg-gray-400 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {loading ? (
                  <span className="flex items-center justify-center space-x-2">
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Resetting...</span>
                  </span>
                ) : (
                  "Reset Password"
                )}
              </button>
            </>
          )}
        </div>
      </div>
    </>
  );
}