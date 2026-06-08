/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['Cormorant Garamond', 'serif'],
        sans: ['Syne', 'sans-serif'],
        arabic: ['Noto Kufi Arabic', 'sans-serif'],
      },
      colors: {
        ink: {
          DEFAULT: '#08080e',
          2: '#0f0f1a',
          3: '#161622',
          4: '#1c1c2c',
        },
        card: {
          DEFAULT: '#1e1e30',
          2: '#242438',
        },
        rim: {
          DEFAULT: '#2c2c44',
          2: '#383858',
        },
        gold: {
          DEFAULT: '#e8b84b',
          2: '#c99a2e',
        },
        mist: '#8080a8',
        fog: '#505075',
        ghost: '#b0b0d0',
        sage: '#7bc67e',
        teal: '#2ec4b6',
        coral: '#ff6b6b',
        violet: '#9b8cf7',
      },
    },
  },
  plugins: [],
}
