/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#660000", // Example color, change as needed
        secondary: "#FFCC00", // Example color, change as needed
        accent: "#0066CC", // Example color, change as needed
        background: "#F3F4F6", // Example color, change as needed
        header: "#FFFFFF", // Header background color
        footer: "#1F2937", // Footer background color
      },
      fontFamily: {
        sans: ['"Inter"', "sans-serif"], // Example font, change as needed
        serif: ['"Merriweather"', "serif"], // Example font, change as needed
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      spacing: {
        128: "32rem", // Custom spacing for larger elements
        144: "36rem",
      },
    },
  },
  plugins: [],
};
