import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"
import checker from "vite-plugin-checker"

// https://vitejs.dev/config/
// eslint-disable-next-line no-restricted-syntax
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
