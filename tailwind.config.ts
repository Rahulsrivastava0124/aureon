import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        surface: "var(--surface)",
        stone: "var(--stone)",
        champagne: "var(--champagne)",
        bronze: "var(--bronze)",
        ink: "var(--ink)",
        "muted-ink": "var(--muted-ink)",
        cloud: "var(--cloud)",
        mist: "var(--mist)",
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "system-ui", "sans-serif"],
        editorial: ["var(--font-editorial)", "Georgia", "serif"],
      },
      fontSize: {
        hero: ["clamp(4rem, 10vw, 11rem)", { lineHeight: "0.85", letterSpacing: "-0.07em" }],
        "hero-sub": ["clamp(1.25rem, 2.5vw, 2rem)", { lineHeight: "1.3", letterSpacing: "-0.02em" }],
        "section-title": ["clamp(2.5rem, 6vw, 6rem)", { lineHeight: "0.9", letterSpacing: "-0.05em" }],
        "section-body": ["clamp(1rem, 1.5vw, 1.25rem)", { lineHeight: "1.6", letterSpacing: "-0.01em" }],
      },
      spacing: {
        18: "4.5rem",
        88: "22rem",
        112: "28rem",
        128: "32rem",
      },
      transitionTimingFunction: {
        "aureon": "cubic-bezier(0.25, 0.1, 0.25, 1)",
        "aureon-out": "cubic-bezier(0.16, 1, 0.3, 1)",
      },
      backdropBlur: {
        xs: "2px",
      },
      animation: {
        "float": "float 6s ease-in-out infinite",
        "drift": "drift 20s linear infinite",
        "shimmer": "shimmer 3s ease-in-out infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-12px)" },
        },
        drift: {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(100%)" },
        },
        shimmer: {
          "0%, 100%": { opacity: "0.3" },
          "50%": { opacity: "0.6" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
