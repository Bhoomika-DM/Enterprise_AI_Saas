import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],

  // Development server configuration
  server: {
    proxy: {
      '/api': {
        target: process.env.VITE_API_URL || 'http://localhost:5000',
        changeOrigin: true,
        secure: false,
      }
    }
  },

  // Preview server configuration
  preview: {
    allowedHosts: "all",
    proxy: {
      '/api': {
        target: process.env.VITE_API_URL || 'http://localhost:5000',
        changeOrigin: true,
        secure: false,
      }
    }
  },

  test: {
    globals: true,
    environment: 'jsdom',
    pool: 'vmThreads',
    include: ['**/__tests__/**/*.test.{ts,tsx}'],
    css: false,
    setupFiles: ['./vitest-setup.js'],
  },
})