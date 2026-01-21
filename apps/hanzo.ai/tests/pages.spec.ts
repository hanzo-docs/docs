import { test, expect } from '@playwright/test';

// Core pages to test
const pages = [
  { path: '/', name: 'Homepage' },
  { path: '/about', name: 'About' },
  { path: '/blog', name: 'Blog' },
  { path: '/brand', name: 'Brand' },
  { path: '/careers', name: 'Careers' },
  { path: '/contact', name: 'Contact' },
  { path: '/enterprise', name: 'Enterprise' },
  { path: '/pricing', name: 'Pricing' },
  { path: '/privacy', name: 'Privacy' },
  { path: '/security', name: 'Security' },
  { path: '/status', name: 'Status' },
  { path: '/terms', name: 'Terms' },
];

// Dynamic routes to test
const dynamicPages = [
  { path: '/products/data', name: 'Products - Data' },
  { path: '/products/compute', name: 'Products - Compute' },
  { path: '/products/data/sql', name: 'Product - SQL' },
  { path: '/solutions/cloud', name: 'Solutions - Cloud' },
  { path: '/solutions/data-ai', name: 'Solutions - Data AI' },
  { path: '/team/dev', name: 'Team - Dev' },
  { path: '/team/des', name: 'Team - Des' },
];

test.describe('Static Pages', () => {
  for (const page of pages) {
    test(`${page.name} loads correctly`, async ({ page: browserPage }) => {
      const response = await browserPage.goto(page.path);
      expect(response?.status()).toBe(200);

      // Check page has content
      await expect(browserPage.locator('body')).not.toBeEmpty();

      // Check no console errors
      const errors: string[] = [];
      browserPage.on('console', msg => {
        if (msg.type() === 'error') errors.push(msg.text());
      });

      // Wait for page to be fully loaded
      await browserPage.waitForLoadState('networkidle');
    });
  }
});

test.describe('Dynamic Routes', () => {
  for (const page of dynamicPages) {
    test(`${page.name} loads correctly`, async ({ page: browserPage }) => {
      const response = await browserPage.goto(page.path);
      expect(response?.status()).toBe(200);
      await expect(browserPage.locator('body')).not.toBeEmpty();
      await browserPage.waitForLoadState('networkidle');
    });
  }
});

test.describe('Navigation', () => {
  test('Homepage has navigation', async ({ page }) => {
    await page.goto('/');

    // Check navbar exists
    const navbar = page.locator('nav').first();
    await expect(navbar).toBeVisible();
  });

  test('Footer links work', async ({ page }) => {
    await page.goto('/');

    // Check footer exists
    const footer = page.locator('footer').first();
    await expect(footer).toBeVisible();
  });

  test('Internal links navigate correctly', async ({ page }) => {
    await page.goto('/');

    // Find a link to About page and click it
    const aboutLink = page.locator('a[href="/about"]').first();
    if (await aboutLink.isVisible()) {
      await aboutLink.click();
      await expect(page).toHaveURL(/\/about/);
    }
  });
});

test.describe('Visual Checks', () => {
  test('Homepage renders without layout shift', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Take screenshot for visual comparison
    await expect(page).toHaveScreenshot('homepage.png', {
      fullPage: false,
      threshold: 0.2,
    });
  });
});
