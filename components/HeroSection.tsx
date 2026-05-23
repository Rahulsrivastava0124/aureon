"use client";

import { useEffect, useRef, useCallback, useState } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/utils";

/* ── Config ── */
const TOTAL_FRAMES = 240;
const FRAME_PATH = "/hero-frames/ezgif-frame-";
const FRAME_EXT = ".jpg";

const pad = (n: number) => String(n + 1).padStart(3, "0"); // frames start at 001
const frameUrl = (i: number) => `${FRAME_PATH}${pad(i)}${FRAME_EXT}`;

const COPY_SEQUENCE = [
  { text: "AUREON", type: "title" as const, start: 0, end: 15 },
  { text: "Some structures are built.", type: "line" as const, start: 12, end: 26 },
  { text: "Others are summoned.", type: "line" as const, start: 23, end: 36 },
  { text: "Private worlds.", type: "accent" as const, start: 33, end: 46 },
  { text: "Suspended beyond expectation.", type: "line" as const, start: 43, end: 58 },
];

/* ── Cinematic Canvas Fallback (procedural) ── */
function drawCinematicFallback(
  canvas: HTMLCanvasElement,
  progress: number, // 0 to 1 scroll progress
  time: number
) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const w = canvas.width;
  const h = canvas.height;

  // Deep dark architectural background
  ctx.clearRect(0, 0, w, h);

  // Sky gradient that shifts with scroll
  const skyGrad = ctx.createLinearGradient(0, 0, 0, h);
  const t = progress;
  // Transition from deep night → warm dusk → cream morning
  const r1 = Math.round(lerp(8, 180, t));
  const g1 = Math.round(lerp(6, 140, t));
  const b1 = Math.round(lerp(12, 80, t));
  const r2 = Math.round(lerp(20, 245, t));
  const g2 = Math.round(lerp(15, 239, t));
  const b2 = Math.round(lerp(25, 228, t));

  skyGrad.addColorStop(0, `rgb(${r1},${g1},${b1})`);
  skyGrad.addColorStop(1, `rgb(${r2},${g2},${b2})`);
  ctx.fillStyle = skyGrad;
  ctx.fillRect(0, 0, w, h);

  // Stars (fade out as progress increases)
  const starOpacity = Math.max(0, 1 - t * 3);
  if (starOpacity > 0) {
    ctx.fillStyle = `rgba(255,248,230,${starOpacity * 0.8})`;
    const starSeed = 42;
    for (let i = 0; i < 80; i++) {
      const sx = ((starSeed * (i + 1) * 7919) % w);
      const sy = ((starSeed * (i + 1) * 6271) % (h * 0.5));
      const sr = 0.5 + (i % 3) * 0.5;
      ctx.beginPath();
      ctx.arc(sx, sy, sr, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // Mountain silhouettes
  ctx.save();
  const mountainY = h * 0.55 + Math.sin(time * 0.1) * 2;
  const mountainOpacity = 0.85 + t * 0.15;

  // Back mountains
  ctx.fillStyle = `rgba(${Math.round(lerp(15, 120, t))},${Math.round(lerp(12, 100, t))},${Math.round(lerp(18, 70, t))},${mountainOpacity})`;
  ctx.beginPath();
  ctx.moveTo(0, h);
  ctx.lineTo(0, mountainY * 1.1);
  ctx.bezierCurveTo(w * 0.1, mountainY * 0.7, w * 0.2, mountainY * 0.9, w * 0.3, mountainY * 1.05);
  ctx.bezierCurveTo(w * 0.4, mountainY * 0.6, w * 0.5, mountainY * 0.5, w * 0.6, mountainY * 0.75);
  ctx.bezierCurveTo(w * 0.7, mountainY * 0.95, w * 0.8, mountainY * 0.65, w * 0.9, mountainY * 0.9);
  ctx.bezierCurveTo(w * 0.95, mountainY * 1.0, w, mountainY * 0.95, w, mountainY);
  ctx.lineTo(w, h);
  ctx.closePath();
  ctx.fill();

  // Mid mountains
  ctx.fillStyle = `rgba(${Math.round(lerp(20, 140, t))},${Math.round(lerp(16, 115, t))},${Math.round(lerp(24, 82, t))},${mountainOpacity})`;
  ctx.beginPath();
  ctx.moveTo(0, h);
  ctx.lineTo(0, mountainY * 1.2);
  ctx.bezierCurveTo(w * 0.15, mountainY * 0.85, w * 0.25, mountainY * 1.1, w * 0.35, mountainY * 1.2);
  ctx.bezierCurveTo(w * 0.45, mountainY * 0.75, w * 0.55, mountainY * 0.65, w * 0.65, mountainY * 0.9);
  ctx.bezierCurveTo(w * 0.75, mountainY * 1.1, w * 0.85, mountainY * 0.8, w, mountainY * 1.0);
  ctx.lineTo(w, h);
  ctx.closePath();
  ctx.fill();

  // Foreground terrain
  ctx.fillStyle = `rgba(${Math.round(lerp(12, 80, t))},${Math.round(lerp(10, 65, t))},${Math.round(lerp(15, 45, t))},1)`;
  ctx.beginPath();
  ctx.moveTo(0, h);
  ctx.lineTo(0, h * 0.78);
  ctx.bezierCurveTo(w * 0.2, h * 0.72, w * 0.4, h * 0.82, w * 0.5, h * 0.75);
  ctx.bezierCurveTo(w * 0.65, h * 0.68, w * 0.8, h * 0.78, w, h * 0.76);
  ctx.lineTo(w, h);
  ctx.closePath();
  ctx.fill();

  // Architectural structure (villa silhouette)
  const buildOpacity = 0.7 + t * 0.3;
  const buildColor = `rgba(${Math.round(lerp(10, 60, t))},${Math.round(lerp(8, 48, t))},${Math.round(lerp(12, 34, t))},${buildOpacity})`;

  // Main villa body
  const bx = w * 0.35;
  const by = h * 0.55;
  const bw = w * 0.3;
  const bh = h * 0.22;

  ctx.fillStyle = buildColor;
  ctx.fillRect(bx, by, bw, bh);

  // Roof / flat top
  ctx.fillRect(bx - w * 0.02, by - h * 0.02, bw + w * 0.04, h * 0.025);

  // Windows with warm light glow
  const winGlow = `rgba(200,169,106,${0.3 + Math.sin(time * 0.5) * 0.1})`;
  ctx.fillStyle = winGlow;
  const winRows = 3;
  const winCols = 5;
  for (let row = 0; row < winRows; row++) {
    for (let col = 0; col < winCols; col++) {
      const wx = bx + (bw / (winCols + 1)) * (col + 1) - w * 0.012;
      const wy = by + (bh / (winRows + 1)) * (row + 1) - h * 0.015;
      ctx.fillRect(wx, wy, w * 0.024, h * 0.03);
    }
  }

  // Wing structures
  ctx.fillStyle = buildColor;
  ctx.fillRect(bx - bw * 0.4, by + bh * 0.3, bw * 0.4, bh * 0.7);
  ctx.fillRect(bx + bw, by + bh * 0.3, bw * 0.4, bh * 0.7);

  // Pool/reflection
  const poolGrad = ctx.createLinearGradient(bx, h * 0.79, bx + bw, h * 0.85);
  poolGrad.addColorStop(0, `rgba(100,140,180,${0.3 + t * 0.3})`);
  poolGrad.addColorStop(1, `rgba(150,180,200,${0.2 + t * 0.2})`);
  ctx.fillStyle = poolGrad;
  ctx.fillRect(bx + bw * 0.1, h * 0.79, bw * 0.8, h * 0.045);

  // Ambient light from windows
  const glowGrad = ctx.createRadialGradient(w * 0.5, h * 0.6, 0, w * 0.5, h * 0.6, w * 0.25);
  glowGrad.addColorStop(0, `rgba(200,169,106,${0.06 + t * 0.04})`);
  glowGrad.addColorStop(1, "rgba(200,169,106,0)");
  ctx.fillStyle = glowGrad;
  ctx.fillRect(0, 0, w, h);

  // Vignette overlay
  const vigGrad = ctx.createRadialGradient(w * 0.5, h * 0.5, w * 0.2, w * 0.5, h * 0.5, w * 0.85);
  vigGrad.addColorStop(0, "rgba(0,0,0,0)");
  vigGrad.addColorStop(1, `rgba(0,0,0,${0.55 - t * 0.3})`);
  ctx.fillStyle = vigGrad;
  ctx.fillRect(0, 0, w, h);

  ctx.restore();
}

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * Math.min(1, Math.max(0, t));
}

export default function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const bloomRef = useRef<HTMLDivElement>(null);
  const copyRefs = useRef<(HTMLDivElement | null)[]>([]);
  const finalTextRef = useRef<HTMLDivElement>(null);
  const fogRef = useRef<HTMLDivElement>(null);
  const cloudBackRef = useRef<HTMLDivElement>(null);
  const cloudMidRef = useRef<HTMLDivElement>(null);
  const cloudForeRef = useRef<HTMLDivElement>(null);
  const cloudUltraRef = useRef<HTMLDivElement>(null);
  const images = useRef<(HTMLImageElement | null)[]>(new Array(TOTAL_FRAMES).fill(null));
  const currentFrame = useRef(0);
  const scrollProgressRef = useRef(0);
  const animFrameRef = useRef<number>(0);
  const timeRef = useRef(0);
  const hasRealFrames = useRef(false);
  const [loadProgress, setLoadProgress] = useState(0);

  const drawFrame = useCallback((index: number) => {
    const canvas = canvasRef.current;
    const img = images.current[index];
    if (!canvas) return;

    if (img && hasRealFrames.current) {
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const cw = canvas.width;
      const ch = canvas.height;
      const iw = img.naturalWidth;
      const ih = img.naturalHeight;

      const scale = Math.max(cw / iw, ch / ih);
      const sw = iw * scale;
      const sh = ih * scale;
      const sx = (cw - sw) / 2;
      const sy = (ch - sh) / 2;

      ctx.drawImage(img, sx, sy, sw, sh);
    }
    // If no real frames, the procedural animation loop handles drawing
  }, []);

  /* ── Canvas resize + procedural animation + frame preload ── */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      canvas.style.width = "100%";
      canvas.style.height = "100%";
      if (!hasRealFrames.current) {
        drawCinematicFallback(canvas, scrollProgressRef.current, timeRef.current);
      } else {
        drawFrame(currentFrame.current);
      }
    };
    resize();
    window.addEventListener("resize", resize);

    // Procedural animation loop (runs until real frames take over)
    const animate = (ts: number) => {
      timeRef.current = ts * 0.001;
      if (!hasRealFrames.current && canvasRef.current) {
        drawCinematicFallback(canvasRef.current, scrollProgressRef.current, timeRef.current);
      }
      animFrameRef.current = requestAnimationFrame(animate);
    };
    animFrameRef.current = requestAnimationFrame(animate);

    // Try loading real frames (gracefully fails if not present)
    let loadedCount = 0;
    let cancelled = false;

    const loadImage = (index: number): Promise<void> =>
      new Promise((resolve) => {
        if (cancelled || images.current[index]) { resolve(); return; }
        const img = new Image();
        img.onload = () => {
          if (cancelled) { resolve(); return; }
          images.current[index] = img;
          loadedCount++;
          if (!hasRealFrames.current && index === 0) {
            hasRealFrames.current = true;
          }
          const currentProgress = Math.round((loadedCount / TOTAL_FRAMES) * 100);
          setLoadProgress(currentProgress);
          window.dispatchEvent(new CustomEvent("hero-progress", { detail: { percent: currentProgress } }));
          if (index === currentFrame.current && hasRealFrames.current) {
            drawFrame(index);
          }
          resolve();
        };
        img.onerror = () => resolve();
        img.src = frameUrl(index);
      });

    const indices = (step: number) =>
      Array.from({ length: Math.ceil(TOTAL_FRAMES / step) }, (_, k) => k * step);

    const preload = async () => {
      await loadImage(0);
      if (cancelled) return;
      await Promise.all(indices(10).map(loadImage));
      if (cancelled) return;
      await Promise.all(indices(5).map(loadImage));
      if (cancelled) return;
      await Promise.all(indices(2).map(loadImage));
      if (cancelled) return;
      // Load all remaining frames
      await Promise.all(
        Array.from({ length: TOTAL_FRAMES }, (_, k) => k).filter((n) => !images.current[n]).map(loadImage)
      );

      // If no frames loaded (no hero-frames directory), fire 100% immediately
      if (loadedCount === 0) {
        window.dispatchEvent(new CustomEvent("hero-progress", { detail: { percent: 100 } }));
      }
    };

    preload();

    return () => {
      cancelled = true;
      cancelAnimationFrame(animFrameRef.current);
      window.removeEventListener("resize", resize);
    };
  }, [drawFrame]);

  /* ── Scroll-driven animation ── */
  useEffect(() => {
    if (prefersReducedMotion()) return;

    const wrapper = document.getElementById("hero-root");
    const section = sectionRef.current;
    if (!wrapper || !section) return;

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: wrapper,
        start: "top top",
        end: "bottom bottom",
        scrub: true,
        onUpdate: (self) => {
          scrollProgressRef.current = self.progress;

          if (hasRealFrames.current) {
            const frameProgress = self.progress;
            const targetIndex = Math.min(
              Math.floor(frameProgress * (TOTAL_FRAMES - 1)),
              TOTAL_FRAMES - 1
            );

            let bestIndex = targetIndex;
            if (!images.current[targetIndex]) {
              bestIndex = 0;
              for (let offset = 1; offset < TOTAL_FRAMES; offset++) {
                const lo = targetIndex - offset;
                const hi = targetIndex + offset;
                if (lo >= 0 && images.current[lo]) { bestIndex = lo; break; }
                if (hi < TOTAL_FRAMES && images.current[hi]) { bestIndex = hi; break; }
              }
            }

            if (bestIndex !== currentFrame.current) {
              currentFrame.current = bestIndex;
              drawFrame(bestIndex);
            }
          }
        },
      });

      if (bloomRef.current) {
        gsap.fromTo(bloomRef.current,
          { opacity: 0.05 },
          {
            opacity: 0.45,
            ease: "none",
            scrollTrigger: {
              trigger: wrapper,
              start: "top top",
              end: "55% bottom",
              scrub: 1,
            },
          }
        );
      }

      if (cloudBackRef.current && cloudMidRef.current && cloudForeRef.current && cloudUltraRef.current && fogRef.current) {
        const cloudTl = gsap.timeline({
          scrollTrigger: {
            trigger: wrapper,
            start: "55% top",
            end: "95% top",
            scrub: true,
          },
        });

        cloudTl.fromTo(cloudBackRef.current, { y: "100vh", opacity: 0 }, { y: "-150vh", opacity: 0.8, duration: 1.5, ease: "none" }, 0);
        cloudTl.fromTo(cloudMidRef.current, { y: "100vh", opacity: 0 }, { y: "-180vh", opacity: 0.9, duration: 1.5, ease: "none" }, 0.15);
        cloudTl.fromTo(cloudForeRef.current, { y: "110vh", opacity: 0 }, { y: "-220vh", opacity: 1, duration: 1.5, ease: "none" }, 0.3);
        cloudTl.fromTo(cloudUltraRef.current, { y: "120vh", opacity: 0 }, { y: "-260vh", opacity: 1, duration: 1.5, ease: "none" }, 0.45);
        cloudTl.fromTo(fogRef.current, { opacity: 0 }, { opacity: 1, duration: 1, ease: "power2.in" }, 0.8);
      }

      if (finalTextRef.current) {
        gsap.fromTo(
          finalTextRef.current,
          { opacity: 0, y: 80, scale: 0.95 },
          {
            opacity: 1, y: 0, scale: 1, ease: "power3.out",
            scrollTrigger: { trigger: wrapper, start: "75% top", end: "95% top", scrub: true },
          }
        );
      }

      copyRefs.current.forEach((el, i) => {
        if (!el) return;
        const { start, end } = COPY_SEQUENCE[i];
        const tl = gsap.timeline({
          scrollTrigger: { trigger: wrapper, start: `${start}% top`, end: `${end}% top`, scrub: 1 },
        });

        const entries = [
          { rotationX: 10, rotationY: -5 },
          { rotationX: -5, rotationY: 5 },
          { rotationX: 5, rotationY: -10 },
          { rotationX: 0, rotationY: 10 },
          { rotationX: -10, rotationY: 0 },
        ];
        const entry = entries[i % entries.length];

        if (i === 4) {
          tl.fromTo(el, { opacity: 0, z: -1000, x: "20vw", scale: 0.8, ...entry }, { opacity: 1, z: 0, x: 0, scale: 1, rotationX: 0, rotationY: 0, duration: 0.4, ease: "power2.out" });
          tl.to(el, { opacity: 0, z: 800, x: "-100vw", scale: 1.5, rotationY: -30, duration: 0.6, ease: "power2.in" });
        } else {
          tl.fromTo(el, { opacity: 0, z: -1500, scale: 0.6, ...entry }, { opacity: 1, z: 0, scale: 1, rotationX: 0, rotationY: 0, duration: 0.4, ease: "power2.out" });
          tl.to(el, { opacity: 0, z: 1500, scale: 2.5, duration: 0.6, ease: "power2.in" });
        }
      });
    }, section);

    return () => ctx.revert();
  }, [drawFrame]);

  /* ── Page load entrance ── */
  useEffect(() => {
    if (prefersReducedMotion()) return;
    const tl = gsap.timeline({ delay: 2.0 });
    if (overlayRef.current) {
      tl.fromTo(overlayRef.current, { opacity: 0 }, { opacity: 1, duration: 1.6 }, 0);
    }
    if (copyRefs.current[0]) {
      tl.fromTo(
        copyRefs.current[0],
        { opacity: 0, y: 60, scale: 0.88 },
        { opacity: 1, y: 0, scale: 1, duration: 1.4, ease: "power3.out" },
        0.2
      );
    }
  }, []);

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="sticky top-0 w-full h-screen overflow-hidden"
      style={{ zIndex: 10 }}
      aria-label="Hero – Scroll to explore"
    >
      {/* Frame canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" aria-hidden="true" />

      {/* Cinematic vignette */}
      <div
        ref={overlayRef}
        className="absolute inset-0 pointer-events-none z-[2]"
        style={{
          background: `
            linear-gradient(180deg, rgba(23,19,15,0.3) 0%, rgba(23,19,15,0.0) 30%, rgba(23,19,15,0.0) 60%, rgba(23,19,15,0.45) 100%),
            linear-gradient(90deg, rgba(23,19,15,0.2) 0%, transparent 25%, transparent 75%, rgba(23,19,15,0.2) 100%)
          `,
        }}
        aria-hidden="true"
      />

      {/* Golden bloom */}
      <div
        ref={bloomRef}
        className="absolute inset-0 pointer-events-none z-[3]"
        style={{ background: "radial-gradient(ellipse 65% 45% at 50% 25%, rgba(200,169,106,0.18) 0%, transparent 70%)" }}
        aria-hidden="true"
      />

      {/* Dense Fog Layer */}
      <div ref={fogRef} className="absolute inset-0 pointer-events-none z-[4] opacity-0" style={{ background: "#e8e5df" }} aria-hidden="true" />

      {/* Clouds Overlay Container */}
      <div className="absolute inset-0 pointer-events-none z-[5] overflow-visible" style={{ mixBlendMode: "screen" }}>
        <div ref={cloudBackRef} className="absolute inset-0" style={{ mixBlendMode: "screen", filter: "blur(8px)" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/cloud-overlay.png" alt="" className="w-full h-[200vh] object-cover"
            style={{ transform: "scale(1.4)", objectPosition: "center", WebkitMaskImage: "linear-gradient(to bottom, transparent 0%, black 20%, black 80%, transparent 100%)", maskImage: "linear-gradient(to bottom, transparent 0%, black 20%, black 80%, transparent 100%)" }} />
        </div>
        <div ref={cloudMidRef} className="absolute inset-0" style={{ mixBlendMode: "screen", filter: "blur(4px)" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/cloud-overlay.png" alt="" className="w-full h-[200vh] object-cover"
            style={{ transform: "scaleX(-1) scaleY(1.2)", objectPosition: "center", WebkitMaskImage: "linear-gradient(to bottom, transparent 0%, black 20%, black 80%, transparent 100%)", maskImage: "linear-gradient(to bottom, transparent 0%, black 20%, black 80%, transparent 100%)" }} />
        </div>
        <div ref={cloudForeRef} className="absolute inset-0" style={{ mixBlendMode: "screen" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/cloud-overlay.png" alt="" className="w-full h-[200vh] object-cover"
            style={{ transform: "scale(1.1)", objectPosition: "center", WebkitMaskImage: "linear-gradient(to bottom, transparent 0%, black 25%, black 75%, transparent 100%)", maskImage: "linear-gradient(to bottom, transparent 0%, black 25%, black 75%, transparent 100%)" }} />
        </div>
        <div ref={cloudUltraRef} className="absolute inset-0" style={{ mixBlendMode: "screen" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/cloud-overlay.png" alt="" className="w-full h-[200vh] object-cover"
            style={{ transform: "scaleX(-1.3) scaleY(1.3)", objectPosition: "center", WebkitMaskImage: "linear-gradient(to bottom, transparent 0%, black 30%, black 70%, transparent 100%)", maskImage: "linear-gradient(to bottom, transparent 0%, black 30%, black 70%, transparent 100%)" }} />
        </div>
      </div>

      {/* 3D text sequence */}
      <div className="absolute inset-0 flex items-center justify-center z-[5]" style={{ perspective: "1000px" }}>
        <div className="relative w-full max-w-[90vw] text-center" style={{ transformStyle: "preserve-3d" }}>
          {COPY_SEQUENCE.map((item, i) => (
            <div
              key={i}
              ref={(el) => { copyRefs.current[i] = el; }}
              className="absolute inset-0 flex items-center justify-center opacity-0 will-change-transform"
              style={{ backfaceVisibility: "hidden" }}
            >
              {item.type === "title" ? (
                <h1 className="font-display select-none" style={{ fontSize: "clamp(4rem, 13vw, 13rem)", lineHeight: 0.85, letterSpacing: "-0.07em", fontWeight: 700, color: "var(--cloud)", textShadow: "0 4px 60px rgba(0,0,0,0.45), 0 0 120px rgba(200,169,106,0.12)" }}>
                  {item.text}
                </h1>
              ) : item.type === "accent" ? (
                <p className="font-editorial select-none" style={{ fontSize: "clamp(3rem, 7vw, 6.5rem)", lineHeight: 1, letterSpacing: "-0.04em", fontWeight: 400, fontStyle: "italic", color: "var(--champagne)", textShadow: "0 4px 40px rgba(0,0,0,0.8), 0 0 80px rgba(200,169,106,0.4)" }}>
                  {item.text}
                </p>
              ) : (
                <p className="font-display select-none max-w-4xl mx-auto uppercase" style={{ fontSize: "clamp(1rem, 2vw, 1.4rem)", lineHeight: 1.5, letterSpacing: "0.2em", fontWeight: 500, color: "var(--cloud)", textShadow: "0 4px 30px rgba(0,0,0,0.9), 0 0 100px rgba(0,0,0,0.6)" }}>
                  {item.text}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Final Text Block */}
      <div ref={finalTextRef} className="absolute inset-0 flex flex-col items-center justify-center z-[6] opacity-0 pointer-events-none" style={{ perspective: "1400px" }}>
        <div className="text-center px-6 md:px-14 flex flex-col items-center" style={{ transformStyle: "preserve-3d" }}>
          <div className="relative z-10" style={{ lineHeight: 0.85 }}>
            <h2 className="font-display select-none uppercase" style={{ fontSize: "clamp(3.5rem, 11vw, 13rem)", fontWeight: 500, letterSpacing: "-0.03em", color: "#161412" }}>
              Architecture
            </h2>
          </div>
          <div className="relative z-20" style={{ lineHeight: 0.7, marginTop: "-0.25em", marginBottom: "3rem" }}>
            <p className="font-editorial select-none" style={{ fontSize: "clamp(2.5rem, 9.5vw, 11rem)", fontWeight: 400, fontStyle: "italic", letterSpacing: "-0.01em", color: "#9a8566" }}>
              as atmosphere.
            </p>
          </div>
          <div className="relative z-10 opacity-70">
            <p className="font-display select-none mx-auto" style={{ fontSize: "clamp(0.56rem, 0.9vw, 0.75rem)", letterSpacing: "0.2em", textTransform: "uppercase", color: "#161412", maxWidth: "40ch", fontWeight: 500 }}>
              Every material is a conversation between light and intention.
            </p>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-20 left-1/2 -translate-x-1/2 z-[6] flex flex-col items-center gap-3 opacity-80">
        <span className="uppercase font-bold" style={{ fontSize: "0.75rem", letterSpacing: "0.2em", color: "var(--cloud)" }}>
          Scroll to explore
        </span>
        <div className="w-[2px] h-12 relative overflow-hidden bg-white/20" aria-hidden="true">
          <div className="absolute top-0 left-0 w-full h-full bg-white" style={{ animation: "heroScrollPulse 2.4s ease-in-out infinite" }} />
        </div>
      </div>

      <style>{`
        @keyframes heroScrollPulse {
          0%, 100% { transform: scaleY(0.2); opacity: 0.2; transform-origin: top; }
          50% { transform: scaleY(1); opacity: 0.6; transform-origin: top; }
        }
        @media (prefers-reduced-motion: reduce) {
          @keyframes heroScrollPulse { 0%, 100% { opacity: 0.4; } }
        }
      `}</style>
    </section>
  );
}
