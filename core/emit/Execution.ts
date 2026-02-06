/**
 * Execution - Placeholder for future test execution management
 *
 * An execution represents a single test execution within a launch.
 * Each execution typically needs one or more users from the emit service.
 *
 * Future implementation will handle:
 * - Execution creation and tracking
 * - Linking executions to launches
 * - Execution-level status and results
 * - Execution lifecycle management (start, pass, fail, complete)
 */

import { UserPool } from './UserPool';

export interface ExecutionConfig {
  executionId: string;
  launchId: string;
  testName?: string;
  testFile?: string;
  metadata?: Record<string, any>;
}

export type ExecutionStatus = 'pending' | 'running' | 'passed' | 'failed' | 'skipped';

export class Execution {
  private readonly executionId: string;
  private readonly launchId: string;
  private readonly config: ExecutionConfig;
  private userPool?: UserPool;
  private status: ExecutionStatus = 'pending';

  constructor(config: ExecutionConfig) {
    this.executionId = config.executionId;
    this.launchId = config.launchId;
    this.config = config;
  }

  /**
   * Get execution ID
   */
  getExecutionId(): string {
    return this.executionId;
  }

  /**
   * Get launch ID
   */
  getLaunchId(): string {
    return this.launchId;
  }

  /**
   * Get execution configuration
   */
  getConfig(): ExecutionConfig {
    return { ...this.config };
  }

  /**
   * Set user pool for this execution
   */
  setUserPool(pool: UserPool): void {
    this.userPool = pool;
  }

  /**
   * Get user pool
   */
  getUserPool(): UserPool | undefined {
    return this.userPool;
  }

  /**
   * Get current status
   */
  getStatus(): ExecutionStatus {
    return this.status;
  }

  /**
   * Update status
   */
  setStatus(status: ExecutionStatus): void {
    this.status = status;
  }

  // TODO: Implement execution creation API
  // static async create(config: ExecutionConfig): Promise<Execution>

  // TODO: Implement execution start
  // async start(): Promise<void>

  // TODO: Implement execution completion
  // async complete(result: 'passed' | 'failed' | 'skipped'): Promise<void>

  // TODO: Implement execution status update
  // async updateStatus(status: ExecutionStatus): Promise<void>
}
