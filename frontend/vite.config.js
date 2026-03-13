import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  root: '.',
  server: {
    port: 3000,
    proxy: {
      '/upload':        { target: 'http://localhost:5000', changeOrigin: true },
      '/generate-quiz': { target: 'http://localhost:5000', changeOrigin: true },
      '/submit-quiz':   { target: 'http://localhost:5000', changeOrigin: true },
      '/quiz-history':  { target: 'http://localhost:5000', changeOrigin: true },
      '/quiz':          { target: 'http://localhost:5000', changeOrigin: true },
    }
  }
})