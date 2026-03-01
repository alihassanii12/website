"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import Link from "next/link";
import SupportSection from "./Support";
import Footer from "./Footer";

gsap.registerPlugin(ScrollTrigger);

export default function Hero() {
  const headingRef = useRef<HTMLHeadingElement | null>(null);
  const buttonRef = useRef<HTMLDivElement | null>(null);
  const personalRef = useRef<HTMLDivElement | null>(null);

  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const personalItemsRef = useRef<(HTMLDivElement | null)[]>([]);

  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // GSAP animations
  useLayoutEffect(() => {
    if (!headingRef.current) return;

    const cards = cardsRef.current.filter(Boolean) as HTMLDivElement[];
    const personalItems = personalItemsRef.current.filter(Boolean) as HTMLDivElement[];
    if (!cards.length) return;

    const ctx = gsap.context(() => {
      // INITIAL STATES
      gsap.set(headingRef.current, { opacity: 0, y: 40 });
      gsap.set(cards, { opacity: 0, y: 60, scale: 0.85 });
      gsap.set(buttonRef.current, { opacity: 0, y: 30 });
      gsap.set(personalItems, { opacity: 0, y: 50 });

      // HERO TEXT
      gsap.to(headingRef.current, {
        opacity: 1,
        y: 0,
        duration: 1.5,
        ease: "power4.out",
        scrollTrigger: {
          trigger: headingRef.current,
          start: "top 80%",
        },
      });

      // CARDS APPEAR
      gsap.to(cards, {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 1.2,
        stagger: 0.15,
        ease: "power4.out",
        scrollTrigger: {
          trigger: headingRef.current,
          start: "top 75%",
        },
      });

      // FAN EFFECT
      const centerIndex = Math.floor(cards.length / 2);
      const spacing = isMobile ? 60 : 120;
      const rotation = isMobile ? 4 : 6;

      gsap.to(cards, {
        x: i => (i - centerIndex) * spacing,
        rotate: i => (i - centerIndex) * rotation,
        duration: 1,
        ease: "power2.out",
        scrollTrigger: {
          trigger: headingRef.current,
          start: "top 75%",
        },
      });

      // BUTTON
      if (buttonRef.current) {
        gsap.to(buttonRef.current, {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: cards[0],
            start: "top 80%",
          },
        });
      }

      // PERSONAL ITEMS
      if (personalItems.length && personalRef.current) {
        gsap.to(personalItems, {
          opacity: 1,
          y: 0,
          duration: 1,
          stagger: 0.3,
          ease: "power3.out",
          scrollTrigger: {
            trigger: personalRef.current,
            start: "top 75%",
          },
        });
      }
    });

    ScrollTrigger.refresh();

    return () => ctx.revert();
  }, [isMobile]);

  // Images
  const images = isMobile
    ? ["/image1.jpg", "/image2.jpg", "/image3.jpg"]
    : [
        "/image1.jpg",
        "/image2.jpg",
        "/image3.jpg",
        "/image4.jpg",
        "/image5.jpg",
        "/image6.jpg",
      ];

  // Helper for array refs
  const setArrayRef =
    <T extends HTMLElement>(
      refArray: React.MutableRefObject<(T | null)[]>,
      index: number
    ) =>
    (el: T | null) => {
      refArray.current[index] = el;
    };

  return (
    <>
      {/* ================= HERO ================= */}
      <section className="pt-24 pb-24 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h1
            ref={headingRef}
            className="font-heading text-4xl md:text-6xl font-bold tracking-tight text-gray-900 leading-tight"
          >
            Preserve your <br />
            <span className="text-blue-500">precious memories</span>{" "}
            effortlessly.
          </h1>

          {/* Image Fan */}
          <div className="relative mt-16 h-56 md:h-64 flex justify-center items-center">
            {images.map((src, i) => (
              <div
                key={i}
                ref={setArrayRef(cardsRef, i)}
                className="absolute w-36 md:w-44 h-52 md:h-60 rounded-2xl overflow-hidden shadow-2xl bg-white"
              >
                <Image src={src} alt="" fill className="object-cover" />
              </div>
            ))}
          </div>

          <div ref={buttonRef} className="mt-10">
            <Link
              href="/register"
              className="inline-block px-10 py-4 rounded-full
                         bg-black text-white font-medium
                         hover:bg-gray-800 transition"
            >
              Start Your Collection
            </Link>
          </div>
        </div>
      </section>

      {/* ================= PERSONAL MEMORY ================= */}
      <section ref={personalRef} className="py-32 bg-white">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-24 items-center">
          <div>
            <h2 className="font-heading text-4xl md:text-5xl font-semibold text-gray-900">
              Turn every <span className="text-blue-500">photo</span> into a{" "}
              <span className="text-blue-500">treasured story</span>.
            </h2>
            <p className="font-body mt-6 text-lg text-gray-600">
              Your memories stay safe, private, and beautifully organized.
            </p>
          </div>

          <div className="relative space-y-16">
            {[
              { title: "Organize Instantly", desc: "Group your photos into albums easily." },
              { title: "Find Memories Fast", desc: "Search instantly with tags or dates." },
              { title: "Private & Secure", desc: "Only you can access your memories." },
            ].map((item, i) => (
              <div
                key={i}
                ref={setArrayRef(personalItemsRef, i)}
                className="relative pl-10"
              >
                <div className="absolute left-0 top-2 w-0.5 h-full bg-gray-200" />
                <div className="absolute left-1.5 top-2 w-3 h-3 bg-black rounded-full" />
                <h3 className="font-heading text-xl font-semibold text-gray-900">
                  {item.title}
                </h3>
                <p className="font-body mt-3 text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= ABOUT ================= */}
      <section className="py-16 bg-linear-to-b from-white to-gray-50">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <div className="relative rounded-3xl p-12 md:p-16 bg-white/40 backdrop-blur-xl shadow-[0_20px_60px_rgba(0,0,0,0.06)]">
            <h2 className="font-heading text-4xl md:text-5xl font-semibold text-gray-900">
              About <span className="text-blue-500">ImageLibrary</span>
            </h2>
            <p className="font-body mt-6 text-lg text-gray-600 max-w-3xl mx-auto">
              ImageLibrary helps you store and relive your memories beautifully and securely.
            </p>
            <div className="mt-10">
              <Link
                href="/about"
                className="inline-flex px-10 py-4 rounded-full bg-black/80 text-white hover:bg-black transition"
              >
                Learn More About Us →
              </Link>
            </div>
          </div>
        </div>
      </section>

      <SupportSection />
      <Footer />
    </>
  );
}