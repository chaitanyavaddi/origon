import { test as base, expect } from '@playwright/test';
import { createCerta } from '@web/Certa';
import { UserCredentials, getUser } from '@core/config/credentials';
import * as path from 'path';
import * as crypto from 'crypto';

/**
 * Authentication helper for describe blocks
 * Automatically handles login and auth state management per describe block
 */

export interface AuthOptions {
  user?: UserCredentials;
  loginMethod?: 'associate' | 'trainee' | 'saml-flsmidth' | 'saml-sprint183';
  stateName?: string; // Custom name for auth state file
}

/**
 * Helper to generate unique auth state filename for a describe block
 */
function generateAuthStateFile(describeBlockName: string, options: AuthOptions): string {
  const hash = crypto.createHash('md5').update(describeBlockName).digest('hex').substring(0, 8);
  const stateName = options.stateName || `${options.loginMethod || 'associate'}_${hash}`;
  return path.join('.auth', `${stateName}.json`);
}

/**
 * Use this in your describe blocks to automatically handle authentication
 * Auth state is saved per describe block and reused across tests
 *
 * @example
 * ```typescript
 * describeWithAuth('My Test Suite', { user: getUser('associate') }, () => {
 *   test('test 1', async ({ page }) => {
 *     // Already logged in!
 *     await page.goto('/home');
 *   });
 *
 *   test('test 2', async ({ page }) => {
 *     // Still logged in!
 *   });
 * });
 * ```
 */
export function describeWithAuth(
  name: string,
  options: AuthOptions,
  fn: () => void
): void {
  base.describe(name, () => {
    const authStateFile = generateAuthStateFile(name, options);
    const user = options.user || getUser('associate');
    const loginMethod = options.loginMethod || 'associate';

    // Login once before all tests in this describe block
    base.beforeAll(async ({ browser }) => {
      const context = await browser.newContext();
      const page = await context.newPage();
      const certa = createCerta(page);

      // Perform login based on method
      switch (loginMethod) {
        case 'associate':
          await certa.auth.loginAsAssociate(user);
          break;
        case 'trainee':
          await certa.auth.loginAsTrainee(user);
          break;
        case 'saml-flsmidth':
          await certa.auth.loginWithSAMLFlsmidth(user);
          break;
        case 'saml-sprint183':
          await certa.auth.loginWithSAMLSprint183(user);
          break;
        default:
          await certa.auth.loginAsAssociate(user);
      }

      // Verify login succeeded
      await expect(page).toHaveURL(/.*home/, { timeout: 10000 });

      // Save auth state
      await context.storageState({ path: authStateFile });
      await context.close();

      console.log(`✓ Auth state saved for "${name}": ${authStateFile}`);
    });

    // All tests in this describe block use the saved auth state
    base.use({ storageState: authStateFile });

    // Run the actual tests
    fn();
  });
}

/**
 * Quick helper for Associate login (most common case)
 *
 * @example
 * ```typescript
 * describeWithAssociateAuth('My Test Suite', () => {
 *   test('test 1', async ({ page }) => {
 *     await page.goto('/home'); // Already logged in
 *   });
 * });
 * ```
 */
export function describeWithAssociateAuth(
  name: string,
  fn: () => void,
  user?: UserCredentials
): void {
  describeWithAuth(
    name,
    { user: user || getUser('associate'), loginMethod: 'associate' },
    fn
  );
}
