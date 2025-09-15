/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#000', // black
        secondary: '#fff', // white
        grayDark: '#222',
        gray: '#888',
        grayLight: '#e5e5e5',
      },
    },
  },
  plugins: [],
}