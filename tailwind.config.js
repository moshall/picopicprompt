/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // All default colors (like gray, purple, etc.) are included in v3 by default.
      // We can add our custom ones here if needed later.
      colors: {
        'primary': '#7E57C2',
        'secondary': '#EC407A',
      },
      fontFamily: {
        sans: ['"Noto Sans SC"', 'sans-serif'],
      },
    },
  },
  plugins: [],
} 