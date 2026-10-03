/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      screens: {
        short: { raw: "(max-height: 500px)" }, // phones held sideways
      },
      colors: {
        bg: "#0e0e0c",
        panel: "#161512",
        line: "#2a2924",
        ink: "#ecebe4",
        muted: "#8f8d84",
        accent: "rgb(var(--accent) / <alpha-value>)", // set per theme in index.css
      },
      fontFamily: {
        sans: ['"Bricolage Grotesque"', "system-ui", "sans-serif"],
        serif: ['"Instrument Serif"', "Georgia", "serif"],
        mono: ['"JetBrains Mono"', "ui-monospace", "monospace"],
        pixel: ["Silkscreen", "ui-monospace", "monospace"],
      },
    },
  },
  plugins: [],
};
