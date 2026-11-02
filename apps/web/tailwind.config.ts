import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        bgwarm: '#FAF6EE',
        forest: {
          DEFAULT: '#1F4D3A',
          hover: '#16382A',
          light: '#2A664E',
        },
        gold: {
          DEFAULT: '#B8913B',
          light: '#D4AA49',
          dark: '#8C6C26',
        },
        ink: '#1C1C1C',
        surface: '#FFFFFF',
        sand: '#F2ECE1',
        alert: '#C2410C',
      },
      fontFamily: {
        arabic: ['Amiri', 'serif'],
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

export default config;
