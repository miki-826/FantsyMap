import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: "#6d5dfc",
          dark: "#5a4bd6",
          light: "#a99bff",
        },
      },
      fontFamily: {
        sans: ["system-ui", "Hiragino Kaku Gothic ProN", "Meiryo", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
