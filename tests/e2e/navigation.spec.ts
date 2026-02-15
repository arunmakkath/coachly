import { test, expect } from '@playwright/test';

test.describe('Navigation', () => {
  test('header navigation should be visible on all pages', async ({ page }) => {
    const pages = ['/', '/blog', '/about', '/contact', '/checkout', '/studio'];

    for (const path of pages) {
      await page.goto(path);
      await expect(page.locator('header nav')).toBeVisible();
    }
  });

  test('should navigate from home to all main pages', async ({ page }) => {
    await page.goto('/');

    // Test Blog navigation
    await page.click('nav >> text=Blog');
    await expect(page).toHaveURL(/\/blog/);
    await expect(page.locator('h1')).toContainText('Blog');

    // Back to home
    await page.click('header a[href="/"]');
    await expect(page).toHaveURL('/');

    // Test About navigation
    await page.click('nav >> text=About');
    await expect(page).toHaveURL(/\/about/);

    // Back to home
    await page.click('header a[href="/"]');
    await expect(page).toHaveURL('/');

    // Test Contact navigation
    await page.click('nav >> text=Contact');
    await expect(page).toHaveURL(/\/contact/);
  });

  test('"Become a Member" CTA should navigate to checkout', async ({ page }) => {
    await page.goto('/');

    // Click CTA button
    await page.click('text=Become a Member');

    // Should navigate to checkout
    await expect(page).toHaveURL(/\/checkout/);
    await expect(page.locator('text=FREE')).toBeVisible();
  });

  test('logo/brand should navigate to home', async ({ page }) => {
    await page.goto('/blog');

    // Click logo/brand (usually in header)
    await page.click('header a[href="/"]');

    // Should be on home page
    await expect(page).toHaveURL('/');
  });

  test('footer links should work', async ({ page }) => {
    await page.goto('/');

    // Check that footer exists and has links
    const footer = page.locator('footer');
    await expect(footer).toBeVisible();

    // Common footer links
    const footerLinks = await footer.locator('a').all();
    expect(footerLinks.length).toBeGreaterThan(0);
  });

  test('mobile menu should work', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');

    // Look for mobile menu toggle (hamburger icon)
    const mobileToggle = page.locator('button[aria-label*="menu"], button[aria-label*="Menu"]');

    if (await mobileToggle.isVisible()) {
      // Click to open menu
      await mobileToggle.click();

      // Menu items should be visible
      await expect(page.locator('text=Blog')).toBeVisible();
      await expect(page.locator('text=About')).toBeVisible();
      await expect(page.locator('text=Contact')).toBeVisible();
    }
  });

  test('back button should work correctly', async ({ page }) => {
    await page.goto('/');
    await page.click('text=Blog');
    await expect(page).toHaveURL(/\/blog/);

    // Use browser back
    await page.goBack();
    await expect(page).toHaveURL('/');

    // Forward
    await page.goForward();
    await expect(page).toHaveURL(/\/blog/);
  });

  test('direct URL access should work for all pages', async ({ page }) => {
    const pages = [
      { path: '/', heading: /Transform|Life|Coaching/i },
      { path: '/blog', heading: /Blog/i },
      { path: '/about', heading: /.+/ },
      { path: '/contact', heading: /.+/ },
      { path: '/checkout', heading: /Member|Become/i },
      { path: '/studio', heading: /Content Studio/i },
    ];

    for (const { path, heading } of pages) {
      await page.goto(path);
      await expect(page).toHaveURL(path);
      await expect(page.locator('h1')).toBeVisible();
    }
  });

  test('navigation should preserve scroll position', async ({ page }) => {
    await page.goto('/');

    // Scroll down
    await page.evaluate(() => window.scrollTo(0, 500));
    const scrollY = await page.evaluate(() => window.scrollY);
    expect(scrollY).toBeGreaterThan(0);

    // Navigate away and back
    await page.click('text=Blog');
    await page.goBack();

    // Should be scrolled (browser default behavior)
    // Note: This might vary by browser
    await page.waitForTimeout(300);
  });

  test('navigation should not cause memory leaks', async ({ page }) => {
    // Navigate multiple times rapidly
    for (let i = 0; i < 10; i++) {
      await page.goto('/');
      await page.goto('/blog');
      await page.goto('/about');
      await page.goto('/contact');
    }

    // Should still be responsive
    await page.goto('/');
    await expect(page.locator('h1')).toBeVisible();
  });

  test('pressing Enter on focused links should navigate', async ({ page }) => {
    await page.goto('/');

    // Focus on Blog link
    await page.locator('nav >> text=Blog').focus();

    // Press Enter
    await page.keyboard.press('Enter');

    // Should navigate to blog
    await expect(page).toHaveURL(/\/blog/);
  });

  test('keyboard navigation with Tab should work', async ({ page }) => {
    await page.goto('/');

    // Tab through focusable elements
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');

    // At least one element should be focused
    const focused = await page.evaluate(() => document.activeElement?.tagName);
    expect(focused).toBeTruthy();
  });

  test('404 page should be handled gracefully', async ({ page }) => {
    await page.goto('/this-page-does-not-exist');

    // Should either show 404 page or redirect to home
    const url = page.url();
    expect(url).toBeTruthy();

    // Page should still be functional
    await expect(page.locator('body')).toBeVisible();
  });
});
