/** @type {import('tailwindcss').Config} */
import colors from "tailwindcss/colors";
import defaultTheme from "tailwindcss/defaultTheme";
import typography from "@tailwindcss/typography";
import forms from "@tailwindcss/forms";
import aspectratio from "@tailwindcss/aspect-ratio";
export default {
  content: [
    "*.html",
    "_site/*.html",
    "_site/**/*.html",
    "_pages/**/*.md",
    "_posts/**/*.md",
    "_layouts/**/*.html",
    "_includes/**/*.html",
  ],
  theme: {
    extend: {
      colors: {
        gray: colors.slate,
        primary: colors.rose,
        secondary: colors.indigo,
        tertiary: colors.slate,
        danger: colors.red,
      },
      fontFamily: {
        sans: ["Nunito", ...defaultTheme.fontFamily.sans],
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [typography, forms, aspectratio],
};
