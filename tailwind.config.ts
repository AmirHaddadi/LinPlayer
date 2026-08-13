import type { Config } from 'tailwindcss'

function tokenColor(name: string): string {
  return `rgb(var(--${name}) / <alpha-value>)`
}

export default {
  darkMode: 'class',
  content: ['./src/renderer/index.html', './src/renderer/src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        base: {
          950: tokenColor('base-950'),
          900: tokenColor('base-900'),
          850: tokenColor('base-850'),
          800: tokenColor('base-800'),
          700: tokenColor('base-700'),
          600: tokenColor('base-600'),
          500: tokenColor('base-500'),
          400: tokenColor('base-400'),
          300: tokenColor('base-300'),
          200: tokenColor('base-200'),
          100: tokenColor('base-100')
        },
        accent: {
          DEFAULT: tokenColor('accent'),
          hover: tokenColor('accent-hover'),
          muted: tokenColor('accent-muted'),
          foreground: tokenColor('accent-foreground')
        },
        surface: {
          DEFAULT: tokenColor('surface'),
          raised: tokenColor('surface-raised'),
          overlay: 'rgb(var(--surface) / 0.85)'
        },
        success: tokenColor('success'),
        warning: tokenColor('warning'),
        danger: tokenColor('danger')
      },
      fontFamily: {
        sans: [
          'var(--app-font)',
          'Inter',
          'ui-sans-serif',
          'system-ui',
          '-apple-system',
          'Segoe UI',
          'Roboto',
          'sans-serif'
        ],
        shabnam: ['Shabnam', 'Tahoma', 'ui-sans-serif', 'sans-serif']
      },
      borderRadius: {
        sm: '6px',
        md: '10px',
        lg: '14px',
        xl: '20px'
      },
      boxShadow: {
        subtle: '0 1px 2px rgb(0 0 0 / 0.4)',
        panel: '0 4px 24px rgb(0 0 0 / 0.35)'
      },
      spacing: {
        18: '4.5rem',
        22: '5.5rem'
      },
      transitionDuration: {
        DEFAULT: '150ms'
      },
      transitionTimingFunction: {
        premium: 'cubic-bezier(0.22, 1, 0.36, 1)'
      },
      keyframes: {
        'fade-in': { from: { opacity: '0' }, to: { opacity: '1' } },
        'fade-slide-in': {
          from: { opacity: '0', transform: 'translateY(4px)' },
          to: { opacity: '1', transform: 'translateY(0)' }
        },
        'scale-in': {
          from: { opacity: '0', transform: 'scale(0.96)' },
          to: { opacity: '1', transform: 'scale(1)' }
        }
      },
      animation: {
        'fade-in': 'fade-in 150ms ease-out',
        'fade-slide-in': 'fade-slide-in 180ms cubic-bezier(0.22, 1, 0.36, 1)',
        'scale-in': 'scale-in 150ms cubic-bezier(0.22, 1, 0.36, 1)'
      }
    }
  },
  plugins: []
} satisfies Config
