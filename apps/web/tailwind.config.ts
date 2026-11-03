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
        parchment: {
          DEFAULT: '#F9F5ED',
          50: '#FCFBF8',
          100: '#F9F5ED',
          200: '#F2EBDB',
          300: '#E5DAC0',
          400: '#D2C19B',
        },
        forest: {
          DEFAULT: '#0F3A29',
          50: '#F1F7F4',
          100: '#DCEDE5',
          hover: '#0A281C',
          light: '#1B543D',
          600: '#144D36',
          700: '#0F3A29',
          800: '#0B2B1F',
          900: '#071C14',
        },
        gold: {
          DEFAULT: '#C69234',
          light: '#DFC075',
          dark: '#8E641B',
          50: '#FDFBF4',
          100: '#F7EFCF',
          200: '#EDDC9E',
        },
        ink: {
          DEFAULT: '#1C1917',
          muted: '#57534E',
          soft: '#78716C',
        },
        surface: '#FFFFFF',
        sand: '#E9E0D1',
        sandlight: '#F5EFE6',
        alert: '#B91C1C',
      },
      fontFamily: {
        arabic: ['Amiri', 'Amiri Quran', 'Noto Naskh Arabic', 'serif'],
        'arabic-naskh': ['Noto Naskh Arabic', 'Amiri', 'sans-serif'],
        sans: ['Plus Jakarta Sans', 'Inter', 'sans-serif'],
        serif: ['Cinzel', 'serif'],
      },
      boxShadow: {
        card: '0 4px 20px -2px rgba(15, 58, 41, 0.05), 0 2px 6px -1px rgba(15, 58, 41, 0.03)',
        'card-hover': '0 10px 30px -4px rgba(15, 58, 41, 0.1), 0 4px 12px -2px rgba(15, 58, 41, 0.05)',
        gold: '0 4px 20px -2px rgba(198, 146, 52, 0.25)',
      },
    },
  },
  plugins: [],
};

export default config;
