/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: "#1D4ED8",
          light: "#60A5FA",
          dark: "#1E3A8A",
        },
        ink: "#0F1B2D",
      },
    },
  },
  plugins: [],
};
