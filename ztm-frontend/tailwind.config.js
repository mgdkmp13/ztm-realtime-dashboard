/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'ztm-primary': '#ec4899',
        'ztm-secondary': '#f9a8d4',
        'ztm-success': '#a855f7',
        'ztm-danger': '#f43f5e',
        'ztm-warning': '#fbbf24',
        'ztm-accent': '#c084fc',
      }
    },
  },
  plugins: [],
}
