import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      borderWidth: {
        3: "3px",
      },
      colors: {
        mustard: "#FFD700",
        "mustard-dark": "#E6BE00",
        blue: {
          DEFAULT: "#1E3A8A",
          ink: "#162a63",
        },
        tomato: {
          DEFAULT: "#FF6347",
          dark: "#E2492E",
        },
        cream: "#FFF4D6",
      },
      fontFamily: {
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
        heading: ["var(--font-heading)", "sans-serif"],
        saigon1: ["var(--font-saigon1)", "sans-serif"],
        saigon2: ["var(--font-saigon2)", "sans-serif"],
        saigon3: ["var(--font-saigon3)", "sans-serif"],
      },
      boxShadow: {
        retro: "6px 6px 0 0 #1E3A8A",
        "retro-sm": "3px 3px 0 0 #1E3A8A",
        tomato: "6px 6px 0 0 #FF6347",
      },
      backgroundImage: {
        "dot-grid":
          "radial-gradient(circle, rgba(30,58,138,0.18) 1.5px, transparent 1.5px)",
      },
      backgroundSize: {
        "dot-sm": "18px 18px",
      },
    },
  },
  plugins: [],
};

export default config;