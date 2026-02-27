import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        primary: "#0f4c5c",
        accent: "#e36414",
        ink: "#1f2937",
        soft: "#f5f7fa"
      }
    }
  },
  plugins: []
};

export default config;
