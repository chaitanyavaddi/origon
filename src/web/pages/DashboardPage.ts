import { Page } from '@playwright/test';
import { step } from '@core/reporting/allure';
import { PageFragment } from '@web/base/PageFragment';
import { DashboardSidebar } from '@web/components/dashboard/DashboardSidebar';
import { WorkflowSelectionModal } from '@web/components/dashboard/WorkflowSelectionModal';
import { Button } from '@web/primitives/Button';
import { getConfig } from '@core/config/environment';

/**
 * Dashboard Page - composes domain-specific components
 */
export class DashboardPage extends PageFragment {
  private sidebar: DashboardSidebar;
  private seeMoreButton: Button;

  constructor(page: Page) {
    super(page);
    
    // Compose dashboard domain components
    this.sidebar = new DashboardSidebar(page);
    this.seeMoreButton = new Button(page, { text: 'See More' });
  }

  async navigate(): Promise<void> {
    return await step('DashboardPage: Navigate to dashboard', async () => {
      const config = getConfig();
      await this.page.goto(`${config.baseUrl}/home`);
      await this.waitForLoad();
    });
  }

  async waitForDashboardLoad(): Promise<void> {
    return await step('DashboardPage: Wait for dashboard to load', async () => {
      await this.sidebar.element.waitFor({ state: 'visible' });
    });
  }

  async openSeeMoreModal(): Promise<WorkflowSelectionModal> {
    return await step('DashboardPage: Open See More modal', async () => {
      await this.seeMoreButton.click();
      const modal = new WorkflowSelectionModal(this.page);
      await modal.waitForOpen();
      return modal;
    });
  }

  async isHomeActive(): Promise<boolean> {
    return await step('DashboardPage: Check if Home is active', async () => {
      return await this.sidebar.isHomeActive();
    });
  }

  // Expose sidebar for direct access if needed
  get sidebarComponent(): DashboardSidebar {
    return this.sidebar;
  }
}