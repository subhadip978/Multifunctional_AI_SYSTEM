import type { Config } from "tailwindcss";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        purple: {
          100: "#F4F7FE",
          200: "#BCB6FF",
          400: "#868CFF",
          500: "#7857FF",
          600: "#4318FF",
        },
        'primary-500': '#877EFF',
        'primary-600': '#5D5FEF',
        'secondary-500': '#FFB620',

        'dark-1': '#000000',
        'dark-2': '#09090A',
        'dark-3': '#101012',
        'dark-4': '#1F1F22',
       dark:{ 400: "#7986AC",
        500: "#606C80",
        600: "#2B3674",
        700: "#384262",
      },

        'light-1': '#FFFFFF',
        'light-2': '#EFEFEF',
        'light-3': '#7878A3',
        'light-4': '#5C5C7B',
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      backgroundImage: {
        'blue-gradient': 'linear-gradient(to right, #021B79, #0575E6)',
      },
    },
  },
  plugins: [],
} satisfies Config;
