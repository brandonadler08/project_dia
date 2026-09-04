/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        gold: {
          50: '#FDFBF5',
          100: '#FAF4E6',
          200: '#F4E7C4',
          300: '#ECD599',
          400: '#E6BE68', // Metallic light gold
          500: '#D4A33B', // Official EAD Gold
          600: '#C69234',
          700: '#A67623', // Deep gold border
          800: '#855C18',
        },
        navy: {
          950: '#0B1120', // Deepest background
          900: '#10182E', // Main page background (from image)
          850: '#131E3A', // Card / Section background (from image)
          800: '#1A274B', // Card hover / active container
          700: '#233464', // Subtle 1px borders
          600: '#2F4582',
        }
      },
    },
  },
  plugins: [],
}
