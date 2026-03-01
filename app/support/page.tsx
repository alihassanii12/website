"use client";

import { useEffect, useRef, useState } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import gsap from "gsap";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

// ==================== API CONFIGURATION ====================
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

// Configure axios defaults
axios.defaults.withCredentials = true;
axios.defaults.timeout = 30000;

export default function SupportPage() {
  const formRef = useRef<HTMLFormElement>(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);
  const [charCount, setCharCount] = useState(0);

  // Email validation helper
  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // ✅ Form validation
  useEffect(() => {
    setCharCount(formData.message.length);
    
    setIsFormValid(
      formData.name.trim() !== "" &&
      validateEmail(formData.email) &&
      formData.message.trim().length >= 10
    );
  }, [formData]);

  // ✅ GSAP Animation (Strict Mode Safe)
  useEffect(() => {
    if (!formRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        formRef.current,
        { opacity: 0, y: 30, scale: 0.97 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.6,
          ease: "power3.out",
        }
      );
    }, formRef);

    return () => ctx.revert();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;

    // Additional validation
    if (!validateEmail(formData.email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    if (formData.message.length < 10) {
      toast.error("Message must be at least 10 characters");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(`${API_BASE_URL}/support`, formData, {
        withCredentials: true,
      });

      toast.success(response.data?.message || "Message sent successfully! ✅");
      setFormData({ name: "", email: "", message: "" });
      
      // Optional: Show ticket ID if provided
      if (response.data?.ticketId) {
        toast.success(`Ticket ID: ${response.data.ticketId}`, {
          duration: 5000,
        });
      }
    } catch (err: any) {
      console.error("Support request error:", err);
      
      // Handle specific error cases
      if (err.response?.status === 429) {
        toast.error("Too many requests. Please try again later.");
      } else if (err.response?.status === 400) {
        toast.error(err?.response?.data?.error || "Invalid form data");
      } else {
        toast.error(err?.response?.data?.error || "Failed to send message ❌");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#fff',
            color: '#363636',
            boxShadow: '0 3px 10px rgba(0,0,0,0.1)',
            borderRadius: '8px',
          },
        }}
      />

      <main className="min-h-screen flex items-center justify-center bg-linear-to-br from-gray-100 to-gray-200 px-4 py-20">
        <form
          ref={formRef}
          onSubmit={handleSubmit}
          className="w-full max-w-md bg-white rounded-2xl shadow-xl p-6 space-y-5"
        >
          <h1 className="text-2xl font-bold text-center text-gray-900">
            Support
          </h1>

          <p className="text-center text-sm text-gray-500">
            Have a question or issue? We're here to help!
          </p>

          <div className="space-y-4">
            {/* Name Input */}
            <input
              name="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleChange}
              className={`w-full px-4 py-2.5 rounded-xl border ${
                formData.name ? 'border-gray-300' : 'border-gray-300'
              } bg-gray-50 text-sm text-gray-900
              focus:outline-none focus:ring-2 focus:ring-black/10
              focus:border-black transition`}
              disabled={loading}
            />

            {/* Email Input */}
            <div>
              <input
                name="email"
                type="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={handleChange}
                className={`w-full px-4 py-2.5 rounded-xl border ${
                  formData.email && !validateEmail(formData.email)
                    ? 'border-red-500 focus:ring-red-500'
                    : 'border-gray-300 focus:ring-black/10'
                } bg-gray-50 text-sm text-gray-900
                focus:outline-none focus:ring-2 focus:border-black transition`}
                disabled={loading}
              />
              {formData.email && !validateEmail(formData.email) && (
                <p className="text-xs text-red-500 mt-1">Please enter a valid email</p>
              )}
            </div>

            {/* Message Input */}
            <div>
              <textarea
                name="message"
                placeholder="Your Message"
                value={formData.message}
                onChange={handleChange}
                rows={4}
                className={`w-full px-4 py-2.5 rounded-xl border ${
                  formData.message && formData.message.length < 10
                    ? 'border-yellow-500 focus:ring-yellow-500'
                    : 'border-gray-300 focus:ring-black/10'
                } bg-gray-50 text-sm text-gray-900
                focus:outline-none focus:ring-2 focus:border-black transition resize-none`}
                disabled={loading}
                maxLength={500}
              />
              <div className="flex justify-between items-center mt-1 text-xs">
                <span className={formData.message.length < 10 ? 'text-yellow-600' : 'text-gray-500'}>
                  {formData.message.length < 10 
                    ? `${10 - formData.message.length} more characters needed`
                    : '✓ Message length ok'}
                </span>
                <span className="text-gray-400">
                  {formData.message.length}/500
                </span>
              </div>
            </div>
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
                <span>Sending...</span>
              </span>
            ) : (
              "Send Message"
            )}
          </button>

          {/* Additional Info */}
          <div className="text-center text-xs text-gray-400 pt-2 border-t border-gray-200">
            <p>We typically respond within 24-48 hours during business days.</p>
          </div>
        </form>
      </main>

      <Footer />
    </>
  );
}