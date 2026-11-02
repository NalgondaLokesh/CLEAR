/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#1a365d',
          light: '#2c5282',
          dark: '#1a365d',
        },
        secondary: {
          DEFAULT: '#2c7a7b',
          light: '#38b2ac',
          dark: '#285e61',
        },
        accent: {
          DEFAULT: '#ed8936',
          light: '#f6ad55',
          dark: '#c05621',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      animation: {
        'pulse-glow': 'pulse-glow 2s infinite',
      },
      keyframes: {
        'pulse-glow': {
          '0%, 100%': {
            boxShadow: '0 0 5px rgba(44, 122, 123, 0.5)',
          },
          '50%': {
            boxShadow: '0 0 20px rgba(44, 122, 123, 0.8)',
          },
        },
      },
    },
  },
  plugins: [],
}