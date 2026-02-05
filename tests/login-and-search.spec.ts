import { test, expect } from '@playwright/test';
import { createCerta } from '@web/Certa';
import { getUser } from '@core/config/credentials';

test.describe('Login and Search Workflow', () => {
  test('Login as Associate and search for dummy workflow', async ({ page }) => {
    const certa = createCerta(page);

    // Step 1: Login
    await certa.auth.loginAsAssociate(getUser('associate'));

    // Step 2: Navigate to dashboard and verify
    const dashboard = await certa.dashboard.navigateAndVerify();

    // Step 3: Verify we're on dashboard (Home is active)
    const isHomeActive = await dashboard.isHomeActive();
    expect(isHomeActive, 'Home should be active after login').toBe(true);

    // Step 4: Open See More modal and search
    const modal = await certa.dashboard.searchWorkflow('dummy');

    // Step 5: Verify modal is open
    const isModalOpen = await modal.isOpen();
    expect(isModalOpen, 'Workflow selection modal should be open').toBe(true);

    // Step 6: Verify search results
    const workflows = await modal.getVisibleWorkflows();
    console.log('Found workflows:', workflows);
    
    expect(workflows.length, 'Should find at least one workflow').toBeGreaterThan(0);
    expect(
      workflows.some(w => w.toLowerCase().includes('dummy')),
      'Should find workflow containing "dummy"'
    ).toBe(true);

    // Optional: Take screenshot for Allure report
    await page.screenshot({ 
      path: `test-results/workflow-search-${Date.now()}.png`,
      fullPage: true 
    });
  });

  test('Verify sidebar navigation on Dashboard', async ({ page }) => {
    const certa = createCerta(page);

    // Login
    await certa.auth.loginAsAssociate(getUser('associate'));

    // Navigate to dashboard
    const dashboard = await certa.dashboard.navigateAndVerify();

    // Test sidebar navigation
    const sidebar = dashboard.sidebarComponent;
    
    // Verify Home is active
    expect(await sidebar.isHomeActive()).toBe(true);
    
    // Click Dashboards
    await sidebar.clickDashboards();
    expect(await sidebar.isDashboardsActive()).toBe(true);
    
    // Click back to Home
    await sidebar.clickHome();
    expect(await sidebar.isHomeActive()).toBe(true);
  });
});