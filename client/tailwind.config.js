/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'monospace']
      },
      colors: {
        sap: {
          blue: '#0070F2',
          darkBlue: '#003A70',
          gold: '#E9730C',
          slate: '#0F172A'
        }
      }
    },
  },
  plugins: [],
}
