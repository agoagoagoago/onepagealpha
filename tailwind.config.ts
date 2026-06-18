import type { Config } from "tailwindcss";

/**
 * Brand palette for OnePage Alpha.
 * Tweak these hex values here to re-tone the whole site.
 */
const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ivory: "#FBFAF7", // page background (warm off-white)
        paper: "#FFFFFF", // cards / raised surfaces
        ink: "#1A2433", // deep navy-charcoal primary text
        "ink-soft": "#3C4656", // secondary text
        "ink-muted": "#6B7280", // tertiary / captions
        gold: "#B08D3C", // muted gold/amber accent
        "gold-soft": "#C7A65A",
        line: "#E7E3DA", // subtle borders
      },
      fontFamily: {
        // CSS variables are wired up in app/layout.tsx via next/font
        serif: ["var(--font-serif)", "Georgia", "serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        card: "0 1px 2px rgba(26, 36, 51, 0.04), 0 12px 32px -16px rgba(26, 36, 51, 0.18)",
      },
      maxWidth: {
        content: "72rem",
      },
    },
  },
  plugins: [],
};

export default config;
