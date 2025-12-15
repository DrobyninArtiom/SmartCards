/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'smart-bg': '#0f172a',        // Slate 900 - deep blue-gray
        'smart-surface': '#262626',   // Neutral 800 - true gray surface
        'smart-accent': '#22d3ee',    // Cyan 400 - brighter, more visible
        'smart-text': '#f1f5f9',      // Slate 100 - primary text
        'smart-text-muted': '#94a3b8', // Slate 400 - muted text
      }
    },
  },
  plugins: [],
}
