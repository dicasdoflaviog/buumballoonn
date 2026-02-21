import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    // Forçar modo claro desativando estratégia de classe ou mídia
    darkMode: "class",
    theme: {
        extend: {
            colors: {
                primary: "#F47C6C", // Coral Original
                "primary-green": "#1E9E55",
                "green-hover": "#168347",
                "background-main": "#F9F6F4",
                "text-dark": "#1A1A1A",
                "text-muted": "#6B7280",
                // Manter aliases de compatibilidade
                "background-light": "#F9F6F4",
                "bubble-user": "#F47C6C",
            },
            fontFamily: {
                display: ["Montserrat", "sans-serif"],
                sans: ["Montserrat", "sans-serif"],
            },
            borderRadius: {
                DEFAULT: "1rem",
                lg: "2rem",
                xl: "3rem",
                full: "9999px",
            },
        },
    },
    plugins: [],
};
export default config;
