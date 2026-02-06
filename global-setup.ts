import { FullConfig } from '@playwright/test';
import { startOrbit } from './core/config/start';

/**
 * Global setup executed before all tests
 */
async function globalSetup(config: FullConfig) {
  // Start ORBIT - shows ASCII art, validates dev config, displays launch info
  const baseUrl = config.projects[0]?.use?.baseURL;
  startOrbit(baseUrl);

  // TODO: Integrate emit service here for user acquisition
  // This will be implemented when we create the emit service
}

export default globalSetup;
