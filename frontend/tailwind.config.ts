import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        page: "#f6f8fc",
        primary: {
          50: "#eef6ff",
          100: "#dbeafe",
          500: "#2563eb",
          700: "#1d4ed8",
          800: "#1e40af",
          900: "#172554"
        }
      }
    }
  },
  plugins: []
};

export default config;
