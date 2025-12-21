/** @type {import('tailwindcss').Config} */
import fluid, { extract, fontSize, screens } from 'fluid-tailwind'
const defaultTheme = require('tailwindcss/defaultTheme')

module.exports = {
  darkMode: "selector",
  content: {
    files: ["./src/**/*.{html,njk,js}"],
    extract,
  },
  theme: {
    fontSize: fontSize,
    screens: screens,
    extend: {
      fontFamily: {
        "sans": ["Titillium", defaultTheme.fontFamily.sans]
      },
      colors: {
        primary: "#814C28",
        secondary: "#95C11F",
        background: "#EFEFEF",
      }
    },
  },
  plugins: [
    fluid,
    require('@tailwindcss/typography'),
    require('@tailwindcss/forms'),
    require('tailwind-scrollbar'),
  ],
}