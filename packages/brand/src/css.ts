import type { BrandConfig, BrandId } from './types';
import { brands } from './context';

/**
 * Generate CSS custom properties for a brand
 */
export function generateBrandCSS(brand: BrandConfig): string {
  const { colors } = brand;
  
  return `
/* Brand: ${brand.name} */
:root {
  --color-brand: ${colors.primary};
  --color-brand-foreground: ${colors.primaryForeground};
  ${colors.secondary ? `--color-brand-secondary: ${colors.secondary};` : ''}
  ${colors.secondaryForeground ? `--color-brand-secondary-foreground: ${colors.secondaryForeground};` : ''}
  ${colors.accent ? `--color-brand-accent: ${colors.accent};` : ''}
}

.dark {
  --color-brand: ${colors.darkPrimary ?? colors.primary};
  --color-brand-foreground: ${colors.darkPrimaryForeground ?? colors.primaryForeground};
  ${colors.darkSecondary ? `--color-brand-secondary: ${colors.darkSecondary};` : ''}
  ${colors.darkSecondaryForeground ? `--color-brand-secondary-foreground: ${colors.darkSecondaryForeground};` : ''}
}

/* Brand-specific class */
.${brand.rootClassName ?? `brand-${brand.id}`} {
  --color-fd-primary: var(--color-brand);
}
`.trim();
}

/**
 * Generate CSS for all brands
 */
export function generateAllBrandsCSS(): string {
  return Object.values(brands)
    .map(generateBrandCSS)
    .join('\n\n');
}

/**
 * Generate Tailwind CSS @theme block for a brand
 */
export function generateTailwindTheme(brand: BrandConfig): string {
  const { colors } = brand;
  
  return `
@theme {
  --color-brand: ${colors.primary};
  --color-brand-foreground: ${colors.primaryForeground};
  ${colors.secondary ? `--color-brand-secondary: ${colors.secondary};` : ''}
  ${colors.accent ? `--color-brand-accent: ${colors.accent};` : ''}
}

.dark {
  --color-brand: ${colors.darkPrimary ?? colors.primary};
  --color-brand-foreground: ${colors.darkPrimaryForeground ?? colors.primaryForeground};
}
`.trim();
}

/**
 * Get viewport theme colors for Next.js metadata
 */
export function getViewportThemeColors(brand: BrandConfig) {
  return [
    { media: '(prefers-color-scheme: dark)', color: brand.colors.themeColorDark },
    { media: '(prefers-color-scheme: light)', color: brand.colors.themeColorLight },
  ];
}

/**
 * Generate metadata for Next.js
 */
export function generateMetadata(brand: BrandConfig, page?: { title?: string; description?: string }) {
  const { metadata } = brand;
  
  return {
    title: page?.title 
      ? { default: page.title, template: metadata.titleTemplate }
      : { default: metadata.title, template: metadata.titleTemplate },
    description: page?.description ?? metadata.description,
    keywords: metadata.keywords,
    openGraph: {
      title: page?.title ?? metadata.title,
      description: page?.description ?? metadata.description,
      images: metadata.ogImage ? [metadata.ogImage] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      creator: metadata.twitterHandle,
    },
  };
}
