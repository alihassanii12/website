"use client";

import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { toast, Toaster } from "react-hot-toast";
import Link from "next/link";
import gsap from "gsap";

// ==================== API CONFIGURATION ====================
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
const DASHBOARD_URL = "https://dashboard-eta-gules-99.vercel.app";

// Configure axios defaults
axios.defaults.withCredentials = true;
axios.defaults.timeout = 30000;

export default function LoginPage() {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Form validation
  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const isFormValid = formData.email.trim() !== "" && 
                      formData.password.trim() !== "" &&
                      validateEmail(formData.email);

  // GSAP animation
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isFormValid) {
      toast.error("Please fill all fields correctly");
      return;
    }

    setLoading(true);
    
    try {
      console.log('🔍 Sending login request to:', `${API_BASE_URL}/auth/login`);
      console.log('📤 Data:', formData);

      const response = await axios.post(`${API_BASE_URL}/auth/login`, formData, {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json'
        }
      });

      console.log('✅ Login response:', response.data);

      // ✅ Save token to localStorage as backup
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        
        // Set default header for all future requests
        axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
        
        console.log('✅ Token saved to localStorage');
      }

      toast.success('Login successful! Redirecting...');

      // ✅ Redirect to dashboard
      setTimeout(() => {
        window.location.href = DASHBOARD_URL;
      }, 1000);

    } catch (err: any) {
      console.error('❌ Login error:', err);
      
      if (err.response?.status === 401) {
        toast.error("Invalid email or password");
      } else if (err.response?.status === 400) {
        toast.error(err.response?.data?.error || "User not found");
      } else {
        toast.error(err?.response?.data?.error || "Login failed");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    const nonce = Math.random().toString(36).substring(2);
    sessionStorage.setItem("google_nonce", nonce);

    const redirectUri = `${window.location.origin}/auth/google/callback`;
    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

    if (!clientId) {
      toast.error("Google Client ID not configured");
      return;
    }

    const googleAuthUrl =
      `https://accounts.google.com/o/oauth2/v2/auth?` +
      `client_id=${clientId}` +
      `&redirect_uri=${encodeURIComponent(redirectUri)}` +
      `&response_type=id_token` +
      `&scope=openid email profile` +
      `&nonce=${nonce}`;

    window.location.href = googleAuthUrl;
  };

  return (
    <>
      <Toaster position="top-right" />

      <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-gray-100 to-gray-200 px-4">
        <form
          ref={formRef}
          onSubmit={handleSubmit}
          className="w-full max-w-sm bg-white rounded-2xl shadow-xl p-6 space-y-5"
        >
          <h1 className="text-2xl font-bold text-center text-gray-900">
            Sign In
          </h1>
          <p className="text-center text-sm text-gray-500">
            Enter your credentials to continue
          </p>

          <div className="space-y-4">
            <input
              name="email"
              type="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-300 bg-gray-50 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-black transition"
              disabled={loading}
            />

            <div className="relative">
              <input
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-300 bg-gray-50 text-sm text-gray-900 pr-12 focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-black transition"
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
          </div>

          <div className="flex flex-col space-y-1">
            <Link
              href="/forgot-password"
              className="text-sm text-gray-600 hover:text-black underline self-end"
            >
              Forgot Password?
            </Link>
          </div>

          <button
            type="submit"
            disabled={!isFormValid || loading}
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
                <span>Signing in...</span>
              </span>
            ) : (
              "Sign In"
            )}
          </button>

          <div className="flex items-center gap-3">
            <div className="h-px bg-gray-300 flex-1" />
            <span className="text-xs text-gray-400">OR</span>
            <div className="h-px bg-gray-300 flex-1" />
          </div>

          <button
            type="button"
            onClick={handleGoogleLogin}
            className="w-full py-2.5 rounded-xl border border-gray-300
                       text-sm font-medium text-gray-700
                       hover:bg-gray-100 transition transform hover:scale-105 active:scale-95
                       flex items-center justify-center space-x-2"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z"
              />
            </svg>
            <span>Sign in with Google</span>
          </button>

          <p className="text-center text-sm text-gray-600">
            Don't have an account?{" "}
            <Link href="/register" className="font-semibold text-black underline hover:text-gray-700">
              Register
            </Link>
          </p>
        </form>
      </div>
    </>
  );
}