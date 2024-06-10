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
        '400': '400px',
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
      brightness: {
        25: '.25',
        15: '.15',
      },
      backgroundImage: {
        'radial-gradient': 'radial-gradient(169.40% 89.55% at 94.76% 6.29%, rgba(0, 0, 0, 0.40) 0%, rgba(255, 255, 255, 0.00) 100%)',
      },
      backgroundSize: {
        'auto': 'auto',
        'cover': 'cover',
        'contain': 'contain',
        '50%': '50%',
        'mainBg': '15rem 4.3rem',
      }
    },
  },
  plugins: [],
}

