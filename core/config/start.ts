import {
  getLaunchContext,
  loadDeveloperConfig,
  detectCIEnvironment,
} from './launch-context';

const ORBIT_ASCII = `
╔═══════════════════════════════════════════════════════════════╗
║                                                               ║
║   ██████╗ ██████╗ ██████╗ ██╗████████╗                      ║
║  ██╔═══██╗██╔══██╗██╔══██╗██║╚══██╔══╝                      ║
║  ██║   ██║██████╔╝██████╔╝██║   ██║                         ║
║  ██║   ██║██╔══██╗██╔══██╗██║   ██║                         ║
║  ╚██████╔╝██║  ██║██████╔╝██║   ██║                         ║
║   ╚═════╝ ╚═╝  ╚═╝╚═════╝ ╚═╝   ╚═╝                         ║
║                                                               ║
║              Test Automation Framework                        ║
║                    by Certa                                   ║
║                                                               ║
╚═══════════════════════════════════════════════════════════════╝
`;

/**
 * Display ORBIT ASCII art
 */
export function showOrbitArt(): void {
  console.log('\x1b[36m%s\x1b[0m', ORBIT_ASCII);
}

/**
 * Validate developer configuration for local environment
 * Throws error if dev.json is missing
 */
export function validateDeveloperConfig(): void {
  const environment = detectCIEnvironment();

  if (environment === 'local') {
    const devConfig = loadDeveloperConfig();

    if (!devConfig) {
      console.error('\n\x1b[31m╔═══════════════════════════════════════════════════════════════╗\x1b[0m');
      console.error('\x1b[31m║                   ❌ SETUP REQUIRED                          ║\x1b[0m');
      console.error('\x1b[31m╚═══════════════════════════════════════════════════════════════╝\x1b[0m\n');
      console.error('\x1b[31m✗ Developer not registered!\x1b[0m');
      console.error('\x1b[33m  Please run the setup command:\x1b[0m\n');
      console.error('\x1b[36m    npm run setup\x1b[0m\n');
      console.error('\x1b[90m  This is a one-time configuration to register your developer profile.\x1b[0m');
      console.error('\x1b[90m  Required for tracking test executions and generating unique IDs.\x1b[0m\n');
      throw new Error('Developer configuration missing. Run: npm run setup');
    }
  }
}

/**
 * Display launch context information
 */
export function displayLaunchInfo(baseUrl?: string): void {
  const environment = detectCIEnvironment();
  const launchContext = getLaunchContext();
  const devConfig = environment === 'local' ? loadDeveloperConfig() : undefined;

  console.log(`\x1b[33m🌍 Environment:\x1b[0m ${environment}`);

  if (devConfig) {
    console.log(`\x1b[33m👤 Developer:\x1b[0m ${devConfig.name} (${devConfig.email})`);
  }

  console.log(`\x1b[33m🚀 Launch ID:\x1b[0m ${launchContext.launchId}`);
  console.log(`\x1b[33m▶️  Execution ID:\x1b[0m ${launchContext.executionId}`);

  if (baseUrl) {
    console.log(`\x1b[33m🌐 Base URL:\x1b[0m ${baseUrl}`);
  }
}

/**
 * Complete startup sequence
 * - Shows ASCII art
 * - Validates dev config
 * - Displays launch info
 */
export function startOrbit(baseUrl?: string): void {
  showOrbitArt();
  validateDeveloperConfig();
  displayLaunchInfo(baseUrl);
  console.log('\n\x1b[32m✓ Initialization complete\x1b[0m');
  console.log('\x1b[90m' + '─'.repeat(63) + '\x1b[0m\n');
}
