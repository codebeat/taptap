/** @type {import('tailwindcss').Config} */
export default {
    content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
    theme: {
        extend: {
            animation: {
                meteor: "meteor 5s linear infinite",
            },
            keyframes: {
                meteor: {
                    "0%": { transform: "rotate(215deg) translateX(0)", opacity: 1 },
                    "70%": { opacity: 1 },
                    "100%": {
                        transform: "rotate(215deg) translateX(-500px)",
                        opacity: 0,
                    },
                },
            },
            fontFamily: {
                'sfRegular': ["SFregular"],
                'sfSemi': ["SFsemi"]
            },
            screens: {
                'small': { 'raw': '(max-height: 600px)' },
                // => @media (min-height: 800px) { ... }
            }
        },
    },
    plugins: [],
};