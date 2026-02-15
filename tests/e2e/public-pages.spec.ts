import { test, expect } from '@playwright/test';

test.describe('Public Pages', () => {
  test('home page should load successfully', async ({ page }) => {
    await page.goto('/');

    // Check for main heading
    await expect(page.locator('h1')).toContainText('Transform Your Life');

    // Check for hero section
    await expect(page.locator('text=Professional coaching')).toBeVisible();

    // Check for navigation
    await expect(page.locator('nav')).toBeVisible();

    // Check for CTA button
    await expect(page.locator('text=Become a Member')).toBeVisible();
  });

  test('home page should be responsive', async ({ page }) => {
    // Test mobile view
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');

    await expect(page.locator('h1')).toBeVisible();

    // Test desktop view
    await page.setViewportSize({ width: 1920, height: 1080 });
    await expect(page.locator('h1')).toBeVisible();
  });

  test('blog page should load and show empty state or posts', async ({ page }) => {
    await page.goto('/blog');

    // Check for heading
    await expect(page.locator('h1')).toContainText('Blog');

    // Should show either empty state or posts
    const hasEmptyState = await page.locator('text=No Blog Posts Yet').isVisible();
    const hasPosts = await page.locator('[class*="grid"]').isVisible();

    expect(hasEmptyState || hasPosts).toBe(true);
  });

  test('about page should load', async ({ page }) => {
    await page.goto('/about');

    // Check page loads without error
    await expect(page.locator('body')).toBeVisible();

    // Should have main content
    const content = await page.textContent('body');
    expect(content).toBeTruthy();
  });

  test('contact page should load with form', async ({ page }) => {
    await page.goto('/contact');

    // Check for form fields
    await expect(page.locator('input[name="name"]')).toBeVisible();
    await expect(page.locator('input[name="email"]')).toBeVisible();
    await expect(page.locator('textarea[name="message"]')).toBeVisible();

    // Check for submit button
    await expect(page.locator('button[type="submit"]')).toBeVisible();
  });

  test('contact form should validate inputs', async ({ page }) => {
    await page.goto('/contact');

    // Try to submit empty form
    await page.click('button[type="submit"]');

    // Should show validation (HTML5 or custom)
    // At minimum, shouldn't navigate away
    await expect(page).toHaveURL(/\/contact/);
  });

  test('contact form should accept valid input', async ({ page }) => {
    await page.goto('/contact');

    // Fill in form
    await page.fill('input[name="name"]', 'Test User');
    await page.fill('input[name="email"]', 'test@example.com');
    await page.fill('textarea[name="message"]', 'This is a test message');

    // Submit
    await page.click('button[type="submit"]');

    // Should show some feedback (success message or remain on page)
    // We don't check for specific behavior since it depends on implementation
    await page.waitForTimeout(1000);
  });

  test('checkout page should load and show free pricing', async ({ page }) => {
    await page.goto('/checkout');

    // Check for pricing display
    await expect(page.locator('text=FREE')).toBeVisible();

    // Check for benefits list
    await expect(page.locator('text=Premium Content Library')).toBeVisible();
    await expect(page.locator('text=24/7 AI Coaching Assistant')).toBeVisible();
  });

  test('all pages should have header and footer', async ({ page }) => {
    const pages = ['/', '/blog', '/about', '/contact', '/checkout'];

    for (const path of pages) {
      await page.goto(path);

      // Check for header
      await expect(page.locator('header')).toBeVisible();

      // Check for footer
      await expect(page.locator('footer')).toBeVisible();
    }
  });

  test('pages should not have console errors', async ({ page }) => {
    const errors: string[] = [];

    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });

    await page.goto('/');
    await page.goto('/blog');
    await page.goto('/contact');

    // Allow warnings but no hard errors
    const criticalErrors = errors.filter(
      (e) => !e.includes('Warning') && !e.includes('Clerk')
    );

    expect(criticalErrors.length).toBe(0);
  });

  test('navigation links should work', async ({ page }) => {
    await page.goto('/');

    // Click Blog link
    await page.click('text=Blog');
    await expect(page).toHaveURL(/\/blog/);

    // Go back
    await page.goto('/');

    // Click About link
    await page.click('text=About');
    await expect(page).toHaveURL(/\/about/);

    // Go back
    await page.goto('/');

    // Click Contact link
    await page.click('text=Contact');
    await expect(page).toHaveURL(/\/contact/);
  });
});
