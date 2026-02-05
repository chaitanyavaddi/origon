import { request } from '@playwright/test';
import fs from 'fs/promises';
import path from 'path';

export default async function globalTeardown() {
  const testExecutionId = process.env.TEST_EXECUTION_ID;
  const filePath = process.env.TEST_USER_POOL_FILE || (testExecutionId ? path.resolve(process.cwd(), 'test-results', `testUserPool-${testExecutionId}.json`) : undefined);

  if (!testExecutionId) {
    console.warn('No TEST_EXECUTION_ID found in env; skipping release call.');
    return;
  }

  const apiUrl = 'http://emit-alb-1155756710.us-east-1.elb.amazonaws.com/api/v1/testdata/pool/release';
  const payload = { test_execution_id: testExecutionId };

  try {
    const apiContext = await request.newContext();
    const res = await apiContext.post(apiUrl, { data: payload });
    if (!res.ok()) {
      const text = await res.text();
      console.warn(`Release call failed: ${res.status()} ${text}`);
    } else {
      console.log(`Released testExecutionId ${testExecutionId} successfully.`);
    }
  } catch (err) {
    console.error('Error while calling release endpoint:', err);
  }

  // Optionally keep the file for debugging; you could remove it
  if (filePath) {
    try {
      await fs.rm(filePath, { force: true });
      console.log(`Cleaned up file ${filePath}`);
    } catch (err) {
      console.warn(`Could not remove file ${filePath}:`, err);
    }
  }
}
