import { Page } from '@playwright/test';
import { step } from '@core/reporting/allure';
import { Sidebar } from '@web/components/common/Sidebar';

/**
 * Domain-specific sidebar for Dashboard
 * Extends generic Sidebar with dashboard-specific navigation
 */
export class DashboardSidebar extends Sidebar {
  constructor(page: Page) {
    super(page);
  }

  async clickHome(): Promise<void> {
    return await step('DashboardSidebar: Click Home', async () => {
      await this.clickNavItem('Home');
    });
  }

  async clickDashboards(): Promise<void> {
    return await step('DashboardSidebar: Click Dashboards', async () => {
      await this.clickNavItem('Dashboards');
    });
  }

  async clickTasks(): Promise<void> {
    return await step('DashboardSidebar: Click Tasks', async () => {
      await this.clickNavItem('Tasks');
    });
  }

  async isHomeActive(): Promise<boolean> {
    return await step('DashboardSidebar: Check if Home is active', async () => {
      return await this.isNavItemActive('Home');
    });
  }

  async isDashboardsActive(): Promise<boolean> {
    return await step('DashboardSidebar: Check if Dashboards is active', async () => {
      return await this.isNavItemActive('Dashboards');
    });
  }

  async isTasksActive(): Promise<boolean> {
    return await step('DashboardSidebar: Check if Tasks is active', async () => {
      return await this.isNavItemActive('Tasks');
    });
  }
}