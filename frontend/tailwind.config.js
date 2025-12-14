/** @type {import('tailwindcss').Config} */
export default {
  content: [  "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}"],
    darkMode:"class",
  theme: {
    extend: {
      colors:{
},
 backgroundImage: {
        underline_semi_white_grad: "linear-gradient(to right, transparent 0%, white 50%, transparent 100%)",
        underline_semi_sky_grad: "linear-gradient(to right, transparent, #0c4a6e, transparent)", // sky-900 = #0c4a6e
      },
   keyframes: {
        animate_underline: {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(100%)" },
        },
      },
      animation: {
        animate_underline: "animate_underline 2s linear infinite",
      },
    },
  },
  plugins: [],
}

