/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        'primary': '#0d9488', // #0d9488 or #4fbf8b based on grocerygo
        'primary-dull': '#0f766e',
      }
    },
  },
  plugins: [],
}

