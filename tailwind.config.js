/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    fontFamily: { sans: 'Roboto Mono, monospace' }, // Custom font from google fonts, we give name sans it will override the default sans font
    extend: {
      fontSize: {
        huge: ['80rem', { lineHeight: '1' }],
      },
      height: { screen: '100dvh' },
    },
  },
  plugins: [],
};
