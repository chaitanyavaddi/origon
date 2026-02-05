# Official Playwright image with browsers pre-installed
# IMPORTANT: Ideally match this tag to your @playwright/test major/minor
FROM mcr.microsoft.com/playwright:v1.58.1-focal

WORKDIR /app

ENV TEST_ENV=qa
ENV CI=true

# Copy lockfiles
COPY package.json package-lock.json ./

# Install deps
RUN npm ci

# Copy the rest of the application
COPY . .

# Create output directories
RUN mkdir -p output/qa output/dev output/production

# Verify installations
RUN echo "Verifying installations..." && \
    node --version && \
    npx playwright --version && \
    npx allure --version

# Default command
CMD ["npm", "run", "test:qa:smoke"]
