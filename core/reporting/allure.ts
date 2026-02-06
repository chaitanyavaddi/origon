import { test } from '@playwright/test';
import { step as allureStep } from 'allure-js-commons';
import * as allure from 'allure-js-commons';
import * as fs from 'fs';
import * as path from 'path';

/**
 * Execute a step with Allure reporting and proper hierarchy
 * Uses allure-js-commons for proper step nesting
 */
export async function step<T>(
  stepName: string,
  fn: () => Promise<T>
): Promise<T> {
  return await allureStep(stepName, fn);
}

/**
 * Attach text content to current test
 */
export async function attachText(name: string, content: string, type: 'text/plain' | 'text/html' | 'application/json' = 'text/plain'): Promise<void> {
  await allure.attachment(name, content, type);
}

/**
 * Attach JSON data to current test
 */
export async function attachJSON(name: string, data: any): Promise<void> {
  await allure.attachment(name, JSON.stringify(data, null, 2), 'application/json');
}

/**
 * Attach file to current test
 */
export async function attachFile(name: string, filePath: string, mimeType?: string): Promise<void> {
  const content = fs.readFileSync(filePath);
  const type = mimeType || getContentType(filePath);
  await allure.attachment(name, content, type);
}

/**
 * Attach screenshot (use with Playwright page)
 */
export async function attachScreenshot(name: string, screenshot: Buffer): Promise<void> {
  await allure.attachment(name, screenshot, 'image/png');
}

/**
 * Add description to current test
 */
export async function description(text: string): Promise<void> {
  await allure.description(text);
}

/**
 * Add epic label
 */
export async function epic(name: string): Promise<void> {
  await allure.epic(name);
}

/**
 * Add feature label
 */
export async function feature(name: string): Promise<void> {
  await allure.feature(name);
}

/**
 * Add story label
 */
export async function story(name: string): Promise<void> {
  await allure.story(name);
}

/**
 * Add severity
 */
export async function severity(level: 'blocker' | 'critical' | 'normal' | 'minor' | 'trivial'): Promise<void> {
  await allure.severity(level);
}

/**
 * Add tag
 */
export async function tag(name: string): Promise<void> {
  await allure.tag(name);
}

/**
 * Add owner
 */
export async function owner(name: string): Promise<void> {
  await allure.owner(name);
}

/**
 * Add link
 */
export async function link(url: string, name?: string, type?: string): Promise<void> {
  await allure.link(url, name, type);
}

/**
 * Add issue link
 */
export async function issue(name: string, url: string): Promise<void> {
  await allure.issue(name, url);
}

/**
 * Add TMS (Test Management System) link
 */
export async function tms(name: string, url: string): Promise<void> {
  await allure.tms(name, url);
}

/**
 * Helper to get content type from file extension
 */
function getContentType(filePath: string): string {
  const ext = path.extname(filePath).toLowerCase();
  const types: Record<string, string> = {
    '.txt': 'text/plain',
    '.html': 'text/html',
    '.json': 'application/json',
    '.xml': 'application/xml',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.gif': 'image/gif',
    '.pdf': 'application/pdf',
    '.csv': 'text/csv',
  };
  return types[ext] || 'application/octet-stream';
}