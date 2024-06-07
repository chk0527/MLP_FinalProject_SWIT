/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",

  ],
  theme: {
    extend: {
      fontFamily:{
        'tenada': ['Tenada'],
        'blackHans':['BlackHansSans'],
        'buqueque':['Buqueque'],
        'GSans':['GmarketSans'],

      },
      spacing:{
        '450': '450px',
        '550': '550px',
        '650': '650px',
        '750': '750px',
        '1000':'1000px',
        '1300':'1300px'
      },
      lineClamp: {
        9: '9',
      },
    },
  },
  plugins: [],
}

