import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { VitePWA } from "vite-plugin-pwa";

// https://vite.dev/config/
export default defineConfig({
  base: "/react-jomasio-adventures/",
  plugins: [
    react(),

    VitePWA({
      registerType: "autoUpdate",

      includeAssets: ["favicon.ico"],
      devOptions: {
        enabled: true,
      },
      workbox: {
        globPatterns: ["**/*.{js,css,html}"],
        runtimeCaching: [
          {
            urlPattern: /\.(png|svg|gif)$/i,
            handler: "CacheFirst",
            options: {
              cacheName: "images",
            },
          },
          {
            urlPattern: /\.(mp3|m4a)$/i,
            handler: "CacheFirst",
            options: {
              cacheName: "audio",
            },
          },
        ],
      },

      manifest: {
        name: "Jomásio Adventures",
        short_name: "Jomásio Adventures",
        description: "RPG estilo retrô com batalhas, exploração e missões.",
        theme_color: "#121B31",
        background_color: "#0A0500",
        display: "standalone",
        start_url: "/react-jomasio-adventures/",
        scope: "/react-jomasio-adventures/",
        id: "/react-jomasio-adventures/",

        icons: [
          {
            src: "pwa-192x192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "pwa-512x512.png",
            sizes: "512x512",
            type: "image/png",
          },
          {
            src: "pwa-maskable-512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable",
          },
        ],
      },
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    host: true,
    port: 5173,
    proxy: {
      "/api": {
        target: "http://localhost:3001",
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
