import { defineConfig, loadEnv } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  const env = loadEnv(mode, process.cwd(), '')
  
  return {
    plugins: [react()],

    // Development server configuration
    server: {
      proxy: {
        '/api': {
          target: env.VITE_API_URL || 'http://localhost:5000',
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
          target: env.VITE_API_URL || 'http://localhost:5000',
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
  }
})