import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import { VitePWA } from "vite-plugin-pwa";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), VitePWA()],
  // server: {
  //   https: {
  //     key: path.resolve(__dirname, "key.pem"),
  //     cert: path.resolve(__dirname, "cert.pem"),
  //   },
  // },
});
