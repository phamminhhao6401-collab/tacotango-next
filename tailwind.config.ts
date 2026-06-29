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
        // Chuyển sang tông nâu đậm (Deep Chocolate Brown) để tương phản với màu vàng
        blue: {
          DEFAULT: "#4A2C2A", // Màu nâu sô-cô-la chính
          ink: "#2E1B1A",     // Màu nâu tối hơn cho các điểm nhấn
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
        // Tự động sử dụng màu blue (hiện đã là nâu)
        retro: "6px 6px 0 0 #4A2C2A", 
        "retro-sm": "3px 3px 0 0 #4A2C2A",
        tomato: "6px 6px 0 0 #FF6347",
      },
      backgroundImage: {
        // Cập nhật màu dot-grid theo tông nâu
        "dot-grid":
          "radial-gradient(circle, rgba(74,44,42,0.18) 1.5px, transparent 1.5px)",
      },
      backgroundSize: {
        "dot-sm": "18px 18px",
      },
    },
  },
  plugins: [],
};

export default config;