import fs from 'fs';
import path from 'path';
import os from 'os';

export interface DeveloperConfig {
  name: string;
  email: string;
  emailPrefix: string;
  registeredAt: string;
}

export interface LaunchContext {
  launchId: string;
  executionId: string;
  environment: 'local' | 'github' | 'jenkins' | 'gitlab' | 'circleci' | 'ci';
  developer?: DeveloperConfig;
  hostname: string;
  timestamp: string;
}

/**
 * Detect CI environment
 */
export function detectCIEnvironment(): LaunchContext['environment'] {
  if (process.env.GITHUB_ACTIONS) return 'github';
  if (process.env.JENKINS_URL || process.env.JENKINS_HOME) return 'jenkins';
  if (process.env.GITLAB_CI) return 'gitlab';
  if (process.env.CIRCLECI) return 'circleci';
  if (process.env.CI === 'true') return 'ci';
  return 'local';
}

/**
 * Load developer config from dev.json
 */
export function loadDeveloperConfig(): DeveloperConfig | undefined {
  const devConfigPath = path.join(__dirname, 'dev.json');

  if (!fs.existsSync(devConfigPath)) {
    return undefined;
  }

  try {
    const content = fs.readFileSync(devConfigPath, 'utf-8');
    return JSON.parse(content);
  } catch (error) {
    console.warn('Failed to load developer config:', error);
    return undefined;
  }
}

/**
 * Generate timestamp in format DDMMYYYYHHMMSS
 */
export function generateTimestamp(): string {
  const now = new Date();

  const day = String(now.getDate()).padStart(2, '0');
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const year = now.getFullYear();
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');

  return `${day}${month}${year}${hours}${minutes}${seconds}`;
}

/**
 * Generate launch ID
 */
export function generateLaunchId(
  environment: LaunchContext['environment'],
  timestamp: string,
  identifier: string
): string {
  return `${environment}_launch_${timestamp}_${identifier}`;
}

/**
 * Generate execution ID
 */
export function generateExecutionId(
  environment: LaunchContext['environment'],
  timestamp: string,
  identifier: string
): string {
  return `${environment}_execution_${timestamp}_${identifier}`;
}

/**
 * Get identifier for ID generation
 * For local: uses developer email prefix
 * For CI: uses CI-specific identifiers
 */
export function getIdentifier(
  environment: LaunchContext['environment'],
  developer?: DeveloperConfig
): string {
  switch (environment) {
    case 'github':
      return process.env.GITHUB_ACTOR || process.env.GITHUB_REPOSITORY_OWNER || 'github';

    case 'jenkins':
      return process.env.BUILD_USER || process.env.JOB_NAME || 'jenkins';

    case 'gitlab':
      return process.env.GITLAB_USER_LOGIN || process.env.CI_PROJECT_NAME || 'gitlab';

    case 'circleci':
      return process.env.CIRCLE_USERNAME || process.env.CIRCLE_PROJECT_USERNAME || 'circleci';

    case 'ci':
      return 'ci';

    case 'local':
    default:
      return developer?.emailPrefix || 'unknown';
  }
}

/**
 * Initialize launch context
 * Checks for external IDs, generates local IDs if needed
 */
export function initializeLaunchContext(): LaunchContext {
  const environment = detectCIEnvironment();
  const developer = environment === 'local' ? loadDeveloperConfig() : undefined;
  const timestamp = generateTimestamp();
  const identifier = getIdentifier(environment, developer);
  const hostname = os.hostname();

  // Check for external IDs from environment variables
  const externalLaunchId = process.env.LAUNCH_ID;
  const externalExecutionId = process.env.EXECUTION_ID;

  let launchId: string;
  let executionId: string;

  if (externalLaunchId && externalExecutionId) {
    // Use external IDs if provided
    launchId = externalLaunchId;
    executionId = externalExecutionId;
  } else if (externalLaunchId || externalExecutionId) {
    // If only one is provided, throw error for consistency
    throw new Error(
      'Both LAUNCH_ID and EXECUTION_ID must be provided together. ' +
      `Found: ${externalLaunchId ? 'LAUNCH_ID' : 'EXECUTION_ID'}`
    );
  } else {
    // Generate local IDs
    launchId = generateLaunchId(environment, timestamp, identifier);
    executionId = generateExecutionId(environment, timestamp, identifier);
  }

  return {
    launchId,
    executionId,
    environment,
    developer,
    hostname,
    timestamp,
  };
}

/**
 * Global launch context instance
 */
let _launchContext: LaunchContext | null = null;

/**
 * Get or initialize launch context (singleton)
 */
export function getLaunchContext(): LaunchContext {
  if (!_launchContext) {
    _launchContext = initializeLaunchContext();
  }
  return _launchContext;
}

/**
 * Set launch context (for testing or manual override)
 */
export function setLaunchContext(context: LaunchContext): void {
  _launchContext = context;
}

/**
 * Reset launch context (for testing)
 */
export function resetLaunchContext(): void {
  _launchContext = null;
}
