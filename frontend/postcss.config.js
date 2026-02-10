/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        'neon-pink': '#FF69B4',
        'dark-bg': '#000000',
      },
      backgroundImage: {
        'pink-gradient': 'linear-gradient(to right, #000000, #FF69B4)',
      },
    },
  },
  plugins: [],
}