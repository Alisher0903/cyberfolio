import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        mono:    ["'JetBrains Mono'", "monospace"],
        display: ["'Syne'",           "sans-serif"],
        body:    ["'DM Sans'",        "sans-serif"],
      },
      colors: {
        bg:              "#050A0E",
        surface:         "#0A1219",
        border:          "#0E2030",
        accent:          "#00FF87",
        "accent-dim":    "#00CC6A",
        cyan:            "#00D4FF",
        "cyan-dim":      "#0099BB",
        muted:           "#3A5568",
        "text-primary":  "#E8F4FD",
        "text-secondary":"#7FA8C4",
        "text-dim":      "#3A5568",
        danger:          "#FF3B6B",
        warning:         "#FFB800",
      },
      animation: {
        blink:      "blink 1s step-end infinite",
        scan:       "scan 4s linear infinite",
        float:      "float 6s ease-in-out infinite",
        "grid-move":"gridMove 20s linear infinite",
        blob:       "blob 8s ease-in-out infinite",
      },
      keyframes: {
        blink:    { "0%,100%":{ opacity:"1" }, "50%":{ opacity:"0" } },
        scan:     { "0%":{ transform:"translateY(-100%)" }, "100%":{ transform:"translateY(100vh)" } },
        float:    { "0%,100%":{ transform:"translateY(0px)" }, "50%":{ transform:"translateY(-15px)" } },
        gridMove: { "0%":{ transform:"translateY(0)" }, "100%":{ transform:"translateY(60px)" } },
        blob:     {
          "0%,100%":{ borderRadius:"60% 40% 30% 70%/60% 30% 70% 40%" },
          "50%":    { borderRadius:"30% 60% 70% 40%/50% 60% 30% 60%" },
        },
      },
      screens: {
        xs: "375px",
      },
    },
  },
  plugins: [],
};
export default config;
