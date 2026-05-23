"use client";

import { useEffect, useRef } from "react";

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number>(0);
  const mouseRef = useRef({ x: 0, y: 0 });
  const cursorPosRef = useRef({ x: 0, y: 0 });
  const dotPosRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) return;

    document.body.style.cursor = "none";

    const cursor = cursorRef.current;
    const dot = dotRef.current;
    if (!cursor || !dot) return;

    const onMouseMove = (e: MouseEvent) => {
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;
    };

    const tick = () => {
      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;

      dotPosRef.current.x += (mx - dotPosRef.current.x) * 0.25;
      dotPosRef.current.y += (my - dotPosRef.current.y) * 0.25;
      dot.style.transform = `translate3d(${dotPosRef.current.x - 3}px, ${dotPosRef.current.y - 3}px, 0)`;

      cursorPosRef.current.x += (mx - cursorPosRef.current.x) * 0.1;
      cursorPosRef.current.y += (my - cursorPosRef.current.y) * 0.1;
      cursor.style.transform = `translate3d(${cursorPosRef.current.x - 16}px, ${cursorPosRef.current.y - 16}px, 0)`;

      rafRef.current = requestAnimationFrame(tick);
    };

    window.addEventListener("mousemove", onMouseMove, { passive: true });
    rafRef.current = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      cancelAnimationFrame(rafRef.current);
      document.body.style.cursor = "auto";
    };
  }, []);

  if (typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches) {
    return null;
  }

  return (
    <>
      <div
        ref={cursorRef}
        className="fixed top-0 left-0 w-8 h-8 border border-white/40 rounded-full pointer-events-none z-[9999] mix-blend-difference will-change-transform"
      />
      <div
        ref={dotRef}
        className="fixed top-0 left-0 w-1.5 h-1.5 bg-white rounded-full pointer-events-none z-[10000] mix-blend-difference will-change-transform"
      />
    </>
  );
}
