
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
  './index.html',
  './src/**/*.{js,ts,jsx,tsx}'
],
  theme: {
    extend: {
      colors: {
        navy: {
          900: '#1e3a5f',
          800: '#243b53',
          700: '#334e68',
        },
        green: {
          600: '#27a05c',
          700: '#1e8c50',
        },
        red: {
          600: '#dc2626',
          700: '#b91c1c',
        },
        yellow: {
          500: '#f59e0b',
        },
        blue: {
          500: '#3b82f6',
        },
        gray: {
          50: '#f9fafb',
          100: '#f3f4f6',
          200: '#e5e7eb',
          300: '#d1d5db',
          400: '#9ca3af',
          500: '#6b7280',
          600: '#4b5563',
          700: '#374151',
          800: '#1f2937',
          900: '#111827',
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      boxShadow: {
        card: '0 1px 3px rgba(0,0,0,0.08)',
        elevated: '0 4px 12px rgba(0,0,0,0.15)',
      }
    },
  },
  plugins: [],
}
