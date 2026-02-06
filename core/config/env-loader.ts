/**
 * Simple environment variable loader
 * Loads from .env file via dotenv
 */

// Get environment value with fallback
function getEnv(key: string, defaultValue: string = ''): string {
  return process.env[key] || defaultValue;
}

// Get environment value as number
function getEnvNumber(key: string, defaultValue: number): number {
  const value = process.env[key];
  return value ? parseInt(value, 10) : defaultValue;
}

// Get environment value as boolean
function getEnvBoolean(key: string, defaultValue: boolean): boolean {
  const value = process.env[key];
  if (!value) return defaultValue;
  return value.toLowerCase() === 'true' || value === '1';
}

export const env = {
  // Application Environment
  ENV: getEnv('ENV', 'test'),

  // Base URLs
  CERTA_TEST_URL: getEnv('CERTA_TEST_URL', 'https://ecatest.certaqa.com'),
  CERTA_STAGING_URL: getEnv('CERTA_STAGING_URL', 'https://staging.certaqa.com'),
  CERTA_PROD_URL: getEnv('CERTA_PROD_URL', 'https://app.getcerta.com'),

  // Emit Service
  EMIT_API_URL: getEnv('EMIT_API_URL', 'http://emit-alb-1155756710.us-east-1.elb.amazonaws.com/api/v1'),

  // Test Execution IDs
  LAUNCH_ID: getEnv('LAUNCH_ID'),
  EXECUTION_ID: getEnv('EXECUTION_ID'),

  // Timeouts
  DEFAULT_TIMEOUT: getEnvNumber('DEFAULT_TIMEOUT', 30000),
  ACTION_TIMEOUT: getEnvNumber('ACTION_TIMEOUT', 10000),

  // Retry Configuration
  TEST_RETRIES: getEnvNumber('TEST_RETRIES', 0),
  TEST_RETRIES_CI: getEnvNumber('TEST_RETRIES_CI', 2),

  // Worker Configuration
  TEST_WORKERS: getEnvNumber('TEST_WORKERS', 4),
  TEST_WORKERS_CI: getEnvNumber('TEST_WORKERS_CI', 1),

  // CI Detection
  CI: getEnvBoolean('CI', false),
};

/**
 * Get base URL based on ENV
 */
export function getBaseUrl(): string {
  switch (env.ENV) {
    case 'staging':
      return env.CERTA_STAGING_URL;
    case 'prod':
      return env.CERTA_PROD_URL;
    case 'test':
    default:
      return env.CERTA_TEST_URL;
  }
}
