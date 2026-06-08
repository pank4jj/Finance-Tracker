module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f5f9ff',
          100: '#e6f0ff',
          200: '#c7deff',
          300: '#9ec1ff',
          400: '#6aa0ff',
          500: '#357fff',
          600: '#2c66e6',
          700: '#234fba',
          800: '#1a3b8f',
          900: '#12286a'
        },
        glass: 'rgba(255,255,255,0.06)'
      },
      fontFamily: {
        inter: ['Inter', 'ui-sans-serif', 'system-ui'],
        manrope: ['Manrope', 'ui-sans-serif', 'system-ui']
      },
      boxShadow: {
        'soft-lg': '0 10px 30px rgba(12,24,64,0.12)'
      }
    },
  },
  plugins: [],
}
