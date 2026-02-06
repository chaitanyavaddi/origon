import { Page, Locator } from '@playwright/test';
import { step } from '@core/reporting/allure';
import { Modal } from '@web/components/common/Modal';
import { Input } from '@web/primitives/Input';

/**
 * Domain-specific modal for workflow selection
 * Extends generic Modal and adds workflow-specific behavior
 */
export class WorkflowSelectionModal extends Modal {
  private searchInput: Input;

  constructor(page: Page) {
    super(page, {
      selector: '[role="dialog"][aria-label="Start New Workflow"]',
    });
    
    this.searchInput = new Input(page, {
      selector: '#browse-all-search-input-bar'
    });
  }

  async searchWorkflows(query: string): Promise<void> {
    return await step(`WorkflowSelectionModal: Search workflows "${query}"`, async () => {
      await this.waitForOpen();
      await this.searchInput.fill(query);
      await this.page.waitForFunction(
        () => !document.querySelector('[aria-busy="true"]'),
        { timeout: 5000 }
      ).catch(() => {});
      
      await this.page.waitForLoadState('networkidle', { timeout: 3000 }).catch(() => {});
    });
  }

  async selectWorkflow(workflowName: string): Promise<void> {
    return await step(`WorkflowSelectionModal: Select workflow "${workflowName}"`, async () => {
      const workflow = this.getWorkflowItem(workflowName);
      await workflow.waitFor({ state: 'visible' });
      await workflow.click();
    });
  }

  async getVisibleWorkflows(): Promise<string[]> {
    return await step('WorkflowSelectionModal: Get visible workflows', async () => {
      const items = await this.page
        .locator('[role="listitem"][aria-label]')
        .all();
      
      const names = await Promise.all(
        items.map(item => item.getAttribute('aria-label'))
      );
      
      return names.filter(Boolean) as string[];
    });
  }

  private getWorkflowItem(workflowName: string): Locator {
    return this.page.locator(`[role="listitem"][aria-label="${workflowName}"]`);
  }
}