module.exports = {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Airbnb Rausch — the single brand accent
        rausch: '#ff385c',
        'rausch-active': '#e00b41',
        'rausch-disabled': '#ffd1da',
        // Text
        ink: '#222222',
        'ink-body': '#3f3f3f',
        muted: '#6a6a6a',
        'muted-soft': '#929292',
        // Borders
        hairline: '#dddddd',
        'hairline-soft': '#ebebeb',
        'border-strong': '#c1c1c1',
        // Surfaces
        canvas: '#ffffff',
        'surface-soft': '#f7f7f7',
        'surface-strong': '#f2f2f2',
        // Semantic
        'error-text': '#c13515',
      },
      fontFamily: {
        sans: [
          'Inter',
          '-apple-system',
          'system-ui',
          'Roboto',
          '"Helvetica Neue"',
          'Arial',
          'sans-serif',
        ],
      },
      borderRadius: {
        'none': '0px',
        'xs': '4px',
        'sm': '8px',
        'md': '14px',
        'lg': '20px',
        'xl': '32px',
        'full': '9999px',
      },
      boxShadow: {
        // Airbnb's single shadow tier — hover cards, dropdowns, search bar
        'airbnb': 'rgba(0,0,0,0.02) 0 0 0 1px, rgba(0,0,0,0.04) 0 2px 6px 0, rgba(0,0,0,0.10) 0 4px 8px 0',
        // Lighter variant for resting cards
        'card': 'rgba(0,0,0,0.02) 0 0 0 1px, rgba(0,0,0,0.04) 0 2px 6px 0',
      },
      spacing: {
        'xxs': '2px',
        'xs': '4px',
        'section': '64px',
      },
      height: {
        'nav': '80px',
        'input': '56px',
        'btn': '48px',
        'search': '64px',
      },
    },
  },
  plugins: [],
}
