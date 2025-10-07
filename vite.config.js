import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

export default defineConfig({
  server: {
    host: "0.0.0.0",
    port: 80,
    proxy: {
      "/api": {
        target: "http://api-simo.squareweb.app/api",
        changeOrigin: true,
        secure: false,
        ws: true,
      },
    },
  },
  preview: {
    allowedHosts: ["simo.squareweb.app", "api-simo.squareweb.app"],
  },
  plugins: [react()],
});
