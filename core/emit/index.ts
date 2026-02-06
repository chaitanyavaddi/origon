/**
 * Emit Service - Test Data Management
 *
 * Provides fluent API for acquiring and releasing test users from emit service.
 *
 * Usage example:
 *
 * ```typescript
 * import { emit } from '@/core/emit';
 *
 * // Acquire users
 * const pool = await emit
 *   .forExecution('test_123')
 *   .require({ client: 2, thirdparty: 1 })
 *   .withMaxRetries(10)
 *   .acquire();
 *
 * // Access users
 * const client1 = pool.getClients()[0];
 * const client2 = pool.getClients()[1];
 * const thirdParty = pool.getThirdParty()[0];
 *
 * // Release users
 * await emit.forExecution('test_123').release();
 * ```
 */

// Export types
export * from './types';

// Export classes
export { EmitClient } from './EmitClient';
export { EmitBuilder } from './EmitBuilder';
export { UserPool } from './UserPool';
export { Launch } from './Launch';
export { Execution } from './Execution';

// Export singleton emit builder instance
import { EmitBuilder } from './EmitBuilder';
import { EmitClient } from './EmitClient';

/**
 * Main emit instance - use this for all emit operations
 *
 * @example
 * ```typescript
 * const pool = await emit
 *   .forExecution('test_123')
 *   .require({ client: 1 })
 *   .acquire();
 * ```
 */
export const emit = new EmitBuilder(EmitClient.getInstance());

/**
 * Get emit client instance (for advanced usage)
 */
export function getEmitClient(): EmitClient {
  return EmitClient.getInstance();
}

/**
 * Release all acquired users (cleanup utility)
 */
export async function releaseAll(): Promise<void> {
  const client = EmitClient.getInstance();
  await client.releaseAll();
}
