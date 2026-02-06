import { test as base, Browser, BrowserContext, Page } from '@playwright/test';
import { emit, UserPool, EmitUser, RoleRequirements } from '@/core/emit';
import { getLaunchContext } from '@/core/config/launch-context';
import { createCerta, Certa } from '@web/Certa';

/**
 * User context containing everything needed for a single user
 */
export interface UserContext {
  /** Browser context for this user */
  context: BrowserContext;
  /** Page for this user */
  page: Page;
  /** Certa instance for this user */
  certa: Certa;
  /** User from emit service */
  user: EmitUser;
}

/**
 * Options for declaring user requirements
 */
export interface UserRequirementsOption {
  userRequirements?: RoleRequirements;
}

/**
 * Multi-user fixture types
 */
interface MultiUserFixtures {
  /**
   * Array of user contexts - one per user requested
   * Each context has its own browser context, page, certa instance, and user
   */
  contexts: UserContext[];

  /**
   * User pool acquired from emit service
   */
  userPool: UserPool;

  /**
   * Helper to get user by role
   */
  getUser: (role: string, index?: number) => EmitUser;

  /**
   * Get first client user (shorthand)
   */
  clientUser: EmitUser;
}

/**
 * Extended test with multi-user support
 *
 * Usage:
 * ```typescript
 * test.describe('Multi-user tests', () => {
 *   test.use({ userRequirements: { client: 2, thirdparty: 1 } });
 *
 *   test('test', async ({ contexts }) => {
 *     const client1 = contexts[0];
 *     const client2 = contexts[1];
 *     const thirdparty1 = contexts[2];
 *
 *     // Each has page, context, certa, user
 *     await client1.certa.auth.loginAsAssociate(client1.user);
 *     await client2.certa.auth.loginAsAssociate(client2.user);
 *   });
 * });
 * ```
 */
export const test = base.extend<MultiUserFixtures & UserRequirementsOption>({
  // Option to specify user requirements (defaults to 2 clients)
  userRequirements: [{ client: 2, thirdparty: 0 }, { option: true }],

  /**
   * Acquire user pool per test
   * Automatically releases when test finishes
   */
  userPool: async ({ userRequirements }, use, testInfo) => {
    const launchContext = getLaunchContext();
    // Create unique execution ID per test
    const testExecutionId = `${launchContext.executionId}_test${testInfo.testId}`;

    // Use default requirements if none specified
    const requirements = userRequirements || { client: 2, thirdparty: 0 };

    console.log(`\x1b[36m[Test] Acquiring users...\x1b[0m`);
    console.log(`\x1b[90m  Requirements: ${JSON.stringify(requirements)}\x1b[0m`);

    // Acquire users from emit service
    const pool = await emit
      .forExecution(testExecutionId)
      .require(requirements)
      .withMaxRetries(10)
      .acquire();

    console.log(`\x1b[32m✓ Acquired ${pool.getAll().length} user(s)\x1b[0m`);

    // Provide pool to test
    await use(pool);

    // Teardown: release users when test finishes
    try {
      console.log(`\x1b[36m[Test] Releasing users...\x1b[0m`);
      await emit.forExecution(testExecutionId).release();
    } catch (error) {
      console.error(`\x1b[31m[Test] Failed to release users:\x1b[0m`, error);
    }
  },

  /**
   * Create multiple browser contexts based on user requirements
   * Each user gets their own context, page, and certa instance
   */
  contexts: async ({ browser, userPool }, use) => {
    const users = userPool.getAll();
    const contexts: UserContext[] = [];

    // Create a separate browser context for each user
    for (let i = 0; i < users.length; i++) {
      const user = users[i];
      const context = await browser.newContext();
      const page = await context.newPage();
      const certa = createCerta(page);

      contexts.push({
        context,
        page,
        certa,
        user,
      });
    }

    console.log(
      `\x1b[36m✓ Created ${contexts.length} browser context(s)\x1b[0m`
    );

    // Provide contexts to test
    await use(contexts);

    // Cleanup: close all contexts
    for (const ctx of contexts) {
      await ctx.context.close();
    }
  },

  /**
   * Helper function to get user by role
   */
  getUser: async ({ userPool }, use) => {
    const getter = (role: string, index: number = 0): EmitUser => {
      const user = userPool.getUserByRole(role, index);
      if (!user) {
        throw new Error(
          `No user found for role "${role}" at index ${index}. ` +
            `Available roles: ${Object.keys(userPool.getMetadata().roleDistribution).join(', ')}`
        );
      }
      return user;
    };
    await use(getter);
  },

  /**
   * Quick access to first client user
   */
  clientUser: async ({ userPool }, use) => {
    const client = userPool.getClient();
    if (!client) {
      throw new Error('No client user available in pool');
    }
    await use(client);
  },
});

export { expect } from '@playwright/test';
