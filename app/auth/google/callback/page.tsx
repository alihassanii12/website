"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import toast from "react-hot-toast";

// ==================== API CONFIGURATION ====================
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
const FRONTEND_URL = process.env.NEXT_PUBLIC_FRONTEND_URL || 'http://localhost:3001';

// Configure axios defaults
axios.defaults.withCredentials = true;
axios.defaults.timeout = 30000;

export default function GoogleCallback() {
  const router = useRouter();

  useEffect(() => {
    const params = new URLSearchParams(
      window.location.hash.replace("#", "")
    );

    const idToken = params.get("id_token");

    if (!idToken) {
      toast.error("Google token missing ❌");
      router.replace("/login");
      return;
    }

    const loginWithGoogle = async () => {
      try {
        await axios.post(
          `${API_BASE_URL}/google/login`,
          { token: idToken },
          { withCredentials: true }
        );

        toast.success("Google login successful ✅");

        // allow cookie to settle
        setTimeout(() => {
          // Redirect to dashboard or frontend URL
          window.location.href = `${FRONTEND_URL}/dashboard`;
        }, 300);

      } catch (err: any) {
        console.error("Google login error:", err);
        toast.error(err.response?.data?.message || "Google login failed ❌");
        router.replace("/login");
      }
    };

    loginWithGoogle();
  }, [router]);

  // Show loading state
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent mx-auto mb-4"></div>
        <h2 className="text-xl text-gray-800 font-medium">Completing Google login...</h2>
        <p className="text-gray-600 mt-2">Please wait while we authenticate you</p>
      </div>
    </div>
  );
}