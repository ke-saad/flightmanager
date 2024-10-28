import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: [{ find: "@", replacement: "/src" }],
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8080', // Remplacez par l'URL de votre backend
        changeOrigin: true,
        rewrite: path => path.replace(/^\/api/, '') // Enlève le préfixe '/api' avant de faire la requête au serveur
      }
    }
  }
});
