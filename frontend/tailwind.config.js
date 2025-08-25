/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--color-border-primary))",
        input: "hsl(var(--color-border-primary))",
        ring: "hsl(var(--color-primary-500))",
        background: "hsl(var(--color-background-primary))",
        foreground: "hsl(var(--color-text-primary))",
        primary: {
          DEFAULT: "hsl(var(--color-primary-500))",
          foreground: "hsl(var(--color-text-inverse))",
          50: "hsl(var(--color-primary-50))",
          100: "hsl(var(--color-primary-100))",
          200: "hsl(var(--color-primary-200))",
          300: "hsl(var(--color-primary-300))",
          400: "hsl(var(--color-primary-400))",
          500: "hsl(var(--color-primary-500))",
          600: "hsl(var(--color-primary-600))",
          700: "hsl(var(--color-primary-700))",
          800: "hsl(var(--color-primary-800))",
          900: "hsl(var(--color-primary-900))",
          950: "hsl(var(--color-primary-950))",
        },
        secondary: {
          DEFAULT: "hsl(var(--color-surface-secondary))",
          foreground: "hsl(var(--color-text-primary))",
        },
        destructive: {
          DEFAULT: "hsl(var(--color-error-500))",
          foreground: "hsl(var(--color-text-inverse))",
        },
        muted: {
          DEFAULT: "hsl(var(--color-surface-tertiary))",
          foreground: "hsl(var(--color-text-tertiary))",
        },
        accent: {
          DEFAULT: "hsl(var(--color-surface-tertiary))",
          foreground: "hsl(var(--color-text-primary))",
        },
        popover: {
          DEFAULT: "hsl(var(--color-surface-elevated))",
          foreground: "hsl(var(--color-text-primary))",
        },
        card: {
          DEFAULT: "hsl(var(--color-surface-primary))",
          foreground: "hsl(var(--color-text-primary))",
        },
        success: {
          DEFAULT: "hsl(var(--color-success-500))",
          foreground: "hsl(var(--color-text-inverse))",
        },
        warning: {
          DEFAULT: "hsl(var(--color-warning-500))",
          foreground: "hsl(var(--color-text-inverse))",
        },
        error: {
          DEFAULT: "hsl(var(--color-error-500))",
          foreground: "hsl(var(--color-text-inverse))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      boxShadow: {
        'soft': '0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)',
        'glow': '0 0 20px rgba(14, 165, 233, 0.15)',
      },
      animation: {
        'fade-in': 'fadeIn 0.2s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}
