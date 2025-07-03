/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Pepe-themed colors
        pepe: {
          50: '#f0f9f0',
          100: '#dcf2dc',
          200: '#bce5bc',
          300: '#8dd18d',
          400: '#5cb65c',
          500: '#3d9c3d',
          600: '#2d7d2d',
          700: '#256325',
          800: '#1f4f1f',
          900: '#1a421a',
        },
        // Yearbook-themed colors
        yearbook: {
          cream: '#faf7f0',
          gold: '#d4af37',
          brown: '#8b4513',
          sepia: '#704214',
        },
        // Crypto-themed colors
        crypto: {
          bitcoin: '#f7931a',
          ethereum: '#627eea',
          purple: '#6f42c1',
          green: '#00d4aa',
        }
      },
      fontFamily: {
        'yearbook': ['Georgia', 'Times New Roman', 'serif'],
        'handwriting': ['Kalam', 'cursive'],
        'sans': ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'yearbook': '0 4px 8px rgba(0, 0, 0, 0.1), 0 2px 4px rgba(0, 0, 0, 0.06)',
        'polaroid': '0 8px 16px rgba(0, 0, 0, 0.15), 0 4px 8px rgba(0, 0, 0, 0.1)',
      },
      animation: {
        'float': 'float 3s ease-in-out infinite',
        'bounce-slow': 'bounce 2s infinite',
        'pulse-slow': 'pulse 3s infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        }
      },
      screens: {
        'xs': '475px',
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
      }
    },
  },
  plugins: [],
}