import { request } from '@playwright/test';
import fs from 'fs/promises';
import path from 'path';

function generateTestExecutionId(): string {
  return `OS3-${Math.random().toString(36).slice(2, 10)}-${Date.now()}`;
}

export default async function globalSetup() {
  const testExecutionId = generateTestExecutionId();
  // Print to console before tests start
  console.log(`[TEST_EXECUTION_ID] ${testExecutionId}`);

  const apiUrl = 'http://emit-alb-1155756710.us-east-1.elb.amazonaws.com/api/v1/testdata/pool/acquire';
  const payload = {
    test_execution_id: testExecutionId,
    role_requirements: {
      client: 1,
      thirdparty: 0,
    },
    max_retries: 10,
  };

  const apiContext = await request.newContext();
  const res = await apiContext.post(apiUrl, { data: payload });

  if (!res.ok()) {
    const text = await res.text();
    throw new Error(`Failed to acquire test users: ${res.status()} ${text}`);
  }

  const body = await res.json();

  // Ensure test-results directory exists
  const resultsDir = path.resolve(process.cwd(), 'test-results');
  await fs.mkdir(resultsDir, { recursive: true });

  const filePath = path.join(resultsDir, `testUserPool-${testExecutionId}.json`);
  await fs.writeFile(filePath, JSON.stringify({ acquired_at: new Date().toISOString(), testExecutionId, body }, null, 2));

  // Expose values to worker processes via environment variables (workers inherit env)
  process.env.TEST_EXECUTION_ID = testExecutionId;
  process.env.TEST_USER_POOL_FILE = filePath;

  console.log(`Acquired users saved to ${filePath}`);
}
