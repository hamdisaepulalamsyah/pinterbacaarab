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
        glow: '0 0 20px -3px rgba(27, 59, 43, 0.15)',
        glowOchre: '0 0 25px -4px rgba(154, 103, 53, 0.2)',
      },
      transitionTimingFunction: {
        fluid: 'cubic-bezier(0.16, 1, 0.3, 1)',
        spring: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
        bounceSoft: 'cubic-bezier(0.34, 1.25, 0.64, 1)',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        fluidPulse: {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.82', transform: 'scale(1.02)' },
        },
        fluidGlow: {
          '0%, 100%': { opacity: '0.4', transform: 'scale(1) translate3d(0, 0, 0)' },
          '50%': { opacity: '0.7', transform: 'scale(1.06) translate3d(-10px, 8px, 0)' },
        },
        fadeSlideUp: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeSlideDown: {
          '0%': { opacity: '0', transform: 'translateY(-10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.96)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
      },
      animation: {
        shimmer: 'shimmer 2.2s linear infinite',
        fluidPulse: 'fluidPulse 3.5s cubic-bezier(0.16, 1, 0.3, 1) infinite',
        fluidGlow: 'fluidGlow 7s ease-in-out infinite',
        fadeSlideUp: 'fadeSlideUp 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        fadeSlideDown: 'fadeSlideDown 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        scaleIn: 'scaleIn 0.28s cubic-bezier(0.16, 1, 0.3, 1) forwards',
      },
    },
  },
  plugins: [],
};

export default config;
