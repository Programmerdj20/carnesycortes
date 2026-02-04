/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        brand: {
          red: '#C41E3A',
          'red-dark': '#A01729',
          'red-light': '#D63851',
        },
        dark: {
          900: '#0a0a0a',
          800: '#1a1a1a',
          700: '#2D2D2D',
          600: '#666666',
        },
        cream: '#FFF8F0',
        gold: '#D4A84B',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Playfair Display', 'Georgia', 'serif'],
      },
      animation: {
        'gradient-flow': 'gradientFlow 20s ease-in-out infinite',
        'float-up-down': 'floatUpDown 6s ease-in-out infinite',
        'slide-in-left': 'slideInLeft 1.2s ease-out',
        'slide-in-right': 'slideInRight 1.2s ease-out 0.3s both',
        'fade-in-up': 'fadeInUp 0.8s ease-out both',
        'float-card': 'floatCard 6s ease-in-out infinite',
        'pulse-dot': 'pulseDot 3s ease-in-out infinite',
        'bounce-slow': 'bounceSlow 2s infinite',
        'counter-up': 'counterUp 2s ease-out',
        'reveal': 'reveal 0.8s ease-out both',
        'slide-in-bottom': 'slideInBottom 0.6s ease-out both',
      },
      keyframes: {
        gradientFlow: {
          '0%, 100%': { opacity: '1', transform: 'scale(1) rotate(0deg)' },
          '50%': { opacity: '0.8', transform: 'scale(1.05) rotate(1deg)' },
        },
        floatUpDown: {
          '0%, 100%': { transform: 'translateY(0px) scale(1)', opacity: '0.3' },
          '50%': { transform: 'translateY(-20px) scale(1.1)', opacity: '0.6' },
        },
        slideInLeft: {
          '0%': { opacity: '0', transform: 'translateX(-100px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        slideInRight: {
          '0%': { opacity: '0', transform: 'translateX(100px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        floatCard: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-15px)' },
        },
        pulseDot: {
          '0%, 100%': { opacity: '0.3', transform: 'scale(1)' },
          '50%': { opacity: '1', transform: 'scale(1.5)' },
        },
        bounceSlow: {
          '0%, 20%, 50%, 80%, 100%': { transform: 'translateY(0)' },
          '40%': { transform: 'translateY(-10px)' },
          '60%': { transform: 'translateY(-5px)' },
        },
        counterUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        reveal: {
          '0%': { opacity: '0', transform: 'translateY(40px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideInBottom: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      boxShadow: {
        'premium-sm': '0 2px 8px rgba(0, 0, 0, 0.08)',
        'premium-md': '0 4px 16px rgba(0, 0, 0, 0.12)',
        'premium-lg': '0 8px 32px rgba(0, 0, 0, 0.16)',
        'premium-xl': '0 16px 48px rgba(0, 0, 0, 0.2)',
        'red-glow': '0 8px 32px rgba(196, 30, 58, 0.25)',
      },
    },
  },
  plugins: [],
}
