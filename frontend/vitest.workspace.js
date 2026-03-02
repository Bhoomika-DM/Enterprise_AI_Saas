import { defineWorkspace } from 'vitest/config'

export default defineWorkspace([
  {
    test: {
      name: 'unit',
      globals: true,
      environment: 'jsdom',
      include: ['**/__tests__/**/*.test.{ts,tsx}'],
    },
  },
])
