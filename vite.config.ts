import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"
import checker from "vite-plugin-checker"

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [
    react(),
    mode === "development" && checker({
      eslint: {
        lintCommand: "eslint ./src/**/*.{ts,tsx}"
      }
    })
  ],
  build: {
    manifest: true,
    sourcemap: true
  }
}))
