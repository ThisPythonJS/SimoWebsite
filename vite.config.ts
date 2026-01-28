import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

export default defineConfig({
    server: {
        host: '0.0.0.0',
        port: 8080,
        proxy: {
            "/api": {
                target: "http://simoapi:3333",
                changeOrigin: true,
                secure: false,
                ws: true,
            },
        },
    },
    plugins: [react()],
});
