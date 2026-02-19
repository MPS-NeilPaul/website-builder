import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class", // This tells Tailwind to listen to our ThemeToggle button
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: "var(--primary)", // Maps to our dynamic SaaS theme color
      },
    },
  },
  plugins: [],
};
export default config;