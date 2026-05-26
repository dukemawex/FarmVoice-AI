import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        savanna: {
          orange: '#E07B39',
          green: '#2D6A4F',
          sky: '#74C0FC',
          sand: '#FEFEFE',
          slate: '#1e293b'
        }
      },
      fontFamily: {
        sans: ['var(--font-lexend)', 'system-ui', 'sans-serif'],
        display: ['var(--font-space-grotesk)', 'system-ui', 'sans-serif']
      },
      boxShadow: {
        glow: '0 24px 60px rgba(45, 106, 79, 0.18)'
      },
      backgroundImage: {
        'hero-sunrise': 'linear-gradient(135deg, rgba(224,123,57,0.96) 0%, rgba(45,106,79,0.93) 48%, rgba(116,192,252,0.86) 100%)'
      }
    }
  },
  plugins: []
};

export default config;