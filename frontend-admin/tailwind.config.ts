import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './context/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        roast: '#2A1A14',
        mocha: '#5A3B2E',
        espresso: '#3B261D',
        latte: '#B48762',
        tan: '#D6B394',
        crema: '#EADCCF',
        oat: '#F7EFE7',
        mist: '#FBF7F2',
      },
      boxShadow: {
        soft: '0 18px 45px rgba(42, 26, 20, 0.08)',
        glow: '0 25px 60px rgba(91, 59, 46, 0.14)',
      },
      borderRadius: {
        '4xl': '2rem',
      },
    },
  },
  plugins: [],
};

export default config;
