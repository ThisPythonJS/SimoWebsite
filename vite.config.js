import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

export default defineConfig({
  server: {
    host: "0.0.0.0",
    proxy: {
      "/api": {
        target: "https://api-simo.squareweb.app",
        changeOrigin: true,
        secure: true,
        ws: true,
      },
    },
  },
  preview: {
    allowedHosts: ["simo.squareweb.app"],
    proxy: {
      "/api": {
        target: "https://api-simo.squareweb.app",
        changeOrigin: true,
        secure: true,
        ws: true,
      },
    },
  },
  plugins: [react()],
});
