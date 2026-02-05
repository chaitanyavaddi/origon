import { test } from '@playwright/test';

/**
 * Allure step decorator (Allure v3 compatible)
 * Use {0}, {1}, etc. for parameter placeholders
 * 
 * This decorator works by wrapping method calls with Playwright's test.step(),
 * which automatically integrates with allure-playwright reporter.
 */
export function step(name: string) {
  return function (
    target: any,
    propertyKey: string | symbol,
    descriptor?: any
  ) {
    // Handle undefined descriptor
    if (!descriptor) {
      descriptor = Object.getOwnPropertyDescriptor(target, propertyKey);
    }

    if (!descriptor) {
      return;
    }

    const originalMethod = descriptor.value;
    
    if (!originalMethod || typeof originalMethod !== 'function') {
      return;
    }

    descriptor.value = function (...args: any[]): any {
      let stepName = name;
      
      // Replace {0}, {1}, etc. with actual values
      args.forEach((arg, index) => {
        const placeholder = `{${index}}`;
        if (stepName.includes(placeholder)) {
          const value = typeof arg === 'object' ? JSON.stringify(arg) : String(arg);
          stepName = stepName.replace(placeholder, value);
        }
      });

      // Wrap with test.step for Allure reporting
      // test.step creates steps that are captured by allure-playwright
      return test.step(stepName, async () => {
        return await originalMethod.apply(this, args);
      });
    };

    return descriptor;
  };
}