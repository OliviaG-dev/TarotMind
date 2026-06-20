import { defineConfig, devices } from '@playwright/test'

const E2E_API_PORT = process.env.E2E_API_PORT ?? '4010'
const E2E_CLIENT_PORT = process.env.E2E_CLIENT_PORT ?? '5174'
const E2E_API_URL = `http://127.0.0.1:${E2E_API_PORT}`
const E2E_CLIENT_URL = `http://127.0.0.1:${E2E_CLIENT_PORT}`

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  timeout: 30_000,
  expect: { timeout: 8_000 },
  use: {
    baseURL: E2E_CLIENT_URL,
    trace: 'on-first-retry',
  },
  webServer: [
    {
      command: 'npm run dev:server',
      cwd: '..',
      url: `${E2E_API_URL}/health`,
      reuseExistingServer: false,
      timeout: 120_000,
      env: {
        AI_DISABLED: '1',
        PORT: E2E_API_PORT,
      },
    },
    {
      command: `npm run dev -- --host 127.0.0.1 --port ${E2E_CLIENT_PORT}`,
      url: E2E_CLIENT_URL,
      reuseExistingServer: false,
      timeout: 120_000,
      env: {
        VITE_DEV_API_PROXY: E2E_API_URL,
      },
    },
  ],
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
  ],
})
