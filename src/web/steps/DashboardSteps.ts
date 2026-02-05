import { Page } from '@playwright/test';
import { step } from '@core/reporting/allure';
import { DashboardPage } from '@web/pages/DashboardPage';
import { WorkflowSelectionModal } from '@web/components/dashboard/WorkflowSelectionModal';

/**
 * Dashboard steps - orchestrates DashboardPage and its components
 */
export class DashboardSteps {
  constructor(private page: Page) {}

  @step('Search and select workflow "{0}" from See More modal')
  async searchAndSelectWorkflow(workflowName: string): Promise<void> {
    const dashboard = new DashboardPage(this.page);
    const modal = await dashboard.openSeeMoreModal();
    await modal.searchWorkflows(workflowName);
    await modal.selectWorkflow(workflowName);
  }

  @step('Search workflow "{0}" in See More modal')
  async searchWorkflow(workflowName: string): Promise<WorkflowSelectionModal> {
    const dashboard = new DashboardPage(this.page);
    const modal = await dashboard.openSeeMoreModal();
    await modal.searchWorkflows(workflowName);
    return modal;
  }

  @step('Navigate to dashboard and verify load')
  async navigateAndVerify(): Promise<DashboardPage> {
    const dashboard = new DashboardPage(this.page);
    await dashboard.navigate();
    await dashboard.waitForDashboardLoad();
    return dashboard;
  }
}