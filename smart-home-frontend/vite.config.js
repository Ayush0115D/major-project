import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      '/esp': {
        target: 'http://192.168.1.1',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/esp/, '') // removes /esp prefix
      }
    }
  }
})
