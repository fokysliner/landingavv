/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html","./src/**/*.{vue,ts,js,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50:"#fff1f1",100:"#ffe0df",200:"#ffc2c1",300:"#ff9f9d",
          400:"#ff7a75",500:"#ff5a59",600:"#e24645",700:"#bf302f",
          800:"#9c2424",900:"#731a1a" // головний — 500
        },
      },
      fontFamily:{ 
        sans:['Manrope','Inter','system-ui','sans-serif']
      },
      boxShadow:{ 
        soft:'0 18px 60px -25px rgba(255,90,89,.25)' 
      },
      backdropBlur: { 
        12: '12px' 
      },
      backgroundImage: {
        'diag-mask': 'linear-gradient(135deg, rgba(255,255,255,.06) 0 25%, transparent 25% 50%, rgba(255,255,255,.06) 50% 75%, transparent 75% 100%)',
      },
      keyframes: {
        'slow-zoom': {
          '0%': { transform: 'scale(1)' },
          '100%': { transform: 'scale(1.1)' }
        },
        'zoom': {
          '0%': { transform: 'scale(1)' },
          '100%': { transform: 'scale(1.06)' }
        },
        'zoom-slow': {
          '0%': { transform: 'scale(1)' },
          '100%': { transform: 'scale(1.08)' }
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' }
        },
        'underline': {
          '0%':   { width: '0%' },
          '100%': { width: '100%' }
        }
      },
      animation: {
        'slow-zoom': 'slow-zoom 24s ease-in-out infinite alternate',
        'zoom': 'zoom 18s ease-in-out infinite alternate',
        'zoom-slow': 'zoom-slow 22s ease-in-out infinite alternate',
        'float': 'float 6s ease-in-out infinite',
        'underline': 'underline 1.2s ease forwards'
      }
    }
  },
  plugins:[]
}
