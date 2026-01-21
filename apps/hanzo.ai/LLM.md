# hanzo.ai - Next.js Migration

## Migration Status

**Completed:** 2026-01-21

### Phase Completion
- ✅ Phase 1: Infrastructure Setup
- ⏸️ Phase 2: Create marketing-ui Package (deferred)
- ✅ Phase 3: Migrate UI Primitives
- ✅ Phase 4: Migrate Pages (69 pages)
- ✅ Phase 5: Convert React-Specific Code
- 🔄 Phase 6: Testing & Deployment (in progress)

### Build Status
```
✓ Compiled successfully
✓ Generating static pages (69/69)
✓ Exporting (3/3)
```

### Migrated Pages (16 routes → 69 static pages)

**Static Pages:**
- `/` - Homepage
- `/about` - About page
- `/blog` - Blog listing
- `/brand` - Brand guidelines
- `/careers` - Careers page
- `/contact` - Contact page
- `/enterprise` - Enterprise page
- `/pricing` - Pricing page
- `/privacy` - Privacy policy
- `/security` - Security page
- `/status` - Status page
- `/terms` - Terms of service

**Dynamic Routes (SSG):**
- `/products/[categoryId]` - 9 category pages
- `/products/[categoryId]/[productId]` - 14 product pages
- `/solutions/[solutionId]` - 16 solution pages
- `/team/[member]` - 15 team member pages

### Not Yet Migrated
The following pages from the original Vite site are not yet migrated:
- Account pages (dashboard, billing, settings, invoices, usage)
- Auth pages (login, signup)
- Product-specific pages (AI Studio, HanzoCode, HanzoBot, Operative, etc.)
- Additional marketing pages (Zen, ZenModels, Platform, Blockchain, etc.)

## Technical Details

### Key Fixes Applied

1. **react-day-picker v9** - Changed `IconLeft`/`IconRight` to `Chevron` component
2. **react-resizable-panels** - Downgraded to v2.1.6 for API compatibility
3. **recharts** - Added explicit types for ChartTooltipContent and ChartLegendContent
4. **stripe.ts** - Converted Vite env vars to Next.js format

### Dependencies Added
- @radix-ui/react-* (checkbox, collapsible, context-menu, hover-card, label, menubar, progress, radio-group, slider, switch, toast, toggle, toggle-group, alert-dialog, aspect-ratio, avatar)
- react-day-picker, recharts, date-fns
- @stripe/stripe-js, @stripe/react-stripe-js
- embla-carousel-react, embla-carousel-autoplay
- cmdk, vaul, input-otp
- react-resizable-panels@2.1.6

### TypeScript Configuration
Using relaxed TypeScript settings for migration:
```json
{
  "strict": false,
  "noImplicitAny": false,
  "strictNullChecks": false
}
```

## Architecture

```
apps/hanzo.ai/
├── app/
│   ├── (marketing)/          # Marketing route group
│   │   ├── layout.tsx        # Shared layout (navbar + footer)
│   │   ├── page.tsx          # Homepage
│   │   ├── products/         # Dynamic product routes
│   │   ├── solutions/        # Dynamic solution routes
│   │   ├── team/             # Dynamic team member routes
│   │   └── [static pages]/   # About, blog, careers, etc.
│   ├── layout.tsx            # Root layout
│   └── globals.css           # Global styles
├── components/               # React components
├── constants/                # Data constants
├── lib/                      # Utility functions
├── services/                 # API services (stripe)
└── public/                   # Static assets
```

## Commands

```bash
# Development
pnpm dev        # Start dev server on port 3001

# Build
pnpm build      # Build for production (static export)

# Preview
pnpm start      # Preview production build
```

## Next Steps

1. Deploy to GitHub Pages
2. Migrate remaining account pages
3. Migrate auth pages
4. Migrate product-specific pages
5. Consider creating shared marketing-ui package
