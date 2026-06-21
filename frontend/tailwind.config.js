/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: "#ff85a2", // Soft pink
                secondary: "#fce4ec", // Pastel pink
            }
        },
    },
    plugins: [],
}
