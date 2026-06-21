import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // ✅ Ensure correct base path
  base: '/',
  build: {
    // ✅ Ensure output goes to dist
    outDir: 'dist'
  }
})
