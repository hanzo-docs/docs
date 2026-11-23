import { expect, test } from '@playwright/test';

// Test that the workspace page "The screen" diagram renders with aligned columns
test('workspace page: The screen diagram has aligned columns', async ({ page }) => {
  await page.goto('/docs/workspace', { waitUntil: 'load' });
  
  // Find the "The screen" section
  const screenSection = page.locator('h2:has-text("The screen")');
  await expect(screenSection).toBeVisible();
  
  // Get the code block after "The screen" heading
  const codeBlock = screenSection.locator('xpath=following-sibling::figure[1]//pre').first();
  await expect(codeBlock).toBeVisible();
  
  // Get the text content of the code block
  const codeText = await codeBlock.textContent();
  console.log('Code block text:', codeText);
  
  // Split into lines and check that each line has the same display width
  const lines = codeText?.split('\n').filter(l => l.trim().length > 0) || [];
  console.log('Lines:', lines);
  
  // Check that box corners line up - first and last characters of each line should be │ or ┌/└/├/┤
  // The diagram uses box drawing characters
  for (const line of lines) {
    console.log('Line:', JSON.stringify(line));
  }
  
  // The first line should start with ┌ and end with ┐
  // The middle lines should start with │ and end with │
  // The last line should start with └ and end with ┘
  expect(lines[0]).toMatch(/^┌.*┐$/);
  expect(lines[lines.length - 1]).toMatch(/^└.*┘$/);
  
  // Check that all lines have consistent visual width
  // This is a proxy - we check character count (approximation)
  const widths = lines.map(l => l.length);
  console.log('Line widths:', widths);
  
  // All lines should have similar width (within a few chars for emoji)
  const maxWidth = Math.max(...widths);
  const minWidth = Math.min(...widths);
  expect(maxWidth - minWidth).toBeLessThanOrEqual(5); // Allow small variance for emoji
  
  // Also check the code block doesn't wrap (has horizontal scroll if needed)
  const preStyle = await codeBlock.evaluate(el => getComputedStyle(el));
  expect(preStyle.whiteSpace).toBe('pre');
  expect(preStyle.overflowX).toBe('auto');
});
