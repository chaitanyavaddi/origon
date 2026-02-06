import { EmitUser, AcquirePoolResponse } from './types';

/**
 * User Pool - manages acquired users with role-based access
 */
export class UserPool {
  private readonly executionId: string;
  private readonly users: EmitUser[];
  private readonly acquiredAt: string;
  private readonly status: string;

  constructor(response: AcquirePoolResponse) {
    this.executionId = response.test_execution_id;
    this.users = response.users;
    this.acquiredAt = response.acquired_at;
    this.status = response.status;
  }

  /**
   * Get execution ID for this pool
   */
  getExecutionId(): string {
    return this.executionId;
  }

  /**
   * Get all users in the pool
   */
  getAll(): EmitUser[] {
    return [...this.users];
  }

  /**
   * Get users by role
   */
  getByRole(role: string): EmitUser[] {
    return this.users.filter(
      (user) => user.role.toLowerCase() === role.toLowerCase()
    );
  }

  /**
   * Get client users
   */
  getClients(): EmitUser[] {
    return this.getByRole('client');
  }

  /**
   * Get third party users
   */
  getThirdParty(): EmitUser[] {
    return this.getByRole('thirdparty');
  }

  /**
   * Get a single user by role and index (default: first user of that role)
   */
  getUserByRole(role: string, index: number = 0): EmitUser | undefined {
    const usersOfRole = this.getByRole(role);
    return usersOfRole[index];
  }

  /**
   * Get first client user
   */
  getClient(): EmitUser | undefined {
    return this.getClients()[0];
  }

  /**
   * Get acquisition metadata
   */
  getMetadata() {
    return {
      executionId: this.executionId,
      acquiredAt: this.acquiredAt,
      status: this.status,
      totalUsers: this.users.length,
      roleDistribution: this.getRoleDistribution(),
    };
  }

  /**
   * Get distribution of users by role
   */
  private getRoleDistribution(): Record<string, number> {
    const distribution: Record<string, number> = {};

    for (const user of this.users) {
      const role = user.role.toLowerCase();
      distribution[role] = (distribution[role] || 0) + 1;
    }

    return distribution;
  }

  /**
   * Check if pool has users for a specific role
   */
  hasRole(role: string): boolean {
    return this.getByRole(role).length > 0;
  }

  /**
   * Get count of users by role
   */
  getRoleCount(role: string): number {
    return this.getByRole(role).length;
  }
}
