import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },

      white: "#fff",

      gray: {
        100: "#E1E1E6",
        200: "#A9A9B2",
        400: "#7C7C8A",
        600: "#323238",
        800: "#202024",
        900: "#121214",
      },

      green: {
        500: "#00B37E",
        600: "#00875F",
      },
    },

    fontFamily: {
      roboto: "Roboto",
    },
  },
  plugins: [],
};
export default config;
