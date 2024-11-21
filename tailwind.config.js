/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx,svelte}"],
  theme: {
    extend: {
      colors: {
        fg: {
          DEFAULT: "var(--color-fg)",
          secondary: "var(--color-fg-secondary)",
        },
        bg: {
          DEFAULT: "var(--color-bg)",
          secondary: "var(--color-bg-secondary)",
          tile: "var(--color-bg-tile)",
        },
        border: "var(--color-border)",
        accent: {
          1: "var(--accent-1)",
          2: "var(--accent-2)",
          3: "var(--accent-3)",
          4: "var(--accent-4)",
          5: "var(--accent-5)",
          6: "var(--accent-6)",
          7: "var(--accent-7)",
          8: "var(--accent-8)",
          9: "var(--accent-9)",
          10: "var(--accent-10)",
          11: "var(--accent-11)",
          12: "var(--accent-12)",
          contrast: "var(--accent-contrast)",
        },
      },
      keyframes: {
        heartbeat: {
          "0%, 40%, 100%": { transform: "scale(1)" },
          "10%": { transform: "scale(1.15)" },
          "20%": { transform: "scale(1)" },
          "30%": { transform: "scale(1.15)" },
        },
        rumble: {
          "0%, 100%": { transform: "translate(0, 0) rotate(0deg)" },
          "10%": { transform: "translate(-3px, -3px) rotate(-1deg)" },
          "20%": { transform: "translate(3px, 2px) rotate(1deg)" },
          "30%": { transform: "translate(-2px, 3px) rotate(-1deg)" },
          "40%": { transform: "translate(2px, -3px) rotate(1deg)" },
          "50%": { transform: "translate(-3px, 2px) rotate(-1deg)" },
          "60%": { transform: "translate(3px, -2px) rotate(1deg)" },
          "70%": { transform: "translate(-2px, -3px) rotate(-1deg)" },
          "80%": { transform: "translate(2px, 3px) rotate(1deg)" },
          "90%": { transform: "translate(-3px, 2px) rotate(-1deg)" },
        },
      },
      animation: {
        heartbeat: "heartbeat 2s ease-in-out infinite",
        rumble: "rumble 0.8s ease-in-out infinite",
      },
    },
  },
  plugins: [],
  future: {
    hoverOnlyWhenSupported: true,
  },
};
