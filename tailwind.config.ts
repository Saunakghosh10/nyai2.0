import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          black: "#0A0A0B",
          violet: "#6B46C1",
          blue: "#3B82F6",
          purple: "#4C1D95",
        },
        accent: {
          violet: "#8B5CF6",
          blue: "#60A5FA",
          midnight: "#1E1B4B",
          gray: "#1F2937",
        },
        text: {
          light: "#F3F4F6",
          purple: "#C4B5FD",
        }
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'hero-gradient': 'linear-gradient(to right, #0A0A0B, #1E1B4B)',
        'cta-gradient': 'linear-gradient(to right, #6B46C1, #4C1D95)',
      },
    },
  },
  plugins: [],
};
export default config;
