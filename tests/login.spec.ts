import { test, expect } from '@/fixtures/multiUserFixture';
import { createCerta } from '@web/Certa';

/**
 * LOGIN TESTS WITH EMIT SERVICE
 * Demonstrates various patterns for single and multi-user testing
 */

// ============================================
// SINGLE USER TESTS (Default: 2 clients acquired, but only 1 used)
// ============================================
test.describe('Single User Login', () => {
  test('Basic login with first client', async ({ contexts }) => {
    const client = contexts[0];

    await client.certa.auth.loginAsAssociate(client.user);
    await expect(client.page).toHaveURL(/.*home/);

    const dashboard = await client.certa.dashboard.navigateAndVerify();
    expect(await dashboard.isHomeActive()).toBe(true);
  });

  test('Login and verify user details', async ({ contexts }) => {
    const client = contexts[0];

    console.log('User details:', {
      email: client.user.email,
      role: client.user.role,
      tenant: client.user.tenant,
      domain: client.user.domain,
    });

    await client.certa.auth.loginAsAssociate(client.user);
    await expect(client.page).toHaveURL(/.*home/);
  });
});

// ============================================
// TWO CLIENT USERS - COLLABORATION SCENARIO
// ============================================
test.describe('Two Clients Collaboration', () => {
  // Explicitly request 2 clients
  test.use({ userRequirements: { client: 2, thirdparty: 0 } });

  test('Both clients can login simultaneously', async ({ contexts }) => {
    const client1 = contexts[0];
    const client2 = contexts[1];

    // Login both users in parallel
    await Promise.all([
      client1.certa.auth.loginAsAssociate(client1.user),
      client2.certa.auth.loginAsAssociate(client2.user),
    ]);

    // Verify both are logged in
    await expect(client1.page).toHaveURL(/.*home/);
    await expect(client2.page).toHaveURL(/.*home/);

    console.log(`Client 1: ${client1.user.email}`);
    console.log(`Client 2: ${client2.user.email}`);
  });

  test('Client 1 creates, Client 2 views', async ({ contexts }) => {
    const client1 = contexts[0];
    const client2 = contexts[1];

    // Login both
    await client1.certa.auth.loginAsAssociate(client1.user);
    await client2.certa.auth.loginAsAssociate(client2.user);

    // Client 1 performs action
    await client1.page.goto('/home');
    const modal1 = await client1.certa.dashboard.searchWorkflow('test-workflow');
    expect(await modal1.isOpen()).toBe(true);

    // Client 2 can perform independent action
    await client2.page.goto('/home');
    const dashboard2 = client2.certa.dashboardPage;
    expect(await dashboard2.isHomeActive()).toBe(true);
  });

  test('Both clients navigate independently', async ({ contexts }) => {
    const client1 = contexts[0];
    const client2 = contexts[1];

    await client1.certa.auth.loginAsAssociate(client1.user);
    await client2.certa.auth.loginAsAssociate(client2.user);

    // Both navigate to different sections independently
    await client1.page.goto('/home');
    await client2.page.goto('/home');

    // Verify independent state
    expect(client1.page.url()).toContain('home');
    expect(client2.page.url()).toContain('home');
  });
});

// ============================================
// MIXED ROLES - CLIENT + THIRD PARTY
// ============================================
test.describe('Client and Third Party Interaction', () => {
  test.use({ userRequirements: { client: 1, thirdparty: 1 } });

  test('Client and third party login separately', async ({ contexts }) => {
    const client = contexts[0];
    const thirdParty = contexts[1];

    // Login client
    await client.certa.auth.loginAsAssociate(client.user);
    await expect(client.page).toHaveURL(/.*home/);

    // Login third party (using appropriate method for third party)
    await thirdParty.certa.auth.loginAsAssociate(thirdParty.user);
    await expect(thirdParty.page).toHaveURL(/.*home/);

    console.log(`Client: ${client.user.email} (${client.user.role})`);
    console.log(`Third Party: ${thirdParty.user.email} (${thirdParty.user.role})`);
  });

  test('Role-based actions', async ({ contexts, userPool }) => {
    // Access users by role using userPool
    const clients = userPool.getClients();
    const thirdParties = userPool.getThirdParty();

    expect(clients.length).toBe(1);
    expect(thirdParties.length).toBe(1);

    // Or use contexts array
    const client = contexts[0];
    const thirdParty = contexts[1];

    expect(client.user.role).toBe('client');
    expect(thirdParty.user.role).toBe('thirdparty');
  });
});

// ============================================
// THREE USERS - COMPLEX COLLABORATION
// ============================================
test.describe('Three Users Collaboration', () => {
  test.use({ userRequirements: { client: 2, thirdparty: 1 } });

  test('All three users can interact', async ({ contexts }) => {
    const client1 = contexts[0];
    const client2 = contexts[1];
    const thirdParty = contexts[2];

    // Login all users
    await Promise.all([
      client1.certa.auth.loginAsAssociate(client1.user),
      client2.certa.auth.loginAsAssociate(client2.user),
      thirdParty.certa.auth.loginAsAssociate(thirdParty.user),
    ]);

    // Verify all logged in
    await expect(client1.page).toHaveURL(/.*home/);
    await expect(client2.page).toHaveURL(/.*home/);
    await expect(thirdParty.page).toHaveURL(/.*home/);

    console.log('All 3 users logged in successfully:');
    contexts.forEach((ctx, i) => {
      console.log(`  User ${i + 1}: ${ctx.user.email} (${ctx.user.role})`);
    });
  });
});

// ============================================
// ACCESSING USERS BY ROLE (Alternative pattern)
// ============================================
test.describe('Access Users by Role', () => {
  test.use({ userRequirements: { client: 2, thirdparty: 0 } });

  test('Using userPool to get users by role', async ({ contexts, userPool }) => {
    const clients = userPool.getClients();

    expect(clients.length).toBe(2);

    // contexts array is aligned with users
    expect(contexts[0].user.email).toBe(clients[0].email);
    expect(contexts[1].user.email).toBe(clients[1].email);
  });

  test('Using getUser helper', async ({ contexts, getUser }) => {
    const firstClient = getUser('client', 0);
    const secondClient = getUser('client', 1);

    expect(firstClient.email).toBeTruthy();
    expect(secondClient.email).toBeTruthy();

    // Contexts map to users in order
    expect(contexts[0].user.email).toBe(firstClient.email);
    expect(contexts[1].user.email).toBe(secondClient.email);
  });
});

// ============================================
// BACKWARD COMPATIBILITY - Single user fixture
// ============================================
test.describe('Backward Compatible Single User', () => {
  test.use({ userRequirements: { client: 1, thirdparty: 0 } });

  test('Access via clientUser fixture', async ({ contexts, clientUser }) => {
    // Old style: using clientUser
    expect(clientUser.email).toBeTruthy();

    // New style: using contexts
    expect(contexts[0].user.email).toBe(clientUser.email);

    const client = contexts[0];
    await client.certa.auth.loginAsAssociate(client.user);
    await expect(client.page).toHaveURL(/.*home/);
  });
});

// ============================================
// DIFFERENT LOGIN METHODS (per user)
// ============================================
test.describe('Different Login Methods', () => {
  test.use({ userRequirements: { client: 1, thirdparty: 0 } });

  test('Login as Associate', async ({ contexts }) => {
    const client = contexts[0];
    await client.certa.auth.loginAsAssociate(client.user);
    await expect(client.page).toHaveURL(/.*home/);
  });

  test.skip('Login as Trainee', async ({ contexts, getUser }) => {
    const trainee = getUser('trainee');
    const ctx = contexts[0];
    await ctx.certa.auth.loginAsTrainee(trainee);
    // Note: OTP handling needed
  });

  test.skip('Login with SAML', async ({ contexts }) => {
    const client = contexts[0];
    await client.certa.auth.loginWithSAMLFlsmidth(client.user);
    await expect(client.page).toHaveURL(/.*home/);
  });
});

// ============================================
// PERFORMANCE - Parallel execution
// ============================================
test.describe.configure({ mode: 'parallel' });
test.describe('Parallel Multi-user Tests', () => {
  test.use({ userRequirements: { client: 2, thirdparty: 0 } });

  test('Parallel test 1', async ({ contexts }) => {
    const client1 = contexts[0];
    const client2 = contexts[1];

    await client1.certa.auth.loginAsAssociate(client1.user);
    await client2.certa.auth.loginAsAssociate(client2.user);

    await expect(client1.page).toHaveURL(/.*home/);
    await expect(client2.page).toHaveURL(/.*home/);
  });

  test('Parallel test 2', async ({ contexts }) => {
    const client1 = contexts[0];

    await client1.certa.auth.loginAsAssociate(client1.user);
    await expect(client1.page).toHaveURL(/.*home/);
  });
});
