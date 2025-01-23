/** @type {import('tailwindcss').Config} */
const config = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    
  ],
  theme: {
    screens: {
      sm: "480px",
      md: "768px",
      lg: "976px",
      xl: "1440px",
    },
    colors: {
      emPrimary: {
        light: "#C7F5EA",
        DEFAULT: "#25FEC1",
        dark: "#23DBA1",
      },
      emSecondary: "#7e5bef",
      content: {
        dark: "#1C1C1C",
        middle: "#707070",
        light: "#BDBDBD",
        "extra-light": "#E9E9E9",
        "dark-a": "rgba(28,28,28,.89)",
        "middle-a": "rgba(28,28,28,.56)",
        "light-a": "rgba(28,28,28,.26)",
        "extra-light-a": "rgba(28,28,28,.04)",
      },
      transparent: "transparent",
      white: "#ffffff",
      surface: {
        base: "#E7E7E7",
        ev1: "#35383B",
        ev2: "#000000",
        sheet: "rgba(255,255,255,.64)",
      },
    },
    fontFamily: {
      sans: ["Inter", "sans-serif"],
      'display': ['"F5.6"','sans-serif'],
    },
    fontSize: {
      "overline": [
        ".625rem",
        {
          //12px
          letterSpacing: "0em",
          lineHeight: "120%",
        },
      ],
      xs: [
        ".75rem",
        {
          //12px
          letterSpacing: "0em",
          lineHeight: "120%",
        },
      ],
      sm: [
        ".875rem",
        {
          //14px
          letterSpacing: "0em",
          lineHeight: "120%",
        },
      ],
      base: [
        "1rem",
        {
          //16px
          letterSpacing: "0em",
          lineHeight: "120%",
        },
      ],
      lg: [
        "1.125rem",
        {
          //18px
          letterSpacing: "0em",
          lineHeight: "120%",
        },
      ],
      xl: [
        "1.5rem",
        {
          //24px
          letterSpacing: "0em",
          lineHeight: "120%",
        },
      ],
      "2xl": [
        "2rem",
        {
          //32px
          letterSpacing: "0em",
          lineHeight: "120%",
        },
      ],
      "3xl": [
        "3rem",
        {
          //48px
          letterSpacing: "0em",
          lineHeight: "120%",
        },
      ],
    },
    extend: {
      borderRadius: {
        sm: ".5rem",
        md: "1rem",
        lg: "1.5rem",
      },
      // Adds a new breakpoint in addition to the default breakpoints
      fontSize: {
        "2xs": [".625rem", { letterSpacing: "0em", lineHeight: "120%" }],
      },
      height: {
        screen: ["100vh", "100dvh"],
      }
    },
  },
  plugins: [require("daisyui")],
  
}

export default config;

