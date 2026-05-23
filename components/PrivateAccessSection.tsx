"use client";

import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

export default function PrivateAccessSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      setMousePos({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener("mousemove", handleMouseMove);
      container.addEventListener("mouseenter", () => setIsHovering(true));
      container.addEventListener("mouseleave", () => setIsHovering(false));
    }

    return () => {
      if (container) {
        container.removeEventListener("mousemove", handleMouseMove);
        container.removeEventListener("mouseenter", () => setIsHovering(true));
        container.removeEventListener("mouseleave", () => setIsHovering(false));
      }
    };
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative w-full h-[80vh] md:h-screen bg-[#050505] overflow-hidden flex items-center justify-center cursor-none group"
    >
      {/* Base Dark/Blurred Image */}
      <div className="absolute inset-0 w-full h-full opacity-40">
        <Image
          src="/images/private-mansion.png"
          alt="Exclusive Estate"
          fill
          className="object-cover blur-sm scale-105"
        />
        <div className="absolute inset-0 bg-black/60" />
      </div>

      {/* Spotlight Reveal (Masked Image) */}
      <div
        className="absolute inset-0 w-full h-full opacity-100 transition-opacity duration-300"
        style={{
          opacity: isHovering ? 1 : 0,
          maskImage: `radial-gradient(circle 300px at ${mousePos.x}px ${mousePos.y}px, black 0%, transparent 100%)`,
          WebkitMaskImage: `radial-gradient(circle 300px at ${mousePos.x}px ${mousePos.y}px, black 0%, transparent 100%)`,
        }}
      >
        <Image
          src="/images/private-mansion.png"
          alt="Exclusive Estate Clear"
          fill
          className="object-cover"
        />
        {/* Actual Flashlight Glow */}
        <div
          className="absolute inset-0 pointer-events-none mix-blend-overlay"
          style={{
            background: `radial-gradient(circle 300px at ${mousePos.x}px ${mousePos.y}px, rgba(255,255,255,0.6) 0%, transparent 100%)`,
          }}
        />
      </div>

      {/* Custom Spotlight Cursor Ring */}
      <div
        className={cn(
          "absolute pointer-events-none rounded-full border border-white/30 transition-opacity duration-300 z-50",
          isHovering ? "opacity-100" : "opacity-0"
        )}
        style={{
          width: "600px",
          height: "600px",
          left: mousePos.x - 300,
          top: mousePos.y - 300,
        }}
      />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center text-center px-6 max-w-4xl pointer-events-none">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-[1px] bg-[var(--bronze)]" />
          <span className="font-display text-xs tracking-[0.3em] uppercase text-[var(--bronze)]">
            Off-Market Portfolio
          </span>
          <div className="w-12 h-[1px] bg-[var(--bronze)]" />
        </div>

        <h2 className="font-display font-bold uppercase text-[clamp(2.5rem,5vw,5rem)] leading-[0.9] tracking-tighter text-white mb-6">
          Not all worlds <br /> are public.
        </h2>

        <p className="font-editorial italic text-xl md:text-2xl text-white/70 max-w-2xl mb-12">
          The most extraordinary estates never reach the open market. They are whispered about, traded quietly, and reserved for the few.
        </p>

        {/* Interactive Button */}
        <button className="pointer-events-auto group relative px-8 py-4 overflow-hidden rounded-full bg-white text-black font-display text-sm tracking-widest uppercase transition-transform hover:scale-105 active:scale-95">
          <span className="relative z-10 flex items-center gap-3">
            Request the Key
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="transition-transform group-hover:translate-x-1">
              <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
          {/* Button Hover Fill */}
          <div className="absolute inset-0 bg-[var(--bronze)] translate-y-[100%] group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]" />
        </button>
      </div>
    </section>
  );
}
