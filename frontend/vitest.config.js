// vite.config.js
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  
  // Preview settings for deployed frontend
  preview: {
    allowedHosts: ['unique-freedom-production-db37.up.railway.app']
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