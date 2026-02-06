import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';
import { env, getBaseUrl } from './core/config/env-loader';

// Load environment variables from .env file
dotenv.config();

export default defineConfig({
  testDir: './tests',
  timeout: env.DEFAULT_TIMEOUT,
  retries: env.CI ? env.TEST_RETRIES_CI : env.TEST_RETRIES,
  workers: env.CI ? env.TEST_WORKERS_CI : env.TEST_WORKERS,

  // Global setup - runs before all tests
  globalSetup: './global-setup.ts',

  // Global teardown - runs after all tests
  globalTeardown: './global-teardown.ts',

  reporter: [
    ['html'],
    ['list'],
    ['allure-playwright', {
      outputFolder: 'allure-results',
      detail: true,
      suiteTitle: true,
    }],
  ],

  use: {
    baseURL: getBaseUrl(),
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    actionTimeout: env.ACTION_TIMEOUT,
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    }
  ],
});