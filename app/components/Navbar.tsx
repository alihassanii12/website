"use client";

import { useState } from "react";
import Link from "next/link";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 w-full z-50">
      {/* Glass Nav */}
      <nav
        className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between
        backdrop-blur-xl bg-white/30 shadow-[0_8px_30px_rgba(0,0,0,0.05)]"
      >
        {/* Logo - Icon removed */}
        <Link href="/" className="flex items-center">
          <span className="font-semibold">ImageLibrary</span>
        </Link>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-8 text-sm">
          {["About", "Pricing", "Support"].map((item) => (
            <Link key={item} href={`/${item.toLowerCase()}`}>
              <span className="relative group">
                {item}
                <span className="absolute left-0 -bottom-1 h-0.5 w-full bg-blue-600 scale-x-0 group-hover:scale-x-100 transition origin-left" />
              </span>
            </Link>
          ))}
          <Link
            href="/login"
            className="px-4 py-1.5 rounded-full bg-black/70 text-white backdrop-blur-md hover:bg-black transition"
          >
            Login
          </Link>
        </div>

        {/* Mobile */}
        <button
          className="md:hidden text-xl"
          onClick={() => setOpen(true)}
        >
          ☰
        </button>
      </nav>

      {/* Mobile Menu */}
      {open && (
        <div className="md:hidden fixed inset-0 bg-black/30 backdrop-blur-sm">
          <div className="bg-white/30 backdrop-blur-2xl p-6 rounded-b-3xl">
            <button className="mb-6" onClick={() => setOpen(false)}>✕</button>
            <div className="flex flex-col gap-5 font-medium">
              {["About", "Pricing", "Support"].map((item) => (
                <Link key={item} href={`/${item.toLowerCase()}`}>
                  {item}
                </Link>
              ))}
              <Link
                href="/login"
                className="mt-4 text-center py-2 rounded-full bg-black/70 text-white"
              >
                Login
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}