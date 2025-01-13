import plugin from "tailwindcss/plugin";
import defaultTheme from 'tailwindcss/defaultTheme';

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"UbuntuSans"', ...defaultTheme.fontFamily.sans],
      },
    },
  },
  plugins: [
    plugin(({ addBase, theme }) => {
      addBase({
        "*": {
          textUnderlineOffset: "2px",
          scrollMargin: "2rem",
        },
        "html, body": {
          width: "100%",
          height: "100%",
        },
        html: {
          scrollBehavior: "smooth",
        },
        body: {
          backgroundColor: "#fcfcff",
          color: theme("colors.neutral.900"),
        },
        "a:hover": {
          textDecorationLine: "underline",
        },
      });
    }),
  ],
};
