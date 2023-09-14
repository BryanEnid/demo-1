import { defineConfig } from "vite";
import path from "path";

// Plugins
import react from "@vitejs/plugin-react-swc";
import { VitePWA } from "vite-plugin-pwa";
import { qrcode } from "vite-plugin-qrcode";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), VitePWA(), qrcode()],
  // server: {
  //   https: {
  //     key: path.resolve(__dirname, "key.pem"),
  //     cert: path.resolve(__dirname, "cert.pem"),
  //   },
  // },
});
