"use client";

import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

// ==================== API CONFIGURATION ====================
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

// Configure axios defaults
axios.defaults.withCredentials = true;
axios.defaults.timeout = 30000;

export default function SupportSection() {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.name || !form.email || !form.message) {
      toast.error("All fields are required");
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(
        `${API_BASE_URL}/support`,
        form,
        { withCredentials: true }
      );

      toast.success(response.data?.message || "Support request sent successfully ✅");

      // Clear form after successful submission
      setForm({ name: "", email: "", message: "" });
    } catch (err: any) {
      console.error("Support request error:", err);
      
      // Handle specific error cases
      if (err.response?.status === 429) {
        toast.error("Too many requests. Please try again later.");
      } else if (err.response?.status === 400) {
        toast.error(err.response?.data?.message || "Invalid form data");
      } else {
        toast.error(
          err?.response?.data?.message || "Failed to send support request ❌"
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-24 bg-white">
      <div className="max-w-4xl mx-auto px-6">
        <div className="relative rounded-3xl p-10 md:p-14 bg-white shadow-[0_20px_60px_rgba(0,0,0,0.08)]">
          <h2 className="font-heading text-4xl md:text-5xl font-semibold text-gray-900 text-center">
            Need <span className="text-blue-500">Help?</span>
          </h2>

          <p className="font-body mt-4 text-center text-gray-600 text-lg">
            Have a question or facing an issue? Our support team is here to help.
          </p>

          <form onSubmit={handleSubmit} className="mt-10 space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Your Name"
                className="w-full px-5 py-3 rounded-xl border border-gray-300 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                disabled={loading}
              />

              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Email Address"
                className="w-full px-5 py-3 rounded-xl border border-gray-300 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                disabled={loading}
              />
            </div>

            <textarea
              name="message"
              value={form.message}
              onChange={handleChange}
              rows={5}
              placeholder="Describe your issue or question..."
              className="w-full px-5 py-3 rounded-xl border border-gray-300 bg-gray-50 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              disabled={loading}
            />

            <div className="text-center pt-4">
              <button
                type="submit"
                disabled={loading}
                className="px-10 py-4 rounded-full bg-black text-white font-medium
                           hover:bg-gray-800 transition transform hover:scale-105 active:scale-95
                           disabled:bg-gray-400 disabled:cursor-not-allowed disabled:hover:scale-100
                           shadow-lg hover:shadow-xl"
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
                  "Submit Support Request"
                )}
              </button>
            </div>
          </form>

          {/* Additional support info */}
          <div className="mt-8 pt-6 border-t border-gray-200 text-center text-sm text-gray-500">
            <p>We typically respond within 24-48 hours during business days.</p>
          </div>
        </div>
      </div>
    </section>
  );
}