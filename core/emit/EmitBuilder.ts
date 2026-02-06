import { EmitClient } from './EmitClient';
import { UserPool } from './UserPool';
import { RoleRequirements } from './types';

/**
 * Emit Builder - provides fluent API for acquiring users
 *
 * Usage:
 *   const pool = await emit
 *     .forExecution('test_123')
 *     .require({ client: 2, thirdparty: 1 })
 *     .withMaxRetries(10)
 *     .acquire();
 */
export class EmitBuilder {
  private executionId?: string;
  private roleRequirements: RoleRequirements = {};
  private maxRetries: number = 10;
  private client: EmitClient;

  constructor(client?: EmitClient) {
    this.client = client || EmitClient.getInstance();
  }

  /**
   * Set execution ID
   */
  forExecution(executionId: string): this {
    this.executionId = executionId;
    return this;
  }

  /**
   * Set role requirements
   */
  require(requirements: RoleRequirements): this {
    this.roleRequirements = requirements;
    return this;
  }

  /**
   * Set max retries for acquisition
   */
  withMaxRetries(retries: number): this {
    this.maxRetries = retries;
    return this;
  }

  /**
   * Acquire users and return UserPool
   */
  async acquire(): Promise<UserPool> {
    if (!this.executionId) {
      throw new Error(
        'Execution ID is required. Use forExecution(id) before calling acquire()'
      );
    }

    if (Object.keys(this.roleRequirements).length === 0) {
      throw new Error(
        'Role requirements are required. Use require({ client: 1, ... }) before calling acquire()'
      );
    }

    const response = await this.client.acquire({
      test_execution_id: this.executionId,
      role_requirements: this.roleRequirements,
      max_retries: this.maxRetries,
    });

    return new UserPool(response);
  }

  /**
   * Release users for an execution ID
   */
  async release(executionId?: string): Promise<void> {
    const id = executionId || this.executionId;

    if (!id) {
      throw new Error(
        'Execution ID is required. Use forExecution(id) or pass executionId to release()'
      );
    }

    await this.client.release({
      test_execution_id: id,
    });
  }
}
