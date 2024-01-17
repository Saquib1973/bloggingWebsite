const defaultTheme = require("tailwindcss/defaultTheme");

const svgToDataUri = require("mini-svg-data-uri");

const colors = require("tailwindcss/colors");
const {
    default: flattenColorPalette,
} = require("tailwindcss/lib/util/flattenColorPalette");
const { createThemes } = require("tw-colors");


/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: "class",
    content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
    theme: {

        extend: {
            colors: {
                'whiteBg': '#FFFFFF',
                // 'black': '#242424',
                // 'grey': '#F3F3F3',
                // 'dark-grey': '#6B6B6B',
                // 'red': '#FF4E4E',
                // 'transparent': 'transparent',
                // 'twitter': '#1DA1F2',
                'purpleBg': '#8B46FF'
            },

            fontSize: {
                'sm': '12px',
                'base': '14px',
                'xl': '16px',
                '2xl': '20px',
                '3xl': '28px',
                '4xl': '38px',
                '5xl': '50px',
            },

            fontFamily: {
                inter: ["'Inter'", "sans-serif"],
                gelasio: ["'Gelasio'", "serif"]
            },
        },

    },
    plugins: [
        createThemes({
            light: {
                'white': '#FFFFFF',
                'black': '#242424',
                'grey': '#F3F3F3',
                'dark-grey': '#6B6B6B',
                'red': '#FF4E4E',
                'transparent': 'transparent',
                'twitter': '#1DA1F2',
                'purple': '#8B46FF'
            },
            dark: {
                'white': '#242424',
                'black': '#F3F3F3',
                'grey': '#2A2A2A',
                'dark-grey': '#E7E7E7',
                'red': '#991F1F',
                'transparent': 'transparent',
                'twitter': '#0E71A8',
                'purple': '#582C8E',
                'red': '#FF004D',
                'grey-50': "#242424",
                'grey-500': "#FFFFFF"
            }
        }),
        require("@tailwindcss/aspect-ratio"),
        addVariablesForColors,
        function ({ matchUtilities, theme }) {
            matchUtilities(
                {
                    "bg-grid": (value) => ({
                        backgroundImage: `url("${svgToDataUri(
                            `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="32" height="32" fill="none" stroke="${value}"><path d="M0 .5H31.5V32"/></svg>`
                        )}")`,
                    }),
                    "bg-dot": (value) => ({
                        backgroundImage: `url("${svgToDataUri(
                            `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="16" height="16" fill="none"><circle fill="${value}" id="pattern-circle" cx="10" cy="10" r="1.6257413380501518"></circle></svg>`
                        )}")`,
                    }),
                },
                { values: flattenColorPalette(theme("backgroundColor")), type: "color" }
            );
        },
    ],
};

function addVariablesForColors({ addBase, theme }) {
    let allColors = flattenColorPalette(theme("colors"));
    let newVars = Object.fromEntries(
        Object.entries(allColors).map(([key, val]) => [`--${key}`, val])
    );

    addBase({
        ":root": newVars,
    });
}