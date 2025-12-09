/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Sora', 'sans-serif'],
        display: ['Sora', 'sans-serif'],
        mono: ['Space Mono', 'monospace'],
      },
      colors: {
        // Deep space theme
        void: {
          50: '#f0f2f7',
          100: '#d8dce8',
          200: '#b5bcd5',
          300: '#8e98bd',
          400: '#6a76a4',
          500: '#4d5889',
          600: '#3d4570',
          700: '#2f3557',
          800: '#1a1f35',
          900: '#0a0e17',
          950: '#050811',
        },
        // Electric cyan accent
        neon: {
          50: '#e6fffc',
          100: '#b3fff6',
          200: '#80ffef',
          300: '#4dffe9',
          400: '#1affe2',
          500: '#00e5c9',
          600: '#00b8a2',
          700: '#008b7a',
          800: '#005e53',
          900: '#00312b',
        },
        // Hot coral accent
        coral: {
          50: '#fff5f2',
          100: '#ffe6e0',
          200: '#ffc7b8',
          300: '#ff9e85',
          400: '#ff7152',
          500: '#ff4d2a',
          600: '#e6381a',
          700: '#bf2c12',
          800: '#99230f',
          900: '#73190b',
        },
        // Electric violet
        electric: {
          50: '#f5f0ff',
          100: '#ebe0ff',
          200: '#d4bfff',
          300: '#b794ff',
          400: '#9966ff',
          500: '#7c3aed',
          600: '#6d28d9',
          700: '#5b21b6',
          800: '#4a1d95',
          900: '#3b1874',
        },
        // Golden amber
        amber: {
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
        },
        // Success green
        success: {
          50: '#ecfdf5',
          100: '#d1fae5',
          200: '#a7f3d0',
          300: '#6ee7b7',
          400: '#34d399',
          500: '#10b981',
          600: '#059669',
          700: '#047857',
          800: '#065f46',
          900: '#064e3b',
        },
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'float-slow': 'float 8s ease-in-out infinite',
        'float-delayed': 'float 6s ease-in-out 2s infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'pulse-neon': 'pulseNeon 2s ease-in-out infinite',
        'spin-slow': 'spin 20s linear infinite',
        'slide-up': 'slideUpFade 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'slide-up-delayed': 'slideUpFade 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.2s forwards',
        'slide-in-right': 'slideInRight 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'slide-in-left': 'slideInLeft 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'fade-in': 'fadeIn 0.6s ease-out forwards',
        'scale-in': 'scaleIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'bounce-in': 'bounceIn 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards',
        'glow-pulse': 'glowPulse 3s ease-in-out infinite',
        'gradient-shift': 'gradientShift 8s ease infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'border-flow': 'borderFlow 3s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0) rotate(0deg)' },
          '25%': { transform: 'translateY(-12px) rotate(1deg)' },
          '75%': { transform: 'translateY(-6px) rotate(-1deg)' },
        },
        slideUpFade: {
          '0%': { transform: 'translateY(30px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideInRight: {
          '0%': { transform: 'translateX(30px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        slideInLeft: {
          '0%': { transform: 'translateX(-30px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        bounceIn: {
          '0%': { transform: 'scale(0.3)', opacity: '0' },
          '50%': { transform: 'scale(1.05)' },
          '70%': { transform: 'scale(0.9)' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        glowPulse: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(0, 229, 201, 0.2)' },
          '50%': { boxShadow: '0 0 40px rgba(0, 229, 201, 0.4), 0 0 60px rgba(0, 229, 201, 0.2)' },
        },
        pulseNeon: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        },
        gradientShift: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        borderFlow: {
          '0%': { backgroundPosition: '0% 50%' },
          '100%': { backgroundPosition: '200% 50%' },
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'mesh-gradient': 'linear-gradient(135deg, rgba(0, 229, 201, 0.08) 0%, transparent 50%, rgba(255, 77, 42, 0.08) 100%)',
        'neon-glow': 'radial-gradient(ellipse at center, rgba(0, 229, 201, 0.15), transparent 70%)',
      },
      boxShadow: {
        'neon': '0 0 20px rgba(0, 229, 201, 0.3), 0 0 40px rgba(0, 229, 201, 0.1)',
        'neon-lg': '0 0 30px rgba(0, 229, 201, 0.4), 0 0 60px rgba(0, 229, 201, 0.2)',
        'coral': '0 0 20px rgba(255, 77, 42, 0.3), 0 0 40px rgba(255, 77, 42, 0.1)',
        'electric': '0 0 20px rgba(124, 58, 237, 0.3), 0 0 40px rgba(124, 58, 237, 0.1)',
        'card': '0 25px 50px -12px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(255, 255, 255, 0.03)',
        'card-hover': '0 35px 60px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.06)',
        'inner-glow': 'inset 0 0 30px rgba(0, 229, 201, 0.1)',
      },
      transitionTimingFunction: {
        'bounce-in': 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
        'smooth': 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
    },
  },
  plugins: [],
}
