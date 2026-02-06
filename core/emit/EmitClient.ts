import { request, APIRequestContext } from '@playwright/test';
import {
  AcquirePoolRequest,
  AcquirePoolResponse,
  ReleasePoolRequest,
  ReleasePoolResponse,
} from './types';
import { env } from '../config/env-loader';

/**
 * Emit API Client - handles communication with emit service
 */
export class EmitClient {
  private static instance: EmitClient | null = null;
  private readonly baseUrl: string;
  private acquisitions: Set<string> = new Set(); // Track acquired execution IDs for cleanup

  private constructor(baseUrl?: string) {
    this.baseUrl = baseUrl || env.EMIT_API_URL;
  }

  /**
   * Get singleton instance of EmitClient
   */
  static getInstance(baseUrl?: string): EmitClient {
    if (!EmitClient.instance) {
      EmitClient.instance = new EmitClient(baseUrl);
    }
    return EmitClient.instance;
  }

  /**
   * Reset singleton (for testing)
   */
  static reset(): void {
    EmitClient.instance = null;
  }

  /**
   * Acquire user pool from emit service
   */
  async acquire(payload: AcquirePoolRequest): Promise<AcquirePoolResponse> {
    const apiContext = await this.createApiContext();

    try {
      const url = `${this.baseUrl}/testdata/pool/acquire`;

      console.log(`\x1b[36m📡 Acquiring users from emit service...\x1b[0m`);
      console.log(`\x1b[90m   Execution ID: ${payload.test_execution_id}\x1b[0m`);
      console.log(`\x1b[90m   Requirements: ${JSON.stringify(payload.role_requirements)}\x1b[0m`);

      const response = await apiContext.post(url, { data: payload });

      if (!response.ok()) {
        const text = await response.text();
        throw new Error(
          `Failed to acquire users from emit service: ${response.status()} ${text}`
        );
      }

      const body: AcquirePoolResponse = await response.json();

      // Track this acquisition for cleanup
      this.acquisitions.add(payload.test_execution_id);

      console.log(`\x1b[32m✓ Acquired ${body.users.length} user(s)\x1b[0m`);

      return body;
    } finally {
      await this.disposeApiContext(apiContext);
    }
  }

  /**
   * Release user pool back to emit service
   */
  async release(payload: ReleasePoolRequest): Promise<ReleasePoolResponse> {
    const apiContext = await this.createApiContext();

    try {
      const url = `${this.baseUrl}/testdata/pool/release`;

      console.log(`\x1b[36m🔓 Releasing users back to emit service...\x1b[0m`);
      console.log(`\x1b[90m   Execution ID: ${payload.test_execution_id}\x1b[0m`);

      const response = await apiContext.post(url, { data: payload });

      if (!response.ok()) {
        const text = await response.text();
        console.warn(
          `\x1b[33m⚠ Failed to release users: ${response.status()} ${text}\x1b[0m`
        );
        // Don't throw, just warn - we don't want to fail tests because of release issues
        return {
          test_execution_id: payload.test_execution_id,
          released_count: 0,
          released_at: new Date().toISOString(),
        };
      }

      const body: ReleasePoolResponse = await response.json();

      // Remove from tracked acquisitions
      this.acquisitions.delete(payload.test_execution_id);

      console.log(
        `\x1b[32m✓ Released ${body.released_count} user(s)\x1b[0m`
      );

      return body;
    } finally {
      await this.disposeApiContext(apiContext);
    }
  }

  /**
   * Release all tracked acquisitions (cleanup)
   */
  async releaseAll(): Promise<void> {
    if (this.acquisitions.size === 0) {
      return;
    }

    console.log(
      `\x1b[36m🧹 Cleaning up ${this.acquisitions.size} acquisition(s)...\x1b[0m`
    );

    const promises = Array.from(this.acquisitions).map((executionId) =>
      this.release({ test_execution_id: executionId })
    );

    await Promise.allSettled(promises);
  }

  /**
   * Get list of tracked acquisition IDs
   */
  getAcquisitions(): string[] {
    return Array.from(this.acquisitions);
  }

  /**
   * Create API request context
   */
  private async createApiContext(): Promise<APIRequestContext> {
    return await request.newContext();
  }

  /**
   * Dispose API request context
   */
  private async disposeApiContext(context: APIRequestContext): Promise<void> {
    try {
      await context.dispose();
    } catch (error) {
      console.warn('Failed to dispose API context:', error);
    }
  }
}
