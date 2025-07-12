/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        dark: {
          900: '#18120B', // deep dark brownish-black
          800: '#23160D', // dark brown
          700: '#2D1A0F', // slightly lighter brown
          600: '#3B2414', // accent brown
        },
        blackish: '#0B0908', // almost black
        brownish: '#3B2414', // dark brown
      },
    },
  },
  plugins: [],
};
