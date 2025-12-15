// Types
export type {
  BrandId,
  BrandConfig,
  BrandColors,
  BrandLogo,
  BrandLinks,
  BrandMetadata,
  BrandFooter,
  BrandContextValue,
} from './types';

// Brand configurations
export { hanzoBrand, HanzoIcon } from './brands/hanzo';
export { luxBrand, LuxIcon } from './brands/lux';
export { zooBrand, ZooIcon } from './brands/zoo';

// Context and utilities
export {
  brands,
  getBrand,
  getBrandFromEnv,
  BrandProvider,
  useBrand,
  useBrandContext,
} from './context';
export type { BrandProviderProps } from './context';

// CSS utilities
export {
  generateBrandCSS,
  generateAllBrandsCSS,
  generateTailwindTheme,
  getViewportThemeColors,
  generateMetadata,
} from './css';
