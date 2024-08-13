/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./App.{js,jsx,ts,tsx}",
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        SenBold: ["SenBold"],
        SenRegular: ["SenRegular"],
        SenExtraBold: ["SenExtraBold"],
        ArchivoMedium: ["ArchivoMedium"],
        ManropeMedium: ["ManropeMedium"],
        ManropeSemiBold: ["ManropeSemiBold"],
      },
    },
  },
  plugins: [],
};
