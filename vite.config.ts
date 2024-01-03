import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"
import vitePluginFaviconsInject from "vite-plugin-favicons-inject";
export default defineConfig({
  plugins: [react(),vitePluginFaviconsInject("./assets/logo.png") ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})