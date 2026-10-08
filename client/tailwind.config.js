/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        // Original Colors (Fallback)
        ink: "#20251F",
        forest: "#17372B",
        sage: "#7C927A",
        ivory: "#F7F4EC",
        sand: "#D8C8A8",
        gold: "#B89B5E",

        // 🌙 Naye "Midnight Forest" Colors
        dark: {
          base: "#080D0A", // Main Background
          surface: "#121E1A", // Cards, Modals, Dropdowns
          muted: "#16231D", // Hover states & Light borders
        },
        accent: {
          emerald: "#34D399", // Glowing Green (Tailwind emerald-400)
        },
      },
      fontFamily: {
        display: ["Cormorant Garamond", "serif"],
        sans: ["Manrope", "sans-serif"],
      },
    },
  },
  plugins: [],
};
