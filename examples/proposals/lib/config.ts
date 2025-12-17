/**
 * Proposal Site Configuration
 *
 * Import and use the appropriate brand for your site:
 * - luxBrand for LPs (Lux Proposals)
 * - hanzoBrand for HIPs (Hanzo Improvement Proposals)
 * - zooBrand for ZIPs (Zoo Improvement Proposals)
 *
 * Or create a custom brand configuration.
 */

import { defaultBrand, type BrandConfig } from './brand';

// Export the active brand configuration
// Change this import to customize for your site:
// import { luxBrand as brand } from './brand';
// import { hanzoBrand as brand } from './brand';
// import { zooBrand as brand } from './brand';

export const brand: BrandConfig = defaultBrand;

// Re-export for convenience
export type { BrandConfig } from './brand';
