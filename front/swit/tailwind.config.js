/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",

  ],
  theme: {
    extend: {
      fontFamily:{
        'tenada': ['Tenada'],
        'blackHans':['BlackHansSans']
      },
      spacing:{
        '1000': '1000px'
      }
    },
  },
  plugins: [],
}

