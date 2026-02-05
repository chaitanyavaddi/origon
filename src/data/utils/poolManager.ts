import { request } from '@playwright/test';

const ACQUIRE_URL = 'http://emit-alb-1155756710.us-east-1.elb.amazonaws.com/api/v1/testdata/pool/acquire';
const RELEASE_URL = 'http://emit-alb-1155756710.us-east-1.elb.amazonaws.com/api/v1/testdata/pool/release';

export function generateTestExecutionId(): string {
  return `OS3-${Math.random().toString(36).slice(2, 10)}-${Date.now()}`;
}

export async function acquirePool() {
  const testExecutionId = generateTestExecutionId();
  console.log(`[DESCRIBE_ACQUIRE] ${testExecutionId}`);

  const payload = {
    test_execution_id: testExecutionId,
    role_requirements: { client: 1, thirdparty: 0 },
    max_retries: 10,
  };

  const apiContext = await request.newContext();
  try {
    const res = await apiContext.post(ACQUIRE_URL, { data: payload });
    if (!res.ok()) {
      const text = await res.text();
      throw new Error(`Failed to acquire test users: ${res.status()} ${text}`);
    }

    const body = await res.json();
    // include testExecutionId for clarity
    return { testExecutionId, body };
  } finally {
    try {
      await apiContext.dispose();
    } catch (err) {
      console.warn('Failed to dispose apiContext after acquire:', err);
    }
  }
}

export async function releasePool(testExecutionId: string) {
  if (!testExecutionId) return;
  const payload = { test_execution_id: testExecutionId };
  const apiContext = await request.newContext();
  try {
    const res = await apiContext.post(RELEASE_URL, { data: payload });
    if (!res.ok()) {
      const text = await res.text();
      console.warn(`Release failed for ${testExecutionId}: ${res.status()} ${text}`);
    } else {
      console.log(`Released testExecutionId ${testExecutionId} successfully.`);
    }
  } catch (err) {
    console.error('Error during release call:', err);
  } finally {
    try {
      await apiContext.dispose();
    } catch (err) {
      console.warn('Failed to dispose apiContext after release:', err);
    }
  }
}
