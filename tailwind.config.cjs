module.exports = {
  content: [
    "./index.html",
    "./App.tsx",
    "./components/**/*.{ts,tsx}",
    "./hooks/**/*.{ts,tsx}",
    "./data/**/*.{ts,tsx}",
    "./utils/**/*.{ts,tsx}",
    "./index.tsx"
  ],
  theme: {
    extend: {
      colors: {
        'brand-bg': '#151515',
        'brand-card': '#1C1C1E',
        'brand-accent': '#B0865E',
        'brand-text-primary': '#FCFBF4',
        'brand-text-secondary': '#D4CFCF',
      },
    },
  },
  plugins: [],
};
