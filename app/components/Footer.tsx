"use client";

import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-black text-gray-300">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid md:grid-cols-4 gap-12">
          {/* LOGO / BRAND */}
          <div className="md:col-span-1">
            <h3 className="font-heading text-2xl font-semibold text-white">
              ImageLibrary
            </h3>
            <p className="mt-4 text-sm text-gray-400 leading-relaxed">
              Store, organize, and relive your memories effortlessly.
              Your moments, always safe and beautifully arranged.
            </p>
          </div>

          {/* PRODUCT & COMPANY - Side by side on mobile */}
          <div className="md:col-span-2 grid grid-cols-2 gap-8">
            {/* PRODUCT */}
            <div>
              <h4 className="text-white font-medium mb-4">Product</h4>
              <ul className="space-y-3 text-sm">
                <li>
                  <Link href="/features" className="hover:text-white transition">
                    Features
                  </Link>
                </li>
                <li>
                  <Link href="/pricing" className="hover:text-white transition">
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link href="/security" className="hover:text-white transition">
                    Security
                  </Link>
                </li>
              </ul>
            </div>

            {/* COMPANY */}
            <div>
              <h4 className="text-white font-medium mb-4">Company</h4>
              <ul className="space-y-3 text-sm">
                <li>
                  <Link href="/about" className="hover:text-white transition">
                    About
                  </Link>
                </li>
                <li>
                  <Link href="/support" className="hover:text-white transition">
                    Support
                  </Link>
                </li>
                <li>
                  <Link href="/privacy" className="hover:text-white transition">
                    Privacy Policy
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* CONTACT */}
          <div className="md:col-span-1">
            <h4 className="text-white font-medium mb-4">Contact</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2">
                <span>📧</span>
                <a href="mailto:support@imagelibrary.com" className="hover:text-white transition">
                  support@imagelibrary.com
                </a>
              </li>
              <li className="flex items-center gap-2">
                <span>🌍</span>
                <span>Worldwide</span>
              </li>
            </ul>
          </div>
        </div>

        {/* DIVIDER */}
        <div className="border-t border-gray-800 mt-12 pt-6 flex flex-col md:flex-row justify-between items-center text-sm">
          <p className="text-gray-500">
            © {new Date().getFullYear()} ImageLibrary. All rights reserved.
          </p>

          <div className="flex gap-6 mt-4 md:mt-0">
            <Link href="/terms" className="hover:text-white transition">
              Terms
            </Link>
            <Link href="/privacy" className="hover:text-white transition">
              Privacy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}