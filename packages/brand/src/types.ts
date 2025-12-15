import type { ReactNode } from 'react';
import type { BaseLayoutProps, LinkItemType } from 'fumadocs-ui/layouts/shared';

/**
 * Brand identifier type
 */
export type BrandId = 'hanzo' | 'lux' | 'zoo';

/**
 * Color configuration for a brand
 */
export interface BrandColors {
  /** Primary brand color (light mode) */
  primary: string;
  /** Primary foreground color (light mode) */
  primaryForeground: string;
  /** Secondary brand color (light mode) */
  secondary?: string;
  /** Secondary foreground color (light mode) */
  secondaryForeground?: string;
  /** Accent color (light mode) */
  accent?: string;
  /** Dark mode primary color */
  darkPrimary?: string;
  /** Dark mode primary foreground */
  darkPrimaryForeground?: string;
  /** Dark mode secondary color */
  darkSecondary?: string;
  /** Dark mode secondary foreground */
  darkSecondaryForeground?: string;
  /** Theme color for meta tag (light mode) */
  themeColorLight: string;
  /** Theme color for meta tag (dark mode) */
  themeColorDark: string;
}

/**
 * Logo configuration
 */
export interface BrandLogo {
  /** Logo component or element */
  component: ReactNode;
  /** Alt text for the logo */
  alt: string;
  /** Logo width */
  width?: number;
  /** Logo height */
  height?: number;
  /** Path to logo image (for static assets) */
  src?: string;
}

/**
 * Social and external links
 */
export interface BrandLinks {
  /** GitHub organization URL */
  github?: string;
  /** Twitter/X URL */
  twitter?: string;
  /** Discord server URL */
  discord?: string;
  /** Website URL */
  website: string;
  /** Documentation base URL */
  docs: string;
  /** Additional custom links */
  custom?: LinkItemType[];
}

/**
 * SEO and metadata configuration
 */
export interface BrandMetadata {
  /** Site title */
  title: string;
  /** Title template for pages */
  titleTemplate: string;
  /** Default description */
  description: string;
  /** Keywords for SEO */
  keywords?: string[];
  /** Open Graph image path */
  ogImage?: string;
  /** Twitter handle */
  twitterHandle?: string;
}

/**
 * Footer configuration
 */
export interface BrandFooter {
  /** Copyright text */
  copyright: string;
  /** Footer links organized by category */
  links?: {
    title: string;
    items: {
      label: string;
      href: string;
      external?: boolean;
    }[];
  }[];
  /** Show "Built with" attribution */
  showBuiltWith?: boolean;
}

/**
 * Complete brand configuration
 */
export interface BrandConfig {
  /** Unique brand identifier */
  id: BrandId;
  /** Display name of the brand */
  name: string;
  /** Full organization name */
  fullName: string;
  /** Short tagline */
  tagline: string;
  /** Color configuration */
  colors: BrandColors;
  /** Logo configuration */
  logo: BrandLogo;
  /** External links */
  links: BrandLinks;
  /** SEO metadata */
  metadata: BrandMetadata;
  /** Footer configuration */
  footer: BrandFooter;
  /** Base layout options override */
  layoutOptions?: Partial<BaseLayoutProps>;
  /** Custom CSS class to apply to root */
  rootClassName?: string;
}

/**
 * Brand context value type
 */
export interface BrandContextValue {
  brand: BrandConfig;
  setBrand: (brand: BrandConfig) => void;
}
