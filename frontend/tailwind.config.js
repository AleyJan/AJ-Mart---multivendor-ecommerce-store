/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#3321c8",
      },
      screens: {
        "400px": "400px",
        "800px": "800px",
        "1000px": "1000px",
        "1100px": "1100px",
        "1300px": "1300px",
      },
    },
  },
  plugins: [],
};
