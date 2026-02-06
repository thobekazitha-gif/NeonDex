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
      boxShadow: {
        'neon': '0 0 15px rgba(255, 105, 180, 0.6)',
      },
    },
  },
  plugins: [],
}

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        'void-black': '#050505',
        'neon-pink': '#FF2D55',
      },
    },
  },
  plugins: [],
}