export default {
    content: ["./src/**/*.{html,js,ts,jsx,tsx}"],
    theme: {
        screens: {
            xl: { max: "950px" },
            xp: { max: "460px" },
            xlr: { min: "950px" },
            sm: { max: "640px" },
            md: { max: "768px" },
            lg: { max: "1024px" }
        },
        extend: {
            colors: {
                primary: {
                    DEFAULT: '#1363a2',
                    light: '#1a7bc4',
                    dark: '#0f4f82',
                },
                accent: {
                    DEFAULT: '#00d4aa',
                    secondary: '#3b82f6',
                },
                dark: {
                    bg: '#0a0a0f',
                    card: '#12121a',
                    'card-hover': '#1a1a25',
                    elevated: '#16161f',
                    border: '#1f1f2e',
                },
                text: {
                    primary: '#ffffff',
                    secondary: '#a0a0b0',
                    muted: '#6b6b7b',
                }
            },
            fontFamily: {
                sans: ['Plus Jakarta Sans', 'Inter', 'sans-serif'],
            },
            animation: {
                'float': 'float 6s ease-in-out infinite',
                'pulse-glow': 'pulse-glow 3s ease-in-out infinite',
            }
        }
    },
    plugins: [require("tailwind-scrollbar"), require("@tailwindcss/typography")],
};
