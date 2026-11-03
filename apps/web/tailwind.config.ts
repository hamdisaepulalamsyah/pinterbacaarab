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
        canvas: '#FAFAF9', // warm minimal paper white
        surface: '#FFFFFF',
        subtle: '#F4F4F2',
        border: '#E7E5E4',
        borderlight: '#F0EFEA',
        ink: {
          DEFAULT: '#18181B',
          secondary: '#52525B',
          tertiary: '#71717A',
          muted: '#A1A1AA',
        },
        cedar: {
          DEFAULT: '#1B3B2B', // Quiet, deep editorial pine
          hover: '#132A1F',
          light: '#28543E',
          soft: '#EAF0EC',
        },
        ochre: {
          DEFAULT: '#9A6735', // Minimalist warm gold / bronze
          light: '#C4945A',
          soft: '#F8F3EC',
        },
      },
      fontFamily: {
        serif: ['Newsreader', 'Georgia', 'serif'],
        sans: ['Plus Jakarta Sans', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        arabic: ['Amiri', 'Amiri Quran', 'serif'],
      },
      boxShadow: {
        minimal: '0 1px 3px 0 rgba(0, 0, 0, 0.02), 0 1px 2px -1px rgba(0, 0, 0, 0.02)',
        float: '0 8px 30px rgba(0, 0, 0, 0.04)',
        drawer: '0 -10px 40px rgba(0, 0, 0, 0.08)',
      },
    },
  },
  plugins: [],
};

export default config;
