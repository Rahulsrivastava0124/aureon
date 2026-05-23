"use client";

import { useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface MagneticButtonProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  strength?: number;
  as?: "button" | "a";
  href?: string;
  id?: string;
}

export default function MagneticButton({
  children,
  className,
  onClick,
  strength = 0.3,
  as = "button",
  href,
  id,
}: MagneticButtonProps) {
  const ref = useRef<HTMLDivElement>(null);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      ref.current.style.transform = `translate(${x * strength}px, ${y * strength}px)`;
    },
    [strength]
  );

  const handleMouseLeave = useCallback(() => {
    if (!ref.current) return;
    ref.current.style.transform = "translate(0px, 0px)";
  }, []);

  const Component = as === "a" ? "a" : "button";

  return (
    <div
      className="magnetic-area"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <motion.div
        ref={ref}
        style={{ transition: "transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)" }}
        whileTap={{ scale: 0.96 }}
      >
        <Component
          id={id}
          className={cn(
            "relative inline-flex items-center justify-center",
            "px-8 py-4 text-xs font-medium uppercase tracking-[0.2em]",
            "border border-[rgba(138,106,62,0.3)] rounded-full",
            "bg-transparent text-[var(--ink)]",
            "transition-colors duration-500 ease-[var(--ease-aureon)]",
            "hover:bg-[var(--champagne)] hover:text-[var(--cloud)] hover:border-[var(--champagne)]",
            "focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--champagne)] focus-visible:outline-offset-4",
            className
          )}
          onClick={onClick}
          {...(as === "a" ? { href } : { type: "button" })}
        >
          {children}
        </Component>
      </motion.div>
    </div>
  );
}
