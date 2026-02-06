import { Page, BrowserContext } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

/**
 * Authentication State Manager
 * Handles saving and loading Playwright authentication state
 * to share login sessions across tests
 */
export class AuthStateManager {
  private static readonly AUTH_STATE_DIR = '.auth';

  /**
   * Get the auth state file path for a specific user/type
   * @param identifier Unique identifier for the auth state (e.g., 'associate', 'trainee')
   */
  static getAuthStatePath(identifier: string): string {
    const stateFile = `${identifier.toLowerCase().replace(/[^a-z0-9]/g, '_')}_state.json`;
    return path.join(this.AUTH_STATE_DIR, stateFile);
  }

  /**
   * Save authentication state after login
   * @param context Browser context
   * @param identifier Unique identifier for the auth state
   */
  static async saveAuthState(context: BrowserContext, identifier: string): Promise<string> {
    const authStatePath = this.getAuthStatePath(identifier);

    // Create .auth directory if it doesn't exist
    if (!fs.existsSync(this.AUTH_STATE_DIR)) {
      fs.mkdirSync(this.AUTH_STATE_DIR, { recursive: true });
    }

    await context.storageState({ path: authStatePath });
    console.log(`✓ Auth state saved: ${authStatePath}`);

    return authStatePath;
  }

  /**
   * Check if auth state exists
   * @param identifier Unique identifier for the auth state
   */
  static hasAuthState(identifier: string): boolean {
    const authStatePath = this.getAuthStatePath(identifier);
    return fs.existsSync(authStatePath);
  }

  /**
   * Delete auth state file
   * @param identifier Unique identifier for the auth state
   */
  static deleteAuthState(identifier: string): void {
    const authStatePath = this.getAuthStatePath(identifier);
    if (fs.existsSync(authStatePath)) {
      fs.unlinkSync(authStatePath);
      console.log(`✓ Auth state deleted: ${authStatePath}`);
    }
  }

  /**
   * Clear all auth states
   */
  static clearAllAuthStates(): void {
    if (fs.existsSync(this.AUTH_STATE_DIR)) {
      const files = fs.readdirSync(this.AUTH_STATE_DIR);
      files.forEach(file => {
        fs.unlinkSync(path.join(this.AUTH_STATE_DIR, file));
      });
      console.log(`✓ All auth states cleared`);
    }
  }
}
