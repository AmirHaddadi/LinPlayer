import type { Config } from 'tailwindcss'

export default {
  darkMode: 'class',
  content: ['./src/renderer/index.html', './src/renderer/src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        base: {
          950: '#0a0b0d',
          900: '#101216',
          850: '#15181d',
          800: '#1b1f26',
          700: '#242933',
          600: '#323844',
          500: '#454c59',
          400: '#6b7280',
          300: '#9aa1ad',
          200: '#c4c9d1',
          100: '#e5e7eb'
        },
        accent: {
          DEFAULT: '#5b8cff',
          hover: '#7aa1ff',
          muted: '#3a4b7a',
          foreground: '#0a0b0d'
        },
        surface: {
          DEFAULT: '#15181d',
          raised: '#1b1f26',
          overlay: 'rgba(21, 24, 29, 0.85)'
        },
        success: '#4ade80',
        warning: '#fbbf24',
        danger: '#f87171'
      },
      fontFamily: {
        sans: [
          'Inter',
          'ui-sans-serif',
          'system-ui',
          '-apple-system',
          'Segoe UI',
          'Roboto',
          'sans-serif'
        ]
      },
      borderRadius: {
        sm: '6px',
        md: '10px',
        lg: '14px',
        xl: '20px'
      },
      boxShadow: {
        subtle: '0 1px 2px rgba(0,0,0,0.4)',
        panel: '0 4px 24px rgba(0,0,0,0.35)'
      },
      spacing: {
        18: '4.5rem',
        22: '5.5rem'
      },
      transitionDuration: {
        DEFAULT: '150ms'
      }
    }
  },
  plugins: []
} satisfies Config
