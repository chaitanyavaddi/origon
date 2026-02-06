import { releaseAll } from './core/emit';

/**
 * Global teardown executed after all tests complete
 * Ensures all acquired users are released back to emit service
 */
export default async function globalTeardown() {
  console.log('\n\x1b[36m🧹 Global Teardown: Releasing all acquired users...\x1b[0m');

  try {
    await releaseAll();
    console.log('\x1b[32m✓ All users released successfully\x1b[0m\n');
  } catch (error) {
    console.error('\x1b[31m✗ Failed to release some users:\x1b[0m', error);
  }
}
