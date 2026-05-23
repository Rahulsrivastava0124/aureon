"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { gsap } from "@/lib/gsap";

const AMENITIES = [
  {
    id: "sanctuary",
    title: "The Sanctuary",
    subtitle: "Acoustically isolated private wellness spas. Carved from solid basalt.",
    image: "/images/amenities/spa.png",
  },
  {
    id: "gallery",
    title: "The Gallery",
    subtitle: "Climate-controlled subterranean vaults. Designed for the rarest collections.",
    image: "/images/amenities/vault.png",
  },
  {
    id: "horizon",
    title: "The Horizon",
    subtitle: "Zero-edge pools that defy gravity. Dissolving seamlessly into the sky.",
    image: "/images/amenities/pool.png",
  }
];

export default function SignatureAmenitiesSection() {
  const containerRef = useRef<HTMLElement>(null);
  const textRefs = useRef<(HTMLDivElement | null)[]>([]);
  const imageContainersRef = useRef<(HTMLDivElement | null)[]>([]);
  const imagesRef = useRef<(HTMLImageElement | null)[]>([]);
  const progressLineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "+=300%",
          pin: true,
          scrub: 1,
        }
      });

      gsap.set(textRefs.current.slice(1), { autoAlpha: 0, y: 40 });
      gsap.set(imageContainersRef.current.slice(1), { yPercent: 100 });
      gsap.set(imagesRef.current.slice(1), { scale: 1.2, yPercent: -15 });

      AMENITIES.forEach((_, index) => {
        if (index === 0) return;

        const startTime = index;

        tl.to(progressLineRef.current, {
          scaleY: (index + 1) / AMENITIES.length,
          ease: "none",
          duration: 1
        }, startTime - 1);

        tl.to(textRefs.current[index - 1], {
          autoAlpha: 0,
          y: -40,
          duration: 0.8,
          ease: "power2.inOut"
        }, startTime - 0.2);

        tl.to(textRefs.current[index], {
          autoAlpha: 1,
          y: 0,
          duration: 0.8,
          ease: "power2.out"
        }, startTime);

        tl.to(imageContainersRef.current[index], {
          yPercent: 0,
          duration: 1,
          ease: "power3.inOut"
        }, startTime - 0.2);

        tl.to(imagesRef.current[index], {
          scale: 1,
          yPercent: 0,
          duration: 1,
          ease: "power3.inOut"
        }, startTime - 0.2);

        tl.to(imagesRef.current[index - 1], {
          yPercent: 20,
          scale: 1.05,
          duration: 1,
          ease: "power3.inOut"
        }, startTime - 0.2);
      });
    });

    mm.add("(prefers-reduced-motion: reduce)", () => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "+=300%",
          pin: true,
          scrub: 1,
        }
      });

      gsap.set(textRefs.current.slice(1), { autoAlpha: 0 });
      gsap.set(imageContainersRef.current.slice(1), { autoAlpha: 0 });

      AMENITIES.forEach((_, index) => {
        if (index === 0) return;
        const startTime = index;

        tl.to(progressLineRef.current, {
          scaleY: (index + 1) / AMENITIES.length,
          ease: "none",
          duration: 1
        }, startTime - 1);

        tl.to(textRefs.current[index - 1], { autoAlpha: 0, duration: 0.5 }, startTime - 0.2);
        tl.to(textRefs.current[index], { autoAlpha: 1, duration: 0.5 }, startTime);

        tl.to(imageContainersRef.current[index - 1], { autoAlpha: 0, duration: 0.5 }, startTime - 0.2);
        tl.to(imageContainersRef.current[index], { autoAlpha: 1, duration: 0.5 }, startTime);
      });
    });

    return () => mm.revert();
  }, []);

  return (
    <section ref={containerRef} className="w-full h-screen bg-surface text-ink overflow-hidden relative flex flex-col md:flex-row">

      {/* Left Column: Editorial Text */}
      <div className="w-full md:w-5/12 h-[45vh] md:h-full flex flex-col justify-center px-6 md:px-16 lg:px-24 relative z-10">

        {/* Section Label */}
        <div className="absolute top-12 md:top-24 left-6 md:left-16 lg:left-24">
          <p className="text-section-label tracking-widest text-muted-ink uppercase flex items-center gap-4">
            <span className="w-12 h-[1px] bg-stone"></span>
            Signature Features
          </p>
        </div>

        {/* Text Container */}
        <div className="relative w-full h-[240px] md:h-[300px]">
          {AMENITIES.map((amenity, i) => (
            <div
              key={`text-${amenity.id}`}
              ref={(el) => { textRefs.current[i] = el; }}
              className="absolute top-0 left-0 w-full flex flex-col justify-center h-full"
            >
              <div className="flex items-baseline gap-4 mb-6">
                <span className="font-editorial italic text-4xl md:text-5xl text-champagne">
                  0{i + 1}
                </span>
                <h3 className="font-display font-bold uppercase text-[clamp(2.5rem,4vw,4.5rem)] leading-[0.9] tracking-tighter">
                  {amenity.title}
                </h3>
              </div>
              <p className="font-sans text-lg md:text-xl text-muted-ink max-w-[28rem] font-light leading-relaxed">
                {amenity.subtitle}
              </p>
            </div>
          ))}
        </div>

        {/* Progress Timeline UI */}
        <div className="absolute bottom-12 md:bottom-24 left-6 md:left-16 lg:left-24 h-24 md:h-32 flex flex-col">
          <div className="w-[1px] h-full bg-stone/30 relative">
            <div
              ref={progressLineRef}
              className="absolute top-0 left-0 w-full bg-champagne origin-top"
              style={{ transform: `scaleY(${1 / AMENITIES.length})` }}
            />
          </div>
        </div>

      </div>

      {/* Right Column: Parallax Image Gallery */}
      <div className="w-full md:w-7/12 h-[55vh] md:h-full relative overflow-hidden">
        {AMENITIES.map((amenity, i) => (
          <div
            key={`img-${amenity.id}`}
            ref={(el) => { imageContainersRef.current[i] = el; }}
            className="absolute inset-0 w-full h-full overflow-hidden origin-bottom"
            style={{ zIndex: i }}
          >
            <Image
              ref={(el) => { imagesRef.current[i] = el; }}
              src={amenity.image}
              alt={amenity.title}
              fill
              className="object-cover will-change-transform"
              sizes="(max-width: 768px) 100vw, 60vw"
              priority={i === 0}
            />
            <div className="absolute inset-0 bg-gradient-to-l from-transparent to-surface/40 z-10 pointer-events-none hidden md:block"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-surface/20 to-transparent z-10 pointer-events-none md:hidden"></div>
          </div>
        ))}
      </div>
    </section>
  );
}
