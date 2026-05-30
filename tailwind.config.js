/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}"
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          blue: '#2563eb',
          purple: '#7c3aed',
        },
        primary: {
          DEFAULT: '#1e293b',
          dark: '#f8fafc',
        }
      },
      fontFamily: {
        outfit: ['Outfit', 'sans-serif']
      }
    }
  },
  plugins: []
};
