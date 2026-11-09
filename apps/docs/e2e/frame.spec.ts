import { expect, test } from '@playwright/test';

// The footer closes the column under the page, never over it. The page's wrapper
// was flex={1}: `1 1 0px` in @hanzo/gui, whose views have no content minimum, so
// at 1440x900 it got the 135px the bar and the footer left of the screen, and
// the footer drew across the landing's hero and the top of every doc.
for (const path of ['/', '/docs/']) {
  test(`${path}: the page holds its content and the footer follows it`, async ({ page }) => {
    await page.goto(path, { waitUntil: 'load' });
    const frame = await page
      .locator('footer')
      .first()
      .evaluate((footer) => {
        const wrapper = footer.previousElementSibling as HTMLElement;
        return {
          content: wrapper.scrollHeight,
          height: wrapper.clientHeight,
          end: wrapper.getBoundingClientRect().bottom,
          footer: footer.getBoundingClientRect().top,
        };
      });
    expect(frame.content, 'the page overflows its wrapper').toBeLessThanOrEqual(frame.height + 1);
    expect(frame.footer, 'the footer starts above the end of the page').toBeGreaterThanOrEqual(
      frame.end - 1,
    );
  });
}
