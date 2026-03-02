/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        mono: ['Plus Jakarta Sans', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        heading: ['Plus Jakarta Sans', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
      },
      fontWeight: {
        light: '300',
        normal: '400',
        medium: '500',
        semibold: '600',
        bold: '700',
      },
      colors: {
        // Core Backgrounds (Darker Base)
        'app-bg': '#515151',
        'section-bg': 'rgb(10, 15, 35)',
        'card-bg': 'rgb(15, 20, 40)',
        
        // Text Colors
        'text-primary': 'rgb(229, 231, 235)',
        'text-body': 'rgb(156, 163, 175)',
        'text-muted': 'rgb(107, 114, 128)',
        
        // Accent Colors (Copper/Bronze)
        'accent-primary': '#C96731',
        'accent-secondary': 'rgb(34, 211, 238)',
        
        // Borders
        'border-subtle': 'rgba(255, 255, 255, 0.08)',
        'border-hover': 'rgba(201, 103, 49, 0.4)',
      },
      fontSize: {
        'hero': ['48px', { lineHeight: '1.2', letterSpacing: '-0.01em' }],
        'hero-lg': ['56px', { lineHeight: '1.2', letterSpacing: '-0.01em' }],
      },
      boxShadow: {
        'glow-primary': '0 0 40px rgba(201, 103, 49, 0.3)',
        'glow-secondary': '0 0 40px rgba(34, 211, 238, 0.25)',
        'card': '0 4px 24px rgba(0, 0, 0, 0.6)',
        'card-hover': '0 8px 32px rgba(0, 0, 0, 0.7)',
      },
      backdropBlur: {
        'xs': '2px',
      },
    },
  },
  plugins: [],
}
