/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // adjust depending on your setup
  ],
  theme: {
    extend: {
      fontFamily: {
        pixel: ["VT323", "monospace"], // If you're using a pixel font
      },
      colors: {
        dark: "#1A1A1A",
        primary: "#FFD700", // golden for RPG vibe
        secondary: "#7FDBFF", // light blue
      },
    },
  },
  plugins: [],
};
