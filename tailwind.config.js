/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: '#0F172A',
        surface: '#1E293B',
        primary: '#F8FAFC',
        secondary: '#94A3B8',
        accent: '#22D3EE',
        hex: '#FFD63B',
        trap: '#DC2626',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

