import { test, expect } from '@playwright/test';

test.describe('Content Studio (Demo)', () => {
  // This test would have caught the middleware blocking /studio!
  test('studio page should be accessible in demo mode', async ({ page }) => {
    await page.goto('/studio');

    // Should NOT redirect to home
    await expect(page).toHaveURL(/\/studio/);

    // Should show Content Studio heading
    await expect(page.locator('h1')).toContainText('Content Studio');
  });

  test('studio should show demo mode notice', async ({ page }) => {
    await page.goto('/studio');

    // Check for demo mode notice
    await expect(page.locator('text=This is a demo mode')).toBeVisible();
    await expect(page.locator('text=localStorage')).toBeVisible();
  });

  test('studio should show "Add Blog Post" button', async ({ page }) => {
    await page.goto('/studio');

    await expect(page.locator('button', { hasText: 'Add Blog Post' })).toBeVisible();
  });

  test('clicking "Add Blog Post" should show form', async ({ page }) => {
    await page.goto('/studio');

    // Click add button
    await page.click('text=Add Blog Post');

    // Form should appear
    await expect(page.locator('input[name="title"]')).toBeVisible();
    await expect(page.locator('textarea[name="excerpt"]')).toBeVisible();
    await expect(page.locator('textarea[name="content"]')).toBeVisible();
    await expect(page.locator('input[type="checkbox"]#isFree')).toBeVisible();
  });

  test('form should have required validation', async ({ page }) => {
    await page.goto('/studio');
    await page.click('text=Add Blog Post');

    // Try to submit empty form
    await page.click('button:has-text("Save Post")');

    // Should still be on the form (validation prevents submit)
    await expect(page.locator('input[name="title"]')).toBeVisible();
  });

  test('should be able to create a blog post', async ({ page }) => {
    await page.goto('/studio');
    await page.click('text=Add Blog Post');

    // Fill in the form
    await page.fill('input[name="title"]', 'Test Blog Post');
    await page.fill('textarea[name="excerpt"]', 'This is a test excerpt');
    await page.fill('textarea[name="content"]', 'This is test content for the blog post.');

    // Leave as free content (checkbox should be checked by default)
    await expect(page.locator('input#isFree')).toBeChecked();

    // Submit form
    await page.click('button:has-text("Save Post")');

    // Should show alert or return to post list
    page.on('dialog', async (dialog) => {
      expect(dialog.message()).toContain('Blog post added');
      await dialog.accept();
    });

    // Wait for form to close
    await page.waitForTimeout(500);

    // Should be back at main studio view
    await expect(page.locator('text=Add Blog Post')).toBeVisible();
  });

  test('created post should appear in studio list', async ({ page }) => {
    await page.goto('/studio');

    // Create a post first
    await page.click('text=Add Blog Post');
    await page.fill('input[name="title"]', 'My Test Post');
    await page.fill('textarea[name="excerpt"]', 'Test excerpt');
    await page.fill('textarea[name="content"]', 'Test content');

    page.on('dialog', async (dialog) => await dialog.accept());

    await page.click('button:has-text("Save Post")');
    await page.waitForTimeout(500);

    // Should see post in the list
    await expect(page.locator('text=My Test Post')).toBeVisible();
  });

  test('should be able to toggle isFree checkbox', async ({ page }) => {
    await page.goto('/studio');
    await page.click('text=Add Blog Post');

    // Checkbox should be checked by default
    await expect(page.locator('input#isFree')).toBeChecked();

    // Uncheck it
    await page.click('label[for="isFree"]');

    // Should now be unchecked
    await expect(page.locator('input#isFree')).not.toBeChecked();

    // Check it again
    await page.click('label[for="isFree"]');
    await expect(page.locator('input#isFree')).toBeChecked();
  });

  test('cancel button should close form', async ({ page }) => {
    await page.goto('/studio');
    await page.click('text=Add Blog Post');

    // Form should be visible
    await expect(page.locator('input[name="title"]')).toBeVisible();

    // Click cancel
    await page.click('button:has-text("Cancel")');

    // Form should be hidden
    await expect(page.locator('input[name="title"]')).not.toBeVisible();
    await expect(page.locator('text=Add Blog Post')).toBeVisible();
  });

  test('created posts should persist in localStorage', async ({ page }) => {
    // Create a post
    await page.goto('/studio');
    await page.click('text=Add Blog Post');
    await page.fill('input[name="title"]', 'Persistent Post');
    await page.fill('textarea[name="excerpt"]', 'This should persist');
    await page.fill('textarea[name="content"]', 'Content here');

    page.on('dialog', async (dialog) => await dialog.accept());
    await page.click('button:has-text("Save Post")');
    await page.waitForTimeout(500);

    // Reload page
    await page.reload();

    // Post should still be visible
    await expect(page.locator('text=Persistent Post')).toBeVisible();
  });

  test('posts created in studio should appear on blog page', async ({ page }) => {
    // Create a post in studio
    await page.goto('/studio');
    await page.click('text=Add Blog Post');
    await page.fill('input[name="title"]', 'Studio to Blog Test');
    await page.fill('textarea[name="excerpt"]', 'Should appear on blog');
    await page.fill('textarea[name="content"]', 'Test content');

    page.on('dialog', async (dialog) => await dialog.accept());
    await page.click('button:has-text("Save Post")');
    await page.waitForTimeout(500);

    // Navigate to blog page
    await page.goto('/blog');

    // Post should be visible
    await expect(page.locator('text=Studio to Blog Test')).toBeVisible();
  });

  test('studio should be responsive on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/studio');

    // Should still load and show add button
    await expect(page.locator('h1')).toContainText('Content Studio');
    await expect(page.locator('text=Add Blog Post')).toBeVisible();

    // Open form
    await page.click('text=Add Blog Post');

    // Form fields should be visible
    await expect(page.locator('input[name="title"]')).toBeVisible();
  });
});
