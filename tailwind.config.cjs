/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],

  theme: {
    screens: {
      sm: "640px",
      md: "768px",
      lg: "1024px",
      xl: "1280px",
      "2xl": "1536px",
      "3xl": "2200px",
    },

    extend: {
      padding: {
        "85vh": "85vh",
        "50vh": "50vh",
      },

      spacing: {
        "40rem": "40rem",
        "45rem": "45rem",
        "55rem": "55rem",
        "63rem": "63rem",
        "70rem": "70rem",
      },

      width: {
        "96p": "96%",
      },

      backgroundImage: {
        heroGradient:
          "linear-gradient(to right bottom, rgba(126,213,111,0.8), rgba(40,180,133,0.8))",
        fadeBottom:
          "linear-gradient(180deg, rgba(0,0,0,0), rgba(0,0,0,0.64), rgba(18,18,18,1))",
        fadeBlack:
          "linear-gradient(180deg, rgba(0,0,0,0.6), rgba(0,0,0,0))",
        fadeAccent:
          "linear-gradient(90deg, rgba(190,18,60,0.44) 0%, rgba(220,38,38,0.5) 35%, rgba(0,0,0,0) 100%)",
      },

      colors: {
        blackPrimary: "#010511",
        transparentWhite: "#33333380",
        transparentBlack: "#000000bf",
      },

      margin: {
        "-6p": "-6%",
        "50p": "50%",
      },
    },
  },

  plugins: [
    require("@tailwindcss/line-clamp"),
    require("tailwindcss-textshadow"),
  ],
};
