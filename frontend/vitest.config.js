import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    pool: 'vmThreads',
    include: ['**/__tests__/**/*.test.{ts,tsx}'],
    css: false,
    setupFiles: ['./vitest-setup.js'],
  },
})
