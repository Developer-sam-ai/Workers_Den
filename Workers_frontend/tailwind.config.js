
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#EFF6FF',
          100: '#DBEAFE',
          500: '#3B82F6',
          600: '#2563EB', 
          700: '#1D4ED8',
          900: '#1E3A8A',
        },
        surface: {
          light: '#F8FAFC',
          border: '#E2E8F0',
          dark: '#0F172A',
          muted: '#64748B'
        }
      }
    },
  },
  plugins: [],
}