/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html",
  ],
  theme: {
    extend: {
      backgroundColor: {
        'bg-light': '#ffffff',
        'bg-dark': '#121212',
      },
      textColor: {
        'text-light': '#000000',
        'text-dark': '#ffffff',
      }
    },
  },
  plugins: [],
  darkMode: 'class',
}
