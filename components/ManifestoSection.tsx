"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/utils";

const MANIFESTO_STATEMENTS = [
  { text: "We build for people who have seen everything.", highlight: false },
  { text: "And still expect to be moved.", highlight: false },
  { text: "A villa. A tower. A private horizon.", highlight: true },
  { text: "Every AUREON structure begins as an impossibility.", highlight: false },
  { text: "Then becomes addressable.", highlight: true },
];

export default function ManifestoSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;

    const section = sectionRef.current;
    const wrapper = wrapperRef.current;
    if (!section || !wrapper) return;

    const ctx = gsap.context(() => {
      const elements = gsap.utils.toArray<HTMLElement>(".manifesto-word", section);
      if (elements.length === 0) return;

      const tlDuration = 100;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "+=300%",
          pin: true,
          scrub: 1,
          anticipatePin: 1,
        },
      });

      tl.fromTo(
        wrapper,
        { y: "15vh" },
        { y: "-15vh", ease: "none", duration: tlDuration },
        0
      );

      elements.forEach((el, index) => {
        const startOffset = (index / elements.length) * (tlDuration * 0.7);
        const duration = tlDuration * 0.15;

        tl.fromTo(
          el,
          { opacity: 0.05, scale: 0.85, y: 30 },
          { opacity: 1, scale: 1, y: 0, duration: duration, ease: "power2.out" },
          startOffset
        );

        tl.to(
          el,
          { opacity: 0.05, scale: 0.95, y: -30, duration: duration, ease: "power2.in" },
          startOffset + duration + (tlDuration * 0.05)
        );
      });
    }, section);

    return () => {
      ctx.revert();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="manifesto"
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden"
      style={{ backgroundColor: "var(--surface)" }}
      aria-label="Manifesto – What We Build"
    >
      {/* Static ambient glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(circle 800px at 50% 50%, rgba(200,169,106,0.1) 0%, transparent 60%)",
        }}
        aria-hidden="true"
      />

      {/* Section label */}
      <div className="absolute top-16 left-1/2 -translate-x-1/2 z-20">
        <span
          className="uppercase font-medium block text-center"
          style={{
            fontSize: "0.6875rem",
            letterSpacing: "0.2em",
            color: "var(--muted-ink)",
            opacity: 0.6,
          }}
        >
          What We Build
        </span>
        <div className="w-8 h-[1px] mx-auto mt-3" style={{ backgroundColor: "var(--champagne)", opacity: 0.5 }} />
      </div>

      {/* Manifesto lines */}
      <div className="relative z-10 w-full max-w-6xl mx-auto px-6 md:px-16" style={{ perspective: "1200px" }}>
        <div ref={wrapperRef} className="flex flex-col gap-12 md:gap-24 items-center text-center will-change-transform" style={{ transformStyle: "preserve-3d" }}>
          {MANIFESTO_STATEMENTS.map((item, itemIdx) => {
            const words = item.text.split(" ");
            return (
              <div key={itemIdx} className="flex flex-wrap justify-center gap-x-[0.3em] gap-y-2">
                {words.map((word, wordIdx) => {
                  return (
                    <span
                      key={wordIdx}
                      className={`manifesto-word inline-block will-change-transform ${item.highlight ? "font-editorial" : "font-display"}`}
                      style={{
                        fontSize: item.highlight ? "clamp(3rem, 7vw, 6.5rem)" : "clamp(1.5rem, 3.5vw, 2.5rem)",
                        lineHeight: 1.1,
                        letterSpacing: item.highlight ? "-0.04em" : "0.1em",
                        fontWeight: item.highlight ? 400 : 500,
                        fontStyle: item.highlight ? "italic" : "normal",
                        color: item.highlight ? "var(--champagne)" : "var(--ink)",
                        textTransform: item.highlight ? "none" : "uppercase",
                        textShadow: item.highlight ? "0 4px 30px rgba(200,169,106,0.3)" : "none",
                      }}
                    >
                      {word}
                    </span>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom line */}
      <div
        className="absolute bottom-12 left-1/2 -translate-x-1/2 w-12 h-[1px] z-20"
        style={{ backgroundColor: "var(--stone)", opacity: 0.25 }}
        aria-hidden="true"
      />
    </section>
  );
}
