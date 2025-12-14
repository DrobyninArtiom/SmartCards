/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'smart-bg': '#121212',
        'smart-surface': '#1F1F1F',
        'smart-green': '#00E676', // Bright green from screenshot
        'smart-text': '#E0E0E0',
        'smart-text-muted': '#A0A0A0',
      }
    },
  },
  plugins: [],
}
