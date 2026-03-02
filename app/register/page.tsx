"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import Link from "next/link";
import gsap from "gsap";
import { Eye, EyeOff, CheckCircle, XCircle } from "lucide-react";

// ==================== API CONFIGURATION ====================
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://image-library-backend-5ola.vercel.app';
const FRONTEND_URL = process.env.NEXT_PUBLIC_FRONTEND_URL || 'https://dashboard-eta-gules-99.vercel.app';

// Configure axios defaults
axios.defaults.withCredentials = true;
axios.defaults.timeout = 30000;

// Generate nonce for Google OAuth
function generateNonce(length = 16) {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let nonce = "";
  for (let i = 0; i < length; i++) {
    nonce += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return nonce;
}

export default function RegisterPage() {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    special: false
  });
  const [emailError, setEmailError] = useState("");
  const [nameError, setNameError] = useState("");
  const [touched, setTouched] = useState({
    name: false,
    email: false,
    password: false
  });

  // Email validation helper
  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Password strength checker
  const checkPasswordStrength = (password: string) => {
    setPasswordStrength({
      length: password.length >= 6,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(password)
    });
  };

  // Name validation
  const validateName = (name: string) => {
    return name.trim().length >= 2;
  };

  // Form validation
  useEffect(() => {
    checkPasswordStrength(formData.password);
    
    // Name validation
    if (touched.name && !validateName(formData.name)) {
      setNameError("Name must be at least 2 characters");
    } else {
      setNameError("");
    }

    // Email validation
    if (touched.email && !validateEmail(formData.email)) {
      setEmailError("Please enter a valid email address");
    } else {
      setEmailError("");
    }
    
    setIsFormValid(
      validateName(formData.name) &&
      validateEmail(formData.email) &&
      formData.password.length >= 6
    );
  }, [formData, touched]);

  // GSAP entry animation
  useEffect(() => {
    if (formRef.current) {
      gsap.fromTo(
        formRef.current,
        { opacity: 0, y: 30, scale: 0.97 },
        { opacity: 1, y: 0, scale: 1, duration: 0.6, ease: "power3.out" }
      );
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleBlur = (field: string) => {
    setTouched(prev => ({ ...prev, [field]: true }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Mark all fields as touched
    setTouched({
      name: true,
      email: true,
      password: true
    });

    if (!isFormValid) {
      toast.error("Please fill all fields correctly");
      return;
    }

    setLoading(true);
    
    try {
      console.log('🔍 Sending registration request to:', `${API_BASE_URL}/auth/register`);

      const response = await axios.post(`${API_BASE_URL}/auth/register`, formData, {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json'
        }
      });

      console.log('✅ Register response:', response.data);

      // ✅ Save token to localStorage as backup
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        
        // Set default header for all future requests
        axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
        
        console.log('✅ Token saved to localStorage');
      }

      toast.success('Registration successful! Redirecting to dashboard...');

      // ✅ Redirect to dashboard
      setTimeout(() => {
        window.location.href = FRONTEND_URL;
      }, 1500);

    } catch (err: any) {
      console.error('❌ Registration error:', err);
      
      if (err.code === 'ERR_NETWORK') {
        toast.error("Network error - please check if backend is running");
      } else if (err.response?.status === 400) {
        if (err.response?.data?.error?.includes("already exists")) {
          toast.error("Email already registered. Please login instead.");
        } else {
          toast.error(err.response?.data?.error || "Invalid registration data");
        }
      } else if (err.response?.status === 409) {
        toast.error("Email already exists. Please login instead.");
      } else {
        toast.error(err?.response?.data?.error || "Registration failed");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = () => {
    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
    
    if (!clientId) {
      toast.error("Google Client ID not configured");
      return;
    }

    const nonce = generateNonce();
    sessionStorage.setItem("google_nonce", nonce);

    const redirectUri = `${window.location.origin}/auth/google/callback`;

    const googleAuthUrl =
      `https://accounts.google.com/o/oauth2/v2/auth?` +
      `client_id=${clientId}` +
      `&redirect_uri=${encodeURIComponent(redirectUri)}` +
      `&response_type=id_token` +
      `&scope=openid email profile` +
      `&nonce=${nonce}`;

    window.location.href = googleAuthUrl;
  };

  // Calculate password strength percentage
  const getPasswordStrengthPercentage = () => {
    const total = Object.values(passwordStrength).filter(Boolean).length;
    return (total / 5) * 100;
  };

  // Get password strength text and color
  const getPasswordStrengthInfo = () => {
    const percentage = getPasswordStrengthPercentage();
    if (percentage === 0) return { text: "Very Weak", color: "bg-red-500", textColor: "text-red-500" };
    if (percentage <= 40) return { text: "Weak", color: "bg-orange-500", textColor: "text-orange-500" };
    if (percentage <= 60) return { text: "Fair", color: "bg-yellow-500", textColor: "text-yellow-500" };
    if (percentage <= 80) return { text: "Good", color: "bg-blue-500", textColor: "text-blue-500" };
    return { text: "Strong", color: "bg-green-500", textColor: "text-green-500" };
  };

  const strengthInfo = getPasswordStrengthInfo();

  return (
    <>
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#1F2937',
            color: '#fff',
            border: '1px solid #374151',
            borderRadius: '1rem',
          },
        }}
      />

      <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-gray-900 to-gray-800 px-4 py-8">
        <form
          ref={formRef}
          onSubmit={handleSubmit}
          className="w-full max-w-md bg-gray-900 rounded-3xl shadow-2xl p-8 space-y-6 border border-gray-800"
        >
          {/* Header */}
          <div className="text-center">
            <h1 className="text-3xl font-bold text-white mb-2">
              Create Account
            </h1>
            <p className="text-sm text-gray-400">
              Join ImageLibrary to store your memories
            </p>
          </div>

          {/* Form Fields */}
          <div className="space-y-5">
            {/* Name Input */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Full Name
              </label>
              <input
                name="name"
                type="text"
                placeholder="John Doe"
                value={formData.name}
                onChange={handleChange}
                onBlur={() => handleBlur('name')}
                className={`w-full px-4 py-3 bg-gray-800 border rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 transition ${
                  touched.name && nameError
                    ? 'border-red-500 focus:ring-red-500'
                    : touched.name && !nameError
                    ? 'border-green-500 focus:ring-green-500'
                    : 'border-gray-700 focus:ring-blue-500'
                }`}
                disabled={loading}
              />
              {touched.name && nameError && (
                <p className="text-xs text-red-500 mt-1 flex items-center">
                  <XCircle size={12} className="mr-1" />
                  {nameError}
                </p>
              )}
              {touched.name && !nameError && formData.name && (
                <p className="text-xs text-green-500 mt-1 flex items-center">
                  <CheckCircle size={12} className="mr-1" />
                  Name looks good
                </p>
              )}
            </div>

            {/* Email Input */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Email Address
              </label>
              <input
                name="email"
                type="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
                onBlur={() => handleBlur('email')}
                className={`w-full px-4 py-3 bg-gray-800 border rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 transition ${
                  touched.email && emailError
                    ? 'border-red-500 focus:ring-red-500'
                    : touched.email && !emailError && formData.email
                    ? 'border-green-500 focus:ring-green-500'
                    : 'border-gray-700 focus:ring-blue-500'
                }`}
                disabled={loading}
              />
              {touched.email && emailError && (
                <p className="text-xs text-red-500 mt-1 flex items-center">
                  <XCircle size={12} className="mr-1" />
                  {emailError}
                </p>
              )}
            </div>

            {/* Password Input */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a strong password"
                  value={formData.password}
                  onChange={handleChange}
                  onBlur={() => handleBlur('password')}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 pr-12 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Password Strength Indicator */}
            {formData.password && (
              <div className="space-y-3 bg-gray-800/50 p-4 rounded-xl border border-gray-700">
                {/* Strength bar */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs text-gray-400">Password strength</span>
                    <span className={`text-xs font-medium ${strengthInfo.textColor}`}>
                      {strengthInfo.text}
                    </span>
                  </div>
                  <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${strengthInfo.color} transition-all duration-300`}
                      style={{ width: `${getPasswordStrengthPercentage()}%` }}
                    />
                  </div>
                </div>

                {/* Requirements */}
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className={`flex items-center space-x-1 ${passwordStrength.length ? 'text-green-500' : 'text-gray-500'}`}>
                    {passwordStrength.length ? <CheckCircle size={12} /> : <XCircle size={12} />}
                    <span>6+ characters</span>
                  </div>
                  <div className={`flex items-center space-x-1 ${passwordStrength.uppercase ? 'text-green-500' : 'text-gray-500'}`}>
                    {passwordStrength.uppercase ? <CheckCircle size={12} /> : <XCircle size={12} />}
                    <span>Uppercase</span>
                  </div>
                  <div className={`flex items-center space-x-1 ${passwordStrength.lowercase ? 'text-green-500' : 'text-gray-500'}`}>
                    {passwordStrength.lowercase ? <CheckCircle size={12} /> : <XCircle size={12} />}
                    <span>Lowercase</span>
                  </div>
                  <div className={`flex items-center space-x-1 ${passwordStrength.number ? 'text-green-500' : 'text-gray-500'}`}>
                    {passwordStrength.number ? <CheckCircle size={12} /> : <XCircle size={12} />}
                    <span>Number</span>
                  </div>
                  <div className={`flex items-center space-x-1 col-span-2 ${passwordStrength.special ? 'text-green-500' : 'text-gray-500'}`}>
                    {passwordStrength.special ? <CheckCircle size={12} /> : <XCircle size={12} />}
                    <span>Special character (!@#$%^&*)</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={!isFormValid || loading}
            className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center space-x-2"
          >
            {loading ? (
              <>
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Creating account...</span>
              </>
            ) : (
              <span>Create Account</span>
            )}
          </button>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-700"></div>
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="px-2 bg-gray-900 text-gray-400">OR</span>
            </div>
          </div>

          {/* Google Sign Up */}
          <button
            type="button"
            onClick={handleGoogleSignup}
            className="w-full py-3.5 bg-gray-800 hover:bg-gray-700 text-white font-medium rounded-xl border border-gray-700 transition transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center space-x-3"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z"
              />
            </svg>
            <span>Continue with Google</span>
          </button>

          {/* Login Link */}
          <p className="text-center text-sm text-gray-400">
            Already have an account?{" "}
            <Link 
              href="/login" 
              className="font-semibold text-blue-400 hover:text-blue-300 underline transition"
            >
              Sign in
            </Link>
          </p>

          {/* Terms */}
          <p className="text-center text-xs text-gray-500">
            By creating an account, you agree to our{" "}
            <Link href="/terms" className="text-gray-400 hover:text-white underline">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link href="/privacy" className="text-gray-400 hover:text-white underline">
              Privacy Policy
            </Link>
          </p>
        </form>
      </div>
    </>
  );
}