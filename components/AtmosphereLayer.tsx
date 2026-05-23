"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

interface AtmosphereLayerProps {
  type: "dust" | "fog" | "lightLeak" | "sunPass" | "bloom";
  opacity?: number;
  speed?: number;
  blendMode?: string;
  className?: string;
}

export default function AtmosphereLayer({
  type,
  opacity = 0.3,
  speed = 1,
  blendMode = "screen",
  className,
}: AtmosphereLayerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const isVisibleRef = useRef(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;

    const observer = new IntersectionObserver(
      ([entry]) => { isVisibleRef.current = entry.isIntersecting; },
      { threshold: 0.01 }
    );
    observer.observe(canvas);

    const SCALE = 0.25;
    let width = Math.floor(canvas.offsetWidth * SCALE);
    let height = Math.floor(canvas.offsetHeight * SCALE);
    canvas.width = width;
    canvas.height = height;

    interface Particle {
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      opacity: number;
      fadeDir: number;
    }

    const particles: Particle[] = [];
    const count = type === "dust" ? 20 : type === "fog" ? 5 : 8;

    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: type === "dust" ? Math.random() * 1 + 0.3 : type === "fog" ? Math.random() * 50 + 25 : Math.random() * 15 + 5,
        speedX: (Math.random() - 0.5) * 0.15 * speed,
        speedY: type === "dust" ? -Math.random() * 0.1 * speed : (Math.random() - 0.5) * 0.05 * speed,
        opacity: Math.random() * 0.5,
        fadeDir: Math.random() > 0.5 ? 1 : -1,
      });
    }

    const getColor = () => {
      switch (type) {
        case "dust": return "200, 169, 106";
        case "fog": return "237, 227, 210";
        case "lightLeak": return "200, 169, 106";
        case "sunPass": return "245, 239, 228";
        case "bloom": return "255, 248, 238";
        default: return "200, 169, 106";
      }
    };

    const color = getColor();
    let frameCount = 0;

    function animate() {
      if (!isVisibleRef.current) {
        animRef.current = requestAnimationFrame(animate);
        return;
      }

      frameCount++;
      if (frameCount % 3 !== 0) {
        animRef.current = requestAnimationFrame(animate);
        return;
      }

      ctx!.clearRect(0, 0, width, height);

      particles.forEach((p) => {
        p.x += p.speedX;
        p.y += p.speedY;
        p.opacity += p.fadeDir * 0.002;

        if (p.opacity > 0.6) p.fadeDir = -1;
        if (p.opacity < 0.05) p.fadeDir = 1;

        if (p.x > width + p.size) p.x = -p.size;
        if (p.x < -p.size) p.x = width + p.size;
        if (p.y > height + p.size) p.y = -p.size;
        if (p.y < -p.size) p.y = height + p.size;

        if (type === "dust") {
          ctx!.beginPath();
          ctx!.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx!.fillStyle = `rgba(${color}, ${p.opacity})`;
          ctx!.fill();
        } else {
          const gradient = ctx!.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size);
          gradient.addColorStop(0, `rgba(${color}, ${p.opacity * 0.4})`);
          gradient.addColorStop(1, `rgba(${color}, 0)`);
          ctx!.fillStyle = gradient;
          ctx!.fillRect(p.x - p.size, p.y - p.size, p.size * 2, p.size * 2);
        }
      });

      animRef.current = requestAnimationFrame(animate);
    }

    animate();

    const handleResize = () => {
      width = Math.floor(canvas.offsetWidth * SCALE);
      height = Math.floor(canvas.offsetHeight * SCALE);
      canvas.width = width;
      canvas.height = height;
    };

    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animRef.current);
      observer.disconnect();
      window.removeEventListener("resize", handleResize);
    };
  }, [type, speed]);

  return (
    <canvas
      ref={canvasRef}
      className={cn("absolute inset-0 w-full h-full pointer-events-none", className)}
      style={{
        opacity,
        mixBlendMode: blendMode as React.CSSProperties["mixBlendMode"],
        imageRendering: "auto",
      }}
      aria-hidden="true"
    />
  );
}
