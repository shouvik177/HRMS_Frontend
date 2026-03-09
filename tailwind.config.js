/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        "primary-bg": "#0f0f0f",
        "secondary-bg": "#1a1a1a",
        "card-bg": "#222222",
        "border-dark": "#2e2e2e",
        "text-primary": "#f5f5f5",
        "text-secondary": "#a1a1a1",
        "accent-grey": "#3b3b3b",
      },
      boxShadow: {
        card: "0 10px 25px -12px rgba(0, 0, 0, 0.8)",
      },
    },
  },
  plugins: [],
};
