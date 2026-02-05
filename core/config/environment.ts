export interface EnvironmentConfig {
  baseUrl: string;
  timeout: number;
}

export const environments: Record<string, EnvironmentConfig> = {
  test: {
    baseUrl: 'https://ecatest.certaqa.com',
    timeout: 30000,
  },
  staging: {
    baseUrl: 'https://staging.certaqa.com',
    timeout: 30000,
  },
  prod: {
    baseUrl: 'https://app.getcerta.com',
    timeout: 30000,
  },
};

export function getConfig(): EnvironmentConfig {
  const env = process.env.ENV || 'test';
  return environments[env] || environments.test;
}