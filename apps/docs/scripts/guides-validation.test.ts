import { describe, expect, it } from 'vitest';
import { validateGuides } from '../../../scripts/validate-guides.mjs';

describe('intelligence engineering guides & frontmatter validation', () => {
  it('validates all 50 flagship guides across 8 categories, canonical frontmatter, links, courses, and strict /v1/ routes', () => {
    const { checkedFiles, totalCatalogGuides, errors } = validateGuides();
    expect(totalCatalogGuides).toBe(50);
    expect(checkedFiles).toBeGreaterThanOrEqual(80);
    expect(errors).toEqual([]);
  });
});
