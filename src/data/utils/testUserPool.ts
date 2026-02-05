import fs from 'fs/promises';
import path from 'path';

export type TestUser = {
  email: string;
  password?: string;
  role?: string;
  [k: string]: any;
};

export class TestUserPool {
  private static _instance: TestUserPool | null = null;
  private users: TestUser[] = [];
  public testExecutionId?: string;

  private constructor() {}

  static async load(): Promise<TestUserPool> {
    if (TestUserPool._instance) return TestUserPool._instance;

    const inst = new TestUserPool();
    const filePath = process.env.TEST_USER_POOL_FILE || (process.env.TEST_EXECUTION_ID ? path.resolve(process.cwd(), 'test-results', `testUserPool-${process.env.TEST_EXECUTION_ID}.json`) : undefined);

    if (!filePath) throw new Error('No test user pool file path found. Make sure global-setup ran and set TEST_USER_POOL_FILE or TEST_EXECUTION_ID.');

    const raw = await fs.readFile(filePath, 'utf-8');
    const parsed = JSON.parse(raw);

    inst.testExecutionId = parsed.testExecutionId || parsed.body?.test_execution_id;
    // The response we saved is in parsed.body
    const body = parsed.body || parsed;
    inst.users = body.users || [];

    TestUserPool._instance = inst;
    return inst;
  }

  getClient(): TestUser | undefined {
    // Prefer role field
    const byRole = this.users.find((u) => (u.role || '').toLowerCase() === 'client');
    if (byRole) return byRole;
    // Otherwise return first user
    return this.users[0];
  }

  // Utility: get raw users
  getAll(): TestUser[] {
    return this.users;
  }
}

export default TestUserPool;
