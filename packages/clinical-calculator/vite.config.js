import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath } from 'url'
import { dirname } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  plugins: [react()],
  base: '/clinical-calculator/',
  resolve: {
    alias: {
      shared: fileURLToPath(new URL('../shared', import.meta.url))
    }
  },
  build: {
    outDir: 'dist'
  }
})
