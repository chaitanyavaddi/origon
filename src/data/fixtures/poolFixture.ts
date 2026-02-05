import { test as base, expect, request } from '@playwright/test';

type PoolResponse = {
  test_execution_id?: string;
  users?: Array<Record<string, any>>;
  [k: string]: any;
};

export const test = base.extend<{
  pool: PoolResponse;
  testExecutionId: string;
  testUserPool: {
    getClient: () => Record<string, any> | undefined;
    getAll: () => Array<Record<string, any>>;
  };
}>({
  // Acquire a pool once per worker
  pool: [
    async ({}, use, workerInfo) => {
      const testExecutionId = `OS3-${Math.random().toString(36).slice(2, 10)}-${Date.now()}`;
      console.log(`[WORKER_TEST_EXECUTION_ID] ${testExecutionId}`);

      const apiUrl = 'http://emit-alb-1155756710.us-east-1.elb.amazonaws.com/api/v1/testdata/pool/acquire';
      const payload = {
        test_execution_id: testExecutionId,
        role_requirements: { client: 1, thirdparty: 0 },
        max_retries: 10,
      };

      const apiContext = await request.newContext();
      const res = await apiContext.post(apiUrl, { data: payload });
      if (!res.ok()) {
        const text = await res.text();
        throw new Error(`Failed to acquire test users: ${res.status()} ${text}`);
      }

      const body = await res.json();
      // Provide the response to tests in this worker
      await use({ ...body, _internal_testExecutionId: testExecutionId });

      // Teardown: release the pool when worker finishes
      try {
        const releaseUrl = 'http://emit-alb-1155756710.us-east-1.elb.amazonaws.com/api/v1/testdata/pool/release';
        const payloadRelease = { test_execution_id: testExecutionId };
        const releaseRes = await apiContext.post(releaseUrl, { data: payloadRelease });
        if (!releaseRes.ok()) {
          const txt = await releaseRes.text();
          console.warn(`Release call failed for ${testExecutionId}: ${releaseRes.status()} ${txt}`);
        } else {
          console.log(`Released testExecutionId ${testExecutionId} successfully (worker ${workerInfo.workerIndex}).`);
        }
      } catch (err) {
        console.error('Error during worker release call:', err);
      }
    },
    { scope: 'worker' },
  ],

  testExecutionId: [async ({ pool }, use) => {
    const id = pool.test_execution_id || pool._internal_testExecutionId || '';
    await use(id);
  }, { scope: 'worker' }],

  testUserPool: [async ({ pool }, use) => {
    const inst = {
      getClient: () => {
        const users = pool.users || [];
        const byRole = users.find((u: any) => (u.role || '').toLowerCase() === 'client');
        return byRole || users[0];
      },
      getAll: () => pool.users || [],
    };
    await use(inst);
  }, { scope: 'worker' }],
});

export { expect };
