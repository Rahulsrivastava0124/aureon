"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { initLenis, destroyLenis } from "@/lib/lenis";
import CustomCursor from "@/components/CustomCursor";
import Preloader from "@/components/Preloader";
import FloatingNav from "@/components/FloatingNav";
import HeroSection from "@/components/HeroSection";
import ManifestoSection from "@/components/ManifestoSection";
import AnthologySection from "@/components/AnthologySection";
import CraftSection from "@/components/CraftSection";
import SignatureAmenitiesSection from "@/components/SignatureAmenitiesSection";
import ServicesSection from "@/components/ServicesSection";
import PrivateAccessSection from "@/components/PrivateAccessSection";
import FinalCTA from "@/components/FinalCTA";

export default function Home() {
  const mainRef = useRef<HTMLElement>(null);

  useEffect(() => {
    /* Initialize Lenis smooth scroll */
    const lenis = initLenis();
    if (!lenis) return;

    /* Sync Lenis with GSAP ScrollTrigger */
    lenis.on("scroll", ScrollTrigger.update);

    /* Use standard RAF instead of GSAP ticker for perfect Lenis timing */
    let rafId: number;
    function raf(time: number) {
      lenis!.raf(time);
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);

    /* Refresh ScrollTrigger after layout settles */
    const onLoad = () => ScrollTrigger.refresh();
    window.addEventListener("load", onLoad, { once: true });
    const refreshTimeout = setTimeout(() => ScrollTrigger.refresh(), 800);

    return () => {
      cancelAnimationFrame(rafId);
      clearTimeout(refreshTimeout);
      window.removeEventListener("load", onLoad);
      destroyLenis();
    };
  }, []);

  return (
    <>
      <CustomCursor />
      <Preloader />
      <FloatingNav />
      <main ref={mainRef} id="main-content" role="main">
        {/*
          hero-root: creates the scroll canvas for the hero frame animation.
          HeroSection is sticky inside it so it stays pinned at the top
          while the container scrolls.
        */}
        <div id="hero-root" style={{ height: "450vh", position: "relative" }}>
          <HeroSection />
        </div>
        <ManifestoSection />
        <AnthologySection />
        <CraftSection />
        <SignatureAmenitiesSection />
        <ServicesSection />
        <PrivateAccessSection />
        <FinalCTA />
      </main>
    </>
  );
}
