import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        espresso: '#2a1a14',
        mocha: '#5a3b2e',
        latte: '#b48762',
        crema: '#e6d3c2',
        oat: '#f7efe7',
        sand: '#dcc2ab',
        roast: '#1a120f',
      },
      boxShadow: {
        glow: '0 18px 40px rgba(42, 26, 20, 0.14)',
        soft: '0 10px 30px rgba(30, 20, 15, 0.08)',
      },
      backgroundImage: {
        'coffee-grid': 'radial-gradient(circle at 1px 1px, rgba(90,59,46,0.15) 1px, transparent 0)',
        'hero-radial': 'radial-gradient(circle at top left, rgba(230,211,194,0.18), transparent 40%), radial-gradient(circle at bottom right, rgba(180,135,98,0.22), transparent 35%)',
      },
    },
  },
  plugins: [],
};

export default config;
