"use client";

import { useLayoutEffect, useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

gsap.registerPlugin(ScrollTrigger);

export default function AboutPage() {
  const containerRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (!containerRef.current) return;

    ScrollTrigger.clearScrollMemory();
    ScrollTrigger.refresh();

    const ctx = gsap.context(() => {
      const panels = gsap.utils.toArray<HTMLElement>(".panel");
      if (!panels.length) return;

      const GAP = window.innerHeight * 0.14;

      panels.forEach((panel, i) => {
        if (i !== 0) gsap.set(panel, { y: window.innerHeight });
      });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: () => `+=${window.innerHeight * panels.length}`,
          scrub: 1.4,
          pin: true,
          pinSpacing: true,
          invalidateOnRefresh: true,
        },
      });

      panels.forEach((panel, i) => {
        if (i === 0) return;
        tl.to(panel, { y: GAP, duration: 1, ease: "power1.out" }, i - 1);
      });

      panels.forEach(panel => {
        const h = panel.querySelector("h1, h2");
        const p = panel.querySelector("p");

        if (h) {
          gsap.from(h, {
            opacity: 0,
            y: 40,
            duration: 1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: panel,
              start: "top 70%",
            },
          });
        }

        if (p) {
          gsap.from(p, {
            opacity: 0,
            y: 30,
            duration: 1,
            delay: 0.2,
            ease: "power3.out",
            scrollTrigger: {
              trigger: panel,
              start: "top 65%",
            },
          });
        }
      });
    }, containerRef);

    return () => {
      // 🔥 CRITICAL: kill pins BEFORE React unmounts
      ScrollTrigger.getAll().forEach(st => {
        st.disable(false);
        st.kill(true);
      });

      ctx.revert();
    };
  }, []);

  return (
    <>
      <Navbar />

      <main ref={containerRef} className="relative h-screen overflow-hidden">
        {/* SECTION 1 */}
        <section className="panel absolute inset-0 bg-white text-black flex flex-col justify-start pt-20">
          <div className="max-w-5xl mx-auto px-6">
            <h1 className="text-6xl font-light">
              Image<span className="text-blue-500">Library</span>
            </h1>
            <p className="mt-6 text-xl text-gray-600 max-w-3xl leading-relaxed">
              ImageLibrary is a quiet digital space designed to preserve your most
              meaningful memories. It's built to feel calm, intentional, and
              timeless. Here, your photos and moments are given space to breathe.
              Nothing competes for attention. Everything feels considered.
            </p>
          </div>
        </section>

        {/* SECTION 2 */}
        <section className="panel absolute inset-0 bg-black text-white flex flex-col justify-start pt-20">
          <div className="max-w-5xl mx-auto px-6">
            <h2 className="text-5xl font-light">Built to Slow Things Down</h2>
            <p className="mt-5 text-xl text-gray-400 max-w-3xl leading-relaxed">
              The internet moves fast, constantly pulling your attention in every
              direction. ImageLibrary does the opposite. It removes distractions
              and creates a slower, calmer experience. A place where memories are
              revisited with intention, not rushed through.
            </p>
          </div>
        </section>

        {/* SECTION 3 */}
        <section className="panel absolute inset-0 bg-white text-black flex flex-col justify-start pt-20">
          <div className="max-w-5xl mx-auto px-6">
            <h2 className="text-5xl font-light">Less Noise. More Meaning.</h2>
            <p className="mt-5 text-xl text-gray-600 max-w-3xl leading-relaxed">
              Great design should quietly support your experience, not dominate
              it. ImageLibrary focuses on clarity and restraint. Every element
              exists to serve your memories. Nothing flashes, distracts, or pulls
              focus away from what truly matters.
            </p>
          </div>
        </section>

        {/* SECTION 4 */}
        <section className="panel absolute inset-0 bg-black text-white flex flex-col justify-start pt-20">
          <div className="max-w-5xl mx-auto px-6">
            <h2 className="text-5xl font-light">Your Memories Stay Yours</h2>
            <p className="mt-5 text-xl text-gray-400 max-w-3xl leading-relaxed">
              Privacy is not an add-on — it's the foundation. ImageLibrary does
              not track you, analyze your behavior, or sell your data. Everything
              you upload belongs only to you. Your memories remain private, secure,
              and fully under your control.
            </p>
          </div>
        </section>

        {/* SECTION 5 */}
        <section className="panel absolute inset-0 bg-white text-black flex flex-col justify-start pt-20">
          <div className="max-w-5xl mx-auto px-6">
            <h2 className="text-5xl font-light">Preserve What Matters</h2>
            <p className="mt-5 text-xl text-gray-600 max-w-3xl leading-relaxed">
              Not every moment needs to be shared. Some are meant to be kept close.
              ImageLibrary helps you preserve the moments that truly matter to you.
              Organize them thoughtfully and revisit them whenever you want, in a
              space that feels personal and peaceful.
            </p>
          </div>
        </section>

        {/* SECTION 6 */}
        <section className="panel absolute inset-0 bg-black text-white flex flex-col justify-start pt-20">
          <div className="max-w-5xl mx-auto px-6">
            <h2 className="text-5xl font-light">Designed for Simplicity</h2>
            <p className="mt-5 text-xl text-gray-400 max-w-3xl leading-relaxed">
              Every feature inside ImageLibrary has a clear purpose. There is no
              clutter, no unnecessary complexity, and no visual noise. Simplicity
              guides every interaction. The interface stays out of the way so your
              memories can take center stage.
            </p>
          </div>
        </section>

        {/* SECTION 7 */}
        <section className="panel absolute inset-0 bg-white text-black flex flex-col justify-start pt-20">
          <div className="max-w-5xl mx-auto px-6">
            <h2 className="text-5xl font-light">Start Your Journey</h2>
            <p className="mt-5 text-xl text-gray-600 max-w-3xl leading-relaxed">
              ImageLibrary is more than storage — it's a space for reflection.
              A place to return to moments that shaped you. Build a memory library
              that grows with you over time. One that feels calm, meaningful, and
              entirely yours.
            </p>
          </div>
        </section>

        {/* SECTION 8 */}
        <section className="panel absolute inset-0 bg-black text-white flex flex-col justify-center items-center">
          <div className="text-center px-6 max-w-4xl mx-auto">
            <h2 className="text-5xl font-light">
              Ready to Preserve Your Memories?
            </h2>
            <p className="mt-5 text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
              Create a private, secure space for the moments that matter most.
              No noise. No distractions. Just your memories, preserved beautifully
              and intentionally. Start building your ImageLibrary today.
            </p>
            <div className="mt-8">
              <Link
                href="/register"
                className="inline-block px-16 py-4 rounded-full bg-white text-black font-medium hover:scale-105 transition-transform duration-300"
              >
                Get Started
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}