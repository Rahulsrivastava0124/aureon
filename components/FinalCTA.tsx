"use client";

import { useEffect, useRef, useState } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { motion, AnimatePresence } from "framer-motion";
import { prefersReducedMotion } from "@/lib/utils";
import MagneticButton from "./ui/MagneticButton";
import AtmosphereLayer from "./AtmosphereLayer";
import Image from "next/image";

export default function FinalCTA() {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const copyRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (prefersReducedMotion()) return;

    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      if (headingRef.current) {
        gsap.fromTo(
          headingRef.current,
          { opacity: 0, y: 50 },
          {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: section,
              start: "top 65%",
              toggleActions: "play none none none",
            },
          }
        );
      }

      if (copyRef.current) {
        gsap.fromTo(
          copyRef.current,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            delay: 0.2,
            ease: "power3.out",
            scrollTrigger: {
              trigger: section,
              start: "top 60%",
              toggleActions: "play none none none",
            },
          }
        );
      }

      if (ctaRef.current) {
        gsap.fromTo(
          ctaRef.current,
          { opacity: 0, y: 20 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            delay: 0.5,
            ease: "power3.out",
            scrollTrigger: {
              trigger: section,
              start: "top 55%",
              toggleActions: "play none none none",
            },
          }
        );
      }
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <>
      <section
        ref={sectionRef}
        id="cta"
        className="relative min-h-screen flex items-center justify-center overflow-hidden"
        style={{ backgroundColor: "var(--surface)" }}
        aria-label="Shape Your Estate – Contact"
      >
        {/* Atmospheric layers */}
        <AtmosphereLayer type="dust" opacity={0.12} speed={0.2} />
        <AtmosphereLayer type="bloom" opacity={0.08} speed={0.1} blendMode="soft-light" />

        {/* Warm radial glow */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 60% 50% at 50% 50%, rgba(200,169,106,0.06) 0%, transparent 70%)",
          }}
          aria-hidden="true"
        />

        {/* Content */}
        <div className="relative z-10 max-w-3xl mx-auto px-6 md:px-12 text-center">
          {/* Decorative mark */}
          <div className="mb-12 flex justify-center">
            <Image
              src="/icons/logo-aureon-mark.svg"
              alt=""
              width={40}
              height={40}
              className="opacity-30"
              aria-hidden="true"
            />
          </div>

          <h2
            ref={headingRef}
            className="text-section-title font-display text-[var(--ink)] mb-8"
          >
            Shape your estate
          </h2>

          <div ref={copyRef}>
            <p className="text-section-body text-[var(--muted-ink)] mb-3 max-w-lg mx-auto">
              The impossible is usually a blueprint away.
            </p>
            <p className="text-section-body text-[var(--muted-ink)] mb-3 max-w-lg mx-auto">
              For those who do not want a residence.
            </p>
            <p className="text-section-body text-[var(--muted-ink)] max-w-lg mx-auto font-editorial italic">
              But a world with their name on it.
            </p>
          </div>

          <div ref={ctaRef} className="mt-14 flex flex-col sm:flex-row items-center justify-center gap-6">
            <MagneticButton
              id="cta-primary"
              onClick={() => setIsModalOpen(true)}
              className="bg-[var(--ink)] text-[var(--cloud)] border-[var(--ink)] hover:bg-[var(--bronze)] hover:border-[var(--bronze)]"
            >
              Request a Private Consultation
            </MagneticButton>

            <MagneticButton id="cta-secondary">
              Shape Your Estate
            </MagneticButton>
          </div>
        </div>

        {/* Bottom decoration */}
        <footer className="absolute bottom-8 left-0 right-0 text-center z-10">
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="w-8 h-[1px] bg-[var(--stone)] opacity-30" aria-hidden="true" />
            <Image
              src="/icons/logo-aureon-mark.svg"
              alt=""
              width={16}
              height={16}
              className="opacity-20"
              aria-hidden="true"
            />
            <div className="w-8 h-[1px] bg-[var(--stone)] opacity-30" aria-hidden="true" />
          </div>
          <p className="text-[9px] uppercase tracking-[0.3em] text-[var(--muted-ink)] opacity-40">
            &copy; {new Date().getFullYear()} AUREON – Private Architectural Worlds
          </p>
        </footer>
      </section>

      {/* Consultation Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="fixed inset-0 z-[var(--z-modal)] flex items-center justify-center p-6"
            role="dialog"
            aria-modal="true"
            aria-label="Request a Private Consultation"
          >
            {/* Backdrop */}
            <div
              className="absolute inset-0 bg-[rgba(23,19,15,0.6)] backdrop-blur-sm"
              onClick={() => setIsModalOpen(false)}
              aria-hidden="true"
            />

            {/* Modal content */}
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.97 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-full max-w-lg rounded-2xl p-10 md:p-14"
              style={{ backgroundColor: "var(--surface)" }}
            >
              {/* Close button */}
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute top-6 right-6 w-8 h-8 flex items-center justify-center rounded-full hover:bg-[rgba(138,106,62,0.1)] transition-colors duration-300"
                aria-label="Close consultation form"
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                  <path d="M1 1L13 13M1 13L13 1" stroke="var(--ink)" strokeWidth="1.2" />
                </svg>
              </button>

              <h3 className="text-2xl font-display font-bold text-[var(--ink)] mb-2 tracking-tight">
                Private Consultation
              </h3>
              <p className="text-sm text-[var(--muted-ink)] mb-10">
                Begin shaping your world. Our team responds within 48 hours.
              </p>

              <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
                <div>
                  <label
                    htmlFor="consult-name"
                    className="text-[10px] uppercase tracking-[0.2em] text-[var(--muted-ink)] block mb-2"
                  >
                    Full Name
                  </label>
                  <input
                    id="consult-name"
                    type="text"
                    className="w-full bg-transparent border-b border-[var(--stone)] py-3 text-sm text-[var(--ink)] focus:border-[var(--champagne)] transition-colors duration-300 outline-none"
                    placeholder="Your name"
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="consult-email"
                    className="text-[10px] uppercase tracking-[0.2em] text-[var(--muted-ink)] block mb-2"
                  >
                    Email
                  </label>
                  <input
                    id="consult-email"
                    type="email"
                    className="w-full bg-transparent border-b border-[var(--stone)] py-3 text-sm text-[var(--ink)] focus:border-[var(--champagne)] transition-colors duration-300 outline-none"
                    placeholder="your@email.com"
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="consult-project"
                    className="text-[10px] uppercase tracking-[0.2em] text-[var(--muted-ink)] block mb-2"
                  >
                    Project Vision
                  </label>
                  <textarea
                    id="consult-project"
                    rows={3}
                    className="w-full bg-transparent border-b border-[var(--stone)] py-3 text-sm text-[var(--ink)] focus:border-[var(--champagne)] transition-colors duration-300 outline-none resize-none"
                    placeholder="Describe your impossible vision..."
                  />
                </div>

                <div className="pt-4">
                  <MagneticButton
                    id="consult-submit"
                    className="w-full bg-[var(--ink)] text-[var(--cloud)] border-[var(--ink)] hover:bg-[var(--bronze)] hover:border-[var(--bronze)]"
                  >
                    Begin Conversation
                  </MagneticButton>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
