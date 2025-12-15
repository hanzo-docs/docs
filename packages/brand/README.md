# @hanzo/docs-brand

Brand configuration system for Hanzo, Lux, and Zoo documentation sites.

## Overview

This package provides a unified brand configuration system that allows the same documentation framework to be customized for different organizations while sharing core functionality.

## Supported Brands

| Brand | Organization | Website | Docs |
|-------|-------------|---------|------|
| **Hanzo** | Hanzo AI Inc | [hanzo.ai](https://hanzo.ai) | [docs.hanzo.ai](https://docs.hanzo.ai) |
| **Lux** | Lux Network | [lux.network](https://lux.network) | [docs.lux.network](https://docs.lux.network) |
| **Zoo** | Zoo Labs Foundation | [zoo.ngo](https://zoo.ngo) | [docs.zoo.ngo](https://docs.zoo.ngo) |

## Installation

```bash
pnpm add @hanzo/docs-brand
```

## Usage

### Environment Variable

Set the `NEXT_PUBLIC_BRAND` environment variable to switch brands:

```bash
# .env.local
NEXT_PUBLIC_BRAND=hanzo  # or 'lux' or 'zoo'
```

### Brand Provider

Wrap your app with the `BrandProvider`:

```tsx
import { BrandProvider } from '@hanzo/docs-brand';

export default function RootLayout({ children }) {
  return (
    <BrandProvider>
      {children}
    </BrandProvider>
  );
}
```

### Using Brand Configuration

```tsx
import { useBrand } from '@hanzo/docs-brand';

function Header() {
  const brand = useBrand();
  
  return (
    <header>
      {brand.logo.component}
      <span>{brand.name}</span>
    </header>
  );
}
```

### Direct Brand Access

```tsx
import { getBrand, hanzoBrand, luxBrand, zooBrand } from '@hanzo/docs-brand';

// Get brand by ID
const brand = getBrand('hanzo');

// Or use directly
const { colors, metadata } = hanzoBrand;
```

### CSS Integration

Import the brand CSS in your global styles:

```css
/* For Hanzo */
@import '@hanzo/docs-brand/css/hanzo.css';

/* For Lux */
@import '@hanzo/docs-brand/css/lux.css';

/* For Zoo */
@import '@hanzo/docs-brand/css/zoo.css';
```

Or generate CSS dynamically:

```ts
import { generateBrandCSS, getBrand } from '@hanzo/docs-brand';

const css = generateBrandCSS(getBrand('hanzo'));
```

### Metadata Generation

```ts
import { generateMetadata, getBrand } from '@hanzo/docs-brand';

export const metadata = generateMetadata(getBrand('hanzo'), {
  title: 'Getting Started',
  description: 'Learn how to use Hanzo AI',
});
```

## API Reference

### Types

```ts
interface BrandConfig {
  id: BrandId;
  name: string;
  fullName: string;
  tagline: string;
  colors: BrandColors;
  logo: BrandLogo;
  links: BrandLinks;
  metadata: BrandMetadata;
  footer: BrandFooter;
  layoutOptions?: Partial<BaseLayoutProps>;
  rootClassName?: string;
}

type BrandId = 'hanzo' | 'lux' | 'zoo';
```

### Functions

- `getBrand(id: BrandId)` - Get brand configuration by ID
- `getBrandFromEnv()` - Get brand ID from environment variable
- `useBrand()` - React hook to access current brand
- `useBrandContext()` - React hook with brand setter
- `generateBrandCSS(brand)` - Generate CSS custom properties
- `generateMetadata(brand, page?)` - Generate Next.js metadata

### Components

- `BrandProvider` - Context provider for brand configuration
- `HanzoIcon` - Hanzo AI icon component
- `LuxIcon` - Lux Network icon component
- `ZooIcon` - Zoo Labs icon component

## Customization

### Adding a New Brand

1. Create brand configuration in `src/brands/newbrand.tsx`
2. Export from `src/brands/index.ts`
3. Add to `brands` map in `src/context.tsx`
4. Create CSS file in `css/newbrand.css`
5. Update `BrandId` type

### Overriding Brand Colors

```css
.brand-hanzo {
  --color-brand: your-custom-color;
}
```

## License

MIT © Hanzo AI Inc
