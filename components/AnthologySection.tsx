"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { prefersReducedMotion, isMobile } from "@/lib/utils";

interface Project {
  title: string;
  subtitle: string;
  description: string;
  image: string;
}

const PROJECTS: Project[] = [
  {
    title: "Villas",
    subtitle: "Low, silent, impossible.",
    description: "Horizontal estates that dissolve the border between architecture and landscape.",
    image: "/images/projects/villa-01.webp",
  },
  {
    title: "Towers",
    subtitle: "Vertical estates for those who own the skyline.",
    description: "Monolithic residences that transform height into horizon.",
    image: "/images/projects/tower-01.webp",
  },
  {
    title: "Private Worlds",
    subtitle: "Compounds, islands, realities built from desire.",
    description: "Complete ecosystems of luxury – entire realities engineered for one name.",
    image: "/images/projects/estate-01.webp",
  },
];

export default function AnthologySection() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const imageRefs = useRef<(HTMLDivElement | null)[]>([]);
  const headerSubRef = useRef<HTMLSpanElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const titleWord1Ref = useRef<HTMLSpanElement>(null);
  const titleWord2Ref = useRef<HTMLSpanElement>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;

    const section = sectionRef.current;
    const track = trackRef.current;
    if (!section || !track) return;

    const mobile = isMobile();
    if (mobile) return;

    const ctx = gsap.context(() => {
      gsap.to([headerSubRef.current, titleWord1Ref.current, titleWord2Ref.current], {
        y: 0,
        opacity: 1,
        duration: 1.2,
        stagger: 0.15,
        ease: "power4.out",
        scrollTrigger: {
          trigger: section,
          start: "top 75%",
        },
      });

      gsap.to(lineRef.current, {
        width: "80px",
        duration: 1.2,
        ease: "power3.out",
        scrollTrigger: {
          trigger: section,
          start: "top 75%",
        },
      });

      const totalScroll = track.scrollWidth - window.innerWidth;

      const scrollTween = gsap.to(track, {
        x: -totalScroll,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: `+=${totalScroll}`,
          pin: true,
          scrub: 1,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      imageRefs.current.forEach((imgWrap) => {
        if (!imgWrap) return;
        gsap.fromTo(
          imgWrap,
          { xPercent: -12 },
          {
            xPercent: 12,
            ease: "none",
            scrollTrigger: {
              trigger: imgWrap,
              start: "left right",
              end: "right left",
              scrub: 1,
              containerAnimation: scrollTween,
            },
          }
        );
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="anthology"
      className="relative overflow-hidden"
      style={{ backgroundColor: "var(--background)" }}
      aria-label="Anthology – Villas, Towers, Worlds"
    >
      {/* Section header */}
      <div className="px-8 md:px-16 pt-16 pb-0">
        <span
          ref={headerSubRef}
          className="uppercase font-medium block opacity-0 translate-y-8"
          style={{ fontSize: "0.85rem", letterSpacing: "0.3em", color: "var(--champagne)" }}
        >
          Anthology
        </span>
        <div ref={lineRef} className="w-0 h-[1px] mt-4 mb-6" style={{ backgroundColor: "var(--champagne)", opacity: 0.4 }} />

        <h2 className="flex flex-col relative z-10">
          <span
            ref={titleWord1Ref}
            className="font-display opacity-0 translate-y-16"
            style={{
              fontSize: "clamp(4rem, 9vw, 9rem)",
              lineHeight: 0.8,
              letterSpacing: "-0.04em",
              fontWeight: 700,
              color: "var(--ink)",
            }}
          >
            WORLDS
          </span>
          <span
            ref={titleWord2Ref}
            className="font-editorial opacity-0 translate-y-16 md:pl-[12vw] relative z-20"
            style={{
              fontSize: "clamp(4.5rem, 10vw, 11rem)",
              lineHeight: 0.7,
              marginTop: "-0.32em",
              letterSpacing: "-0.02em",
              fontWeight: 400,
              fontStyle: "italic",
              color: "#8c7a5e",
            }}
          >
            we shape.
          </span>
        </h2>
      </div>

      {/* Desktop: Horizontal scroll */}
      <div className="hidden md:block">
        <div
          ref={trackRef}
          className="flex gap-6 pl-16 pr-[40vw] pb-8 pt-4 will-change-transform"
          style={{ width: "fit-content" }}
        >
          {PROJECTS.map((project, i) => (
            <article
              key={project.title}
              className="relative flex-shrink-0 rounded-2xl overflow-hidden cursor-pointer group"
              style={{ width: "70vw", maxWidth: "1100px", height: "55vh" }}
              onMouseEnter={() => setHoveredIndex(i)}
              onMouseLeave={() => setHoveredIndex(null)}
              aria-label={`${project.title} – ${project.subtitle}`}
            >
              {/* Image with parallax */}
              <div className="absolute inset-0 overflow-hidden">
                <div
                  ref={(el) => {
                    imageRefs.current[i] = el;
                  }}
                  className="absolute will-change-transform"
                  style={{ inset: "-15%", width: "130%", height: "130%" }}
                >
                  <div
                    className="w-full h-full transition-transform duration-[1.2s] ease-[cubic-bezier(0.25,0.1,0.25,1)]"
                    style={{ transform: hoveredIndex === i ? "scale(1.05)" : "scale(1)" }}
                  >
                    <Image
                      src={project.image}
                      alt={`${project.title} project`}
                      fill
                      className="object-cover"
                      sizes="(max-width: 1100px) 70vw, 1100px"
                    />
                  </div>
                </div>
              </div>

              {/* Dark overlay */}
              <div
                className="absolute inset-0 transition-opacity duration-700"
                style={{
                  background: "linear-gradient(180deg, rgba(23,19,15,0.1) 0%, rgba(23,19,15,0.15) 40%, rgba(23,19,15,0.55) 100%)",
                }}
              />

              {/* Content */}
              <div className="absolute bottom-0 left-0 right-0 p-10 md:p-14 z-10">
                <span
                  className="block mb-4 uppercase font-medium"
                  style={{ fontSize: "0.85rem", letterSpacing: "0.4em", color: "var(--champagne)" }}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>

                <h3
                  className="font-display mb-4"
                  style={{
                    fontSize: "clamp(4rem, 8vw, 9rem)",
                    lineHeight: 0.85,
                    letterSpacing: "-0.04em",
                    fontWeight: 700,
                    color: "var(--cloud)",
                    textShadow: "0 4px 40px rgba(0,0,0,0.6)",
                  }}
                >
                  {project.title}
                </h3>

                <p
                  className="max-w-xl"
                  style={{ fontSize: "1.25rem", lineHeight: 1.4, color: "rgba(255,255,255,0.85)" }}
                >
                  {project.subtitle}
                </p>

                {/* Hover description */}
                <div
                  className="overflow-hidden transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
                  style={{
                    maxHeight: hoveredIndex === i ? "120px" : "0px",
                    opacity: hoveredIndex === i ? 1 : 0,
                    marginTop: hoveredIndex === i ? "16px" : "0px",
                  }}
                >
                  <p className="max-w-xl" style={{ fontSize: "1.05rem", lineHeight: 1.6, color: "rgba(255,255,255,0.65)" }}>
                    {project.description}
                  </p>
                </div>
              </div>

              {/* Corner accent */}
              <div
                className="absolute top-8 right-8 w-7 h-7 transition-all duration-500"
                style={{
                  borderTop: `1px solid ${hoveredIndex === i ? "var(--champagne)" : "rgba(255,255,255,0.2)"}`,
                  borderRight: `1px solid ${hoveredIndex === i ? "var(--champagne)" : "rgba(255,255,255,0.2)"}`,
                }}
                aria-hidden="true"
              />
            </article>
          ))}
        </div>
      </div>

      {/* Mobile: Vertical cards */}
      <div className="md:hidden px-6 pb-20 space-y-6">
        {PROJECTS.map((project, i) => (
          <article
            key={project.title}
            className="relative w-full rounded-2xl overflow-hidden"
            style={{ height: "55vh" }}
            aria-label={`${project.title} – ${project.subtitle}`}
          >
            <div className="absolute inset-0 w-full h-full transition-transform duration-[1.5s] ease-out group-hover:scale-105">
              <Image
                src={project.image}
                alt={`${project.title} project`}
                fill
                className="object-cover"
                sizes="100vw"
              />
            </div>
            <div
              className="absolute inset-0"
              style={{
                background: "linear-gradient(180deg, transparent 40%, rgba(23,19,15,0.6) 100%)",
              }}
            />
            <div className="absolute bottom-0 left-0 right-0 p-8 z-10">
              <span
                className="block mb-3 uppercase font-medium"
                style={{ fontSize: "0.75rem", letterSpacing: "0.3em", color: "var(--champagne)" }}
              >
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3
                className="font-display mb-3"
                style={{
                  fontSize: "3.5rem",
                  lineHeight: 0.9,
                  letterSpacing: "-0.04em",
                  fontWeight: 700,
                  color: "var(--cloud)",
                }}
              >
                {project.title}
              </h3>
              <p style={{ fontSize: "1.1rem", lineHeight: 1.4, color: "rgba(255,255,255,0.8)" }}>
                {project.subtitle}
              </p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
