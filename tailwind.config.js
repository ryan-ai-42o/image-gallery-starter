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
          DEFAULT: "#FBC02D",
          light: "#FFD54F",
          dark: "#F9A825",
        },
        ink: "#1A1A1A",
      },
    },
  },
  plugins: [],
};
