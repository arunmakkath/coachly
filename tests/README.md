# Coachly Test Suite

Comprehensive test suite for the Coachly coaching platform, covering unit tests, integration tests, and end-to-end tests.

## Table of Contents

- [Quick Start](#quick-start)
- [Test Structure](#test-structure)
- [Running Tests](#running-tests)
- [Writing Tests](#writing-tests)
- [Test Coverage](#test-coverage)
- [CI/CD Integration](#cicd-integration)

## Quick Start

```bash
# Install dependencies (if not already installed)
npm install

# Run all tests
npm run test:all

# Run specific test suites
npm run test:unit          # Unit tests only
npm run test:integration   # Integration tests only
npm run test:e2e           # E2E tests only

# Run tests with coverage
npm run test:coverage

# Run E2E tests with UI
npm run test:e2e:ui
```

## Test Structure

```
tests/
├── setup.ts                    # Vitest setup and mocks
├── unit/                       # Unit tests (fast, isolated)
│   ├── roles.test.ts          # Role management utilities
│   ├── pdf-parser.test.ts     # PDF parsing and chunking
│   └── rag.test.ts            # RAG pipeline logic
├── integration/                # Integration tests (API routes)
│   └── api/
│       ├── chat.test.ts       # Chat API with RAG
│       └── contact.test.ts    # Contact form API
└── e2e/                        # End-to-end tests (Playwright)
    ├── public-pages.spec.ts   # Public page flows
    ├── studio.spec.ts         # Content studio functionality
    └── navigation.spec.ts     # Navigation and routing
```

## Test Types

### Unit Tests (Vitest)

Test individual functions and utilities in isolation.

**Location**: `tests/unit/`
**Framework**: Vitest
**Run with**: `npm run test:unit`

**What they test**:
- Role validation and management
- PDF parsing and text chunking
- RAG retrieval and prompt building
- Utility functions

**Example**:
```typescript
// tests/unit/roles.test.ts
it('should validate correct role values', () => {
  expect(isValidRole('member')).toBe(true);
  expect(isValidRole('invalid')).toBe(false);
});
```

### Integration Tests (Vitest)

Test API routes and interactions between components.

**Location**: `tests/integration/`
**Framework**: Vitest with mocked dependencies
**Run with**: `npm run test:integration`

**What they test**:
- API route handlers
- Request validation
- Error handling
- Database interactions (mocked)

**Example**:
```typescript
// tests/integration/api/contact.test.ts
it('should validate email format', async () => {
  const response = await POST(requestWithInvalidEmail);
  expect(response.status).toBe(400);
});
```

### End-to-End Tests (Playwright)

Test complete user flows in a real browser.

**Location**: `tests/e2e/`
**Framework**: Playwright
**Run with**: `npm run test:e2e`

**What they test**:
- Full page loads
- User interactions
- Navigation flows
- Form submissions
- Mobile responsiveness

**Example**:
```typescript
// tests/e2e/studio.spec.ts
test('studio page should be accessible in demo mode', async ({ page }) => {
  await page.goto('/studio');
  await expect(page).toHaveURL(/\/studio/);
  await expect(page.locator('h1')).toContainText('Content Studio');
});
```

## Running Tests

### Run All Tests

```bash
# Runs unit, integration, and E2E tests
npm run test:all
```

### Run Specific Test Suites

```bash
# Unit tests only (fastest)
npm run test:unit

# Integration tests only
npm run test:integration

# E2E tests only (slowest, most comprehensive)
npm run test:e2e
```

### Run with Watch Mode

```bash
# Re-run unit tests on file changes
npm run test:unit -- --watch

# Re-run specific test file
npm run test:unit -- tests/unit/roles.test.ts --watch
```

### Run with Coverage

```bash
# Generate coverage report
npm run test:coverage

# View HTML coverage report
open coverage/index.html
```

### Run E2E Tests with UI

```bash
# Open Playwright UI for debugging
npm run test:e2e:ui
```

### Run Specific E2E Test

```bash
# Run only studio tests
npx playwright test studio

# Run with headed browser (see what's happening)
npx playwright test --headed

# Run on specific browser
npx playwright test --project=chromium
npx playwright test --project="Mobile Chrome"
```

## Writing Tests

### Unit Test Template

```typescript
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { yourFunction } from '@/lib/your-module';

describe('Your Module', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('yourFunction', () => {
    it('should do something', () => {
      const result = yourFunction('input');
      expect(result).toBe('expected');
    });

    it('should handle edge cases', () => {
      expect(() => yourFunction(null)).toThrow();
    });
  });
});
```

### Integration Test Template

```typescript
import { describe, it, expect, vi } from 'vitest';
import { POST } from '@/app/api/your-route/route';
import { NextRequest } from 'next/server';

// Mock dependencies
vi.mock('@/lib/your-dependency', () => ({
  yourFunction: vi.fn(() => 'mocked result'),
}));

describe('Your API Route', () => {
  it('should handle valid requests', async () => {
    const request = new NextRequest('http://localhost:3000/api/your-route', {
      method: 'POST',
      body: JSON.stringify({ data: 'test' }),
    });

    const response = await POST(request);
    expect(response.status).toBe(200);
  });
});
```

### E2E Test Template

```typescript
import { test, expect } from '@playwright/test';

test.describe('Your Feature', () => {
  test('should work correctly', async ({ page }) => {
    await page.goto('/your-page');

    await expect(page.locator('h1')).toContainText('Expected Text');

    await page.click('button');

    await expect(page).toHaveURL(/\/expected-url/);
  });
});
```

## Test Coverage

Target coverage:
- **Unit tests**: 80%+ coverage
- **Integration tests**: All API routes
- **E2E tests**: Critical user flows

View coverage report:
```bash
npm run test:coverage
open coverage/index.html
```

## Pre-Deployment Checklist

Before deploying or committing major changes:

```bash
# 1. Run all tests
npm run test:all

# 2. Check coverage
npm run test:coverage

# 3. Run E2E in multiple browsers
npx playwright test

# 4. Check for console errors
npx playwright test --grep "console errors"
```

## Debugging Tests

### Debugging Unit Tests

```bash
# Run with verbose output
npm run test:unit -- --reporter=verbose

# Run single test file
npm run test:unit tests/unit/roles.test.ts

# Debug with VS Code
# Add breakpoint, then use "Debug Test" from VS Code
```

### Debugging E2E Tests

```bash
# Run with headed browser (see UI)
npx playwright test --headed

# Run with slow motion (easier to follow)
npx playwright test --headed --slow-mo=1000

# Open Playwright Inspector
PWDEBUG=1 npx playwright test

# Generate trace for failed tests
npx playwright test --trace on
npx playwright show-report
```

## CI/CD Integration

### GitHub Actions Example

```yaml
name: Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18

      - name: Install dependencies
        run: npm ci

      - name: Run unit tests
        run: npm run test:unit

      - name: Run integration tests
        run: npm run test:integration

      - name: Install Playwright
        run: npx playwright install --with-deps

      - name: Run E2E tests
        run: npm run test:e2e

      - name: Upload test results
        if: always()
        uses: actions/upload-artifact@v3
        with:
          name: playwright-report
          path: playwright-report/
```

## Environment Setup

Tests use mock environment variables defined in `tests/setup.ts`. For integration/E2E tests that need real services:

1. Copy `.env.example` to `.env.test`
2. Add test API keys
3. Load with: `NODE_ENV=test npm run test`

## Common Issues

### Tests fail with "Cannot find module"

```bash
# Clear cache and reinstall
rm -rf node_modules .next
npm install
```

### E2E tests fail to start server

```bash
# Make sure port 3000 is free
lsof -ti:3000 | xargs kill -9

# Or set custom port in playwright.config.ts
```

### Tests pass locally but fail in CI

- Check environment variables
- Verify Node version matches CI
- Check for timezone-dependent tests
- Ensure test database is seeded

## Best Practices

1. **Test Pyramid**: More unit tests, fewer E2E tests
2. **Isolation**: Each test should be independent
3. **Fast**: Keep tests fast by mocking external services
4. **Readable**: Use descriptive test names
5. **Maintainable**: Update tests when features change
6. **Realistic**: E2E tests should mimic real user behavior

## Adding New Tests

When adding a new feature:

1. **Write unit tests** for utilities/functions
2. **Write integration tests** if adding API routes
3. **Write E2E tests** for critical user flows
4. **Run all tests** before committing
5. **Update this README** if adding new test categories

## Resources

- [Vitest Documentation](https://vitest.dev/)
- [Playwright Documentation](https://playwright.dev/)
- [Testing Library](https://testing-library.com/)

---

**Last Updated**: 2024
**Maintainer**: Coachly Development Team
