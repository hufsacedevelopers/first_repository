import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#f1f6ff",
          100: "#dfeafd",
          500: "#3b82f6",
          700: "#1d4ed8",
          900: "#1e3a8a"
        }
      }
    }
  },
  plugins: []
};

export default config;
