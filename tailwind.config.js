/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#FF8C00',
        secondary: '#008C44',
        background: '#FFFFFF',
        card: '#F5F5F5',
        text: '#1A1A1A',
        subtext: '#808080',
        border: '#E0E0E0',
        mapIcon: '#FFC107',
        button: '#FF8C00',
        cancel: '#D32F2F',
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'slide-in': {
          '0%': { transform: 'translateY(100%)' },
          '100%': { transform: 'translateY(0)' },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.5s ease-in-out',
        'slide-in': 'slide-in 0.5s ease-out',
      },
    },
  },
  plugins: [],
};