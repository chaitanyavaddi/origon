import { Page } from '@playwright/test';
import { step } from '@core/reporting/allure';
import { DashboardPage } from '@web/pages/DashboardPage';
import { WorkflowSelectionModal } from '@web/components/dashboard/WorkflowSelectionModal';

/**
 * Dashboard steps - orchestrates DashboardPage and its components
 */
export class DashboardSteps {
  constructor(private page: Page) {}

  async searchAndSelectWorkflow(workflowName: string): Promise<void> {
    return await step(`Search and select workflow "${workflowName}" from See More modal`, async () => {
      const dashboard = new DashboardPage(this.page);
      const modal = await dashboard.openSeeMoreModal();
      await modal.searchWorkflows(workflowName);
      await modal.selectWorkflow(workflowName);
    });
  }

  async searchWorkflow(workflowName: string): Promise<WorkflowSelectionModal> {
    return await step(`Search workflow "${workflowName}" in See More modal`, async () => {
      const dashboard = new DashboardPage(this.page);
      const modal = await dashboard.openSeeMoreModal();
      await modal.searchWorkflows(workflowName);
      return modal;
    });
  }

  async navigateAndVerify(): Promise<DashboardPage> {
    return await step('Navigate to dashboard and verify load', async () => {
      const dashboard = new DashboardPage(this.page);
      await dashboard.navigate();
      await dashboard.waitForDashboardLoad();
      return dashboard;
    });
  }
}