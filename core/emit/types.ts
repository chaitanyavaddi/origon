/**
 * Emit Service Type Definitions
 */

/**
 * User object returned by emit service
 */
export interface EmitUser {
  id: number;
  email: string;
  password: string;
  role: string;
  tenant: string;
  domain: string;
  tags: string;
  is_locked: boolean;
  is_healthy: boolean;
  locked_by: string | null;
  locked_at: string | null;
  created_at: string;
  updated_at: string;
}

/**
 * Role requirements for acquiring users
 */
export interface RoleRequirements {
  client?: number;
  thirdparty?: number;
  [role: string]: number | undefined;
}

/**
 * Acquire pool request payload
 */
export interface AcquirePoolRequest {
  test_execution_id: string;
  role_requirements: RoleRequirements;
  max_retries?: number;
}

/**
 * Acquire pool response
 */
export interface AcquirePoolResponse {
  test_execution_id: string;
  users: EmitUser[];
  acquired_at: string;
  status: string;
}

/**
 * Release pool request payload
 */
export interface ReleasePoolRequest {
  test_execution_id: string;
}

/**
 * Release pool response
 */
export interface ReleasePoolResponse {
  test_execution_id: string;
  released_count: number;
  released_at: string;
}
