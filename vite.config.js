import { defineConfig } from "vite";
import path from "path";

// Plugins
import react from "@vitejs/plugin-react-swc";
import { VitePWA } from "vite-plugin-pwa";
import { qrcode } from "vite-plugin-qrcode";

// Files
import manifest from "./manifest.json";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      // Registering PWA
      registerType: "autoUpdate",
      injectRegister: "script",

      // Workbox
      workbox: {
        clientsClaim: true,
        skipWaiting: true,
      },

      // Manifest
      includeAssets: ["favicon.ico", "apple-touch-icon.png", "mask-icon.svg"],
      manifest: manifest,
    }),
    qrcode(),
  ],
  // server: {
  //   https: {
  //     key: path.resolve(__dirname, "key.pem"),
  //     cert: path.resolve(__dirname, "cert.pem"),
  //   },
  // },
});
