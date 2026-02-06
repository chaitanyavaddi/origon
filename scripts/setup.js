#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const readline = require('readline');
const { showAsciiArt } = require('./ascii-art');

const DEV_CONFIG_PATH = path.join(__dirname, '../core/config/dev.json');
const DEV_EXAMPLE_PATH = path.join(__dirname, '../core/config/dev.example.json');
const REQUIRED_NODE_VERSION = 18;

/**
 * Check Node.js version
 */
function checkNodeVersion() {
  const currentVersion = parseInt(process.version.slice(1).split('.')[0]);
  if (currentVersion < REQUIRED_NODE_VERSION) {
    console.error(`\x1b[31m❌ Node.js version ${REQUIRED_NODE_VERSION} or higher is required.\x1b[0m`);
    console.error(`   Current version: ${process.version}`);
    console.error(`   Please install Node.js ${REQUIRED_NODE_VERSION}+ from https://nodejs.org/`);
    process.exit(1);
  }
  console.log(`\x1b[32m✓\x1b[0m Node.js version: ${process.version}`);
}

/**
 * Install dependencies
 */
function installDependencies() {
  console.log('\n\x1b[36m📦 Installing dependencies...\x1b[0m');
  try {
    execSync('npm install', { stdio: 'inherit' });
    console.log('\x1b[32m✓\x1b[0m Dependencies installed successfully\n');
  } catch (error) {
    console.error('\x1b[31m❌ Failed to install dependencies\x1b[0m');
    process.exit(1);
  }
}

/**
 * Prompt user for input
 */
function prompt(question) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer.trim());
    });
  });
}

/**
 * Validate email format
 */
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Register developer
 */
async function registerDeveloper() {
  console.log('\x1b[36m👤 Developer Registration\x1b[0m');
  console.log('━'.repeat(60));

  let name = '';
  while (!name) {
    name = await prompt('\nEnter your full name: ');
    if (!name) {
      console.log('\x1b[31m❌ Name cannot be empty\x1b[0m');
    }
  }

  let email = '';
  while (!email || !isValidEmail(email)) {
    email = await prompt('Enter your email: ');
    if (!email) {
      console.log('\x1b[31m❌ Email cannot be empty\x1b[0m');
    } else if (!isValidEmail(email)) {
      console.log('\x1b[31m❌ Invalid email format\x1b[0m');
    }
  }

  const emailPrefix = email.split('@')[0];
  const devConfig = {
    name,
    email,
    emailPrefix,
    registeredAt: new Date().toISOString(),
  };

  // Ensure directory exists
  const configDir = path.dirname(DEV_CONFIG_PATH);
  if (!fs.existsSync(configDir)) {
    fs.mkdirSync(configDir, { recursive: true });
  }

  // Save dev config
  fs.writeFileSync(DEV_CONFIG_PATH, JSON.stringify(devConfig, null, 2));
  console.log('\n\x1b[32m✓\x1b[0m Developer registered successfully!');
  console.log(`\x1b[90m  Saved to: ${DEV_CONFIG_PATH}\x1b[0m`);

  return devConfig;
}

/**
 * Create example dev config if it doesn't exist
 */
function createExampleConfig() {
  if (!fs.existsSync(DEV_EXAMPLE_PATH)) {
    const exampleConfig = {
      name: 'John Doe',
      email: 'john.doe@example.com',
      emailPrefix: 'john.doe',
      registeredAt: '2026-02-06T10:00:00.000Z',
    };
    fs.writeFileSync(DEV_EXAMPLE_PATH, JSON.stringify(exampleConfig, null, 2));
  }
}

/**
 * Show quick start guide
 */
function showQuickStart(devConfig) {
  console.log('\n\x1b[36m🚀 Quick Start Guide\x1b[0m');
  console.log('━'.repeat(60));
  console.log('\n\x1b[33mRun tests:\x1b[0m');
  console.log('  npm test                          # Run all tests');
  console.log('  npm test tests/example.spec.ts    # Run specific test');
  console.log('  npm run test:headed               # Run with browser visible');
  console.log('  npm run test:debug                # Debug mode');
  console.log('  npm run test:ui                   # Interactive UI mode');

  console.log('\n\x1b[33mWith custom launch/execution IDs:\x1b[0m');
  console.log('  npm run test:custom -- --launch-id=L123 --execution-id=E456 tests/example.spec.ts');

  console.log('\n\x1b[33mGenerated test IDs will use:\x1b[0m');
  console.log(`  \x1b[90m${devConfig.emailPrefix} (from ${devConfig.email})\x1b[0m`);

  console.log('\n\x1b[33mReports:\x1b[0m');
  console.log('  npm run allure:serve              # View Allure report');

  console.log('\n\x1b[32m✓ Setup complete! Happy testing! 🎉\x1b[0m\n');
}

/**
 * Main setup function
 */
async function main() {
  showAsciiArt('🔧 Setup & Configuration');

  console.log('\x1b[36mChecking environment...\x1b[0m');
  console.log('━'.repeat(60));

  // Check Node version
  checkNodeVersion();

  // Check if dev.json already exists
  if (fs.existsSync(DEV_CONFIG_PATH)) {
    const existingConfig = JSON.parse(fs.readFileSync(DEV_CONFIG_PATH, 'utf-8'));
    console.log(`\n\x1b[33m⚠ Developer already registered:\x1b[0m`);
    console.log(`   Name:  ${existingConfig.name}`);
    console.log(`   Email: ${existingConfig.email}`);

    const reRegister = await prompt('\nDo you want to re-register? (y/N): ');
    if (reRegister.toLowerCase() !== 'y') {
      console.log('\n\x1b[32m✓ Using existing configuration\x1b[0m');
      showQuickStart(existingConfig);
      return;
    }
  }

  // Install dependencies
  installDependencies();

  // Register developer
  const devConfig = await registerDeveloper();

  // Create example config
  createExampleConfig();

  // Show quick start
  showQuickStart(devConfig);
}

main().catch((error) => {
  console.error('\n\x1b[31m❌ Setup failed:\x1b[0m', error.message);
  process.exit(1);
});
