import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        heritage: {
          'deep-maroon': 'hsl(0, 65%, 5%)',      // #1a0505
          'maroon': 'hsl(357, 76%, 11%)',        // #2D060B
          'warm-gold': 'hsl(41, 42%, 57%)',      // #C9A05C
          'cream': 'hsl(42, 100%, 96%)',         // #FFF8E7
          'maroon-text': 'hsl(355, 67%, 14%)',   // #3D0A0F
        },
        ceremonial: {
          gold: "hsl(43, 45%, 58%)",
          maroon: "hsl(354, 80%, 24%)",
          teal: "hsl(180, 100%, 25%)",
          cream: "hsl(40, 45%, 96%)",
          brown: "hsl(30, 25%, 40%)",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))'
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))'
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))'
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))'
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))'
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))'
        },
      },
      fontFamily: {
        display: ["Playfair Display", "serif"],
        body: ["Inter", "sans-serif"],
      },
      fontSize: {
        'dynamic-base': 'clamp(1rem, 0.95rem + 0.25vw, 1.125rem)',
        'dynamic-lg': 'clamp(1.125rem, 1rem + 0.5vw, 1.25rem)',
        'dynamic-xl': 'clamp(1.25rem, 1.125rem + 0.75vw, 1.5rem)',
        'dynamic-2xl': 'clamp(1.5rem, 1.25rem + 1vw, 2rem)',
        'dynamic-3xl': 'clamp(1.875rem, 1.5rem + 1.5vw, 2.5rem)',
      },
      boxShadow: {
        'neuro': '5px 5px 10px #b8b8b8, -5px -5px 10px #ffffff',
        'neuro-inset': 'inset 5px 5px 10px #d9d9d9, inset -5px -5px 10px #ffffff',
        'glass': '0 8px 32px 0 rgba(107, 15, 26, 0.08)',
        'glass-lg': '0 20px 60px 0 rgba(107, 15, 26, 0.12)',
        'premium': '0 10px 40px -10px rgba(107, 15, 26, 0.15)',
        'premium-lg': '0 20px 60px -15px rgba(107, 15, 26, 0.2)',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(circle, var(--tw-gradient-stops))',
        'gradient-radial-at-t': 'radial-gradient(circle at top, var(--tw-gradient-stops))',
        'gradient-radial-at-b': 'radial-gradient(circle at bottom, var(--tw-gradient-stops))',
        'heritage-dark': 'linear-gradient(180deg, hsl(0, 65%, 5%) 0%, hsl(357, 76%, 11%) 100%)',
        'aurora-glow': 'radial-gradient(ellipse 800px 600px at bottom center, hsla(41, 42%, 57%, 0.25) 0%, transparent 70%)',
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' }
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' }
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' }
        },
        'shimmer': {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' }
        },
        'pulse-gold': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.5' }
        },
        'slide-up-fade': {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        },
        'scale-up': {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' }
        },
        'hero-title': {
          '0%': { 
            opacity: '0', 
            transform: 'translateY(30px) scale(0.95)',
            filter: 'blur(10px)'
          },
          '100%': { 
            opacity: '1', 
            transform: 'translateY(0) scale(1)',
            filter: 'blur(0px)'
          }
        },
        'hero-subtitle': {
          '0%': { 
            opacity: '0', 
            transform: 'translateY(20px)',
          },
          '100%': { 
            opacity: '1', 
            transform: 'translateY(0)',
          }
        },
        'search-bar-float': {
          '0%': { 
            opacity: '0', 
            transform: 'translateY(40px) scale(0.95)',
          },
          '100%': { 
            opacity: '1', 
            transform: 'translateY(0) scale(1)',
          }
        }
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'float': 'float 3s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'pulse-gold': 'pulse-gold 2s ease-in-out infinite',
        'slide-up-fade': 'slide-up-fade 0.4s ease-out',
        'scale-up': 'scale-up 0.3s ease-out',
        'hero-title': 'hero-title 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.2s forwards',
        'hero-subtitle': 'hero-subtitle 0.6s ease-out 0.5s forwards',
        'search-bar-float': 'search-bar-float 0.7s cubic-bezier(0.16, 1, 0.3, 1) 0.7s forwards'
      }
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;