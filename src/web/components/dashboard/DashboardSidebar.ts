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

  @step('DashboardSidebar: Click Home')
  async clickHome(): Promise<void> {
    await this.clickNavItem('Home');
  }

  @step('DashboardSidebar: Click Dashboards')
  async clickDashboards(): Promise<void> {
    await this.clickNavItem('Dashboards');
  }

  @step('DashboardSidebar: Click Tasks')
  async clickTasks(): Promise<void> {
    await this.clickNavItem('Tasks');
  }

  @step('DashboardSidebar: Check if Home is active')
  async isHomeActive(): Promise<boolean> {
    return await this.isNavItemActive('Home');
  }

  @step('DashboardSidebar: Check if Dashboards is active')
  async isDashboardsActive(): Promise<boolean> {
    return await this.isNavItemActive('Dashboards');
  }

  @step('DashboardSidebar: Check if Tasks is active')
  async isTasksActive(): Promise<boolean> {
    return await this.isNavItemActive('Tasks');
  }
}