/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{html,js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'playfair': ['Playfair Display', 'serif'],
        'poppins': ['Poppins', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fade-in 0.3s ease-in-out',
      },
      colors: {
          'primary': '#2c3e50'
      }
    },
  },
  plugins: [],
} 