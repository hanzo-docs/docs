# Proposals Documentation Template

A shared template for improvement proposals documentation sites:

- **LPs** - Lux Proposals (lps.lux.network)
- **HIPs** - Hanzo Improvement Proposals (hips.hanzo.ai)
- **ZIPs** - Zoo Improvement Proposals (zips.zoo.ngo)

## Quick Start

```bash
pnpm install
pnpm dev
```

## Customization

### Brand Configuration

Edit `lib/config.ts` to use your brand:

```ts
// For Lux Proposals
import { luxBrand as brand } from './brand';
export { brand };

// For Hanzo Improvement Proposals
import { hanzoBrand as brand } from './brand';
export { brand };

// For Zoo Improvement Proposals
import { zooBrand as brand } from './brand';
export { brand };
```

### Content Directory

Edit `lib/instance.ts` to point to your proposals directory:

```ts
// For LPs repository structure
const PROPOSALS_DIR = path.join(process.cwd(), '../LPs');
```

### Categories

Customize categories in `lib/brand.ts` by editing the categories array:

```ts
categories: [
  {
    name: 'Core',
    shortDesc: 'Core specifications',
    description: 'Full description...',
    range: [0, 99],  // Proposal number range
    icon: 'layers',   // Icon from lucide-react
    color: 'blue',    // Tailwind color
    learnMore: 'Educational content...',
    keyTopics: ['Topic 1', 'Topic 2'],
  },
]
```

## Features

- **Context-Sensitive Search** - Cmd+K opens a search dialog with:
  - Category-based navigation
  - Full-text search across proposals
  - Page-specific actions (edit on GitHub, view raw, join discussion)
  - Keyboard navigation

- **Proposal Metadata** - Automatic parsing of frontmatter:
  - Status badges (Draft, Review, Final, etc.)
  - Category classification
  - Author attribution
  - Dependencies tracking

- **Statistics Dashboard** - Sidebar showing:
  - Total proposals count
  - Count by status
  - Count by type

## Project Structure

```
proposals/
├── app/
│   ├── api/search/     # Search API endpoint
│   ├── docs/           # Documentation pages
│   ├── (home)/         # Landing page
│   ├── global.css      # Global styles
│   └── layout.tsx      # Root layout
├── components/
│   └── search-dialog.tsx  # Custom search with quick actions
├── lib/
│   ├── brand.ts        # Brand configurations (LP, HIP, ZIP)
│   ├── config.ts       # Active brand selection
│   ├── source.ts       # Proposal source loader
│   └── instance.ts     # Source instance
├── content/docs/       # Sample proposals (or point to real dir)
└── public/             # Static assets
```

## Deployment

### For Lux Proposals (lps.lux.network)

1. Clone the lps repository
2. Copy this template to the `docs/` directory
3. Update `lib/config.ts` to use `luxBrand`
4. Update `lib/instance.ts` to point to `../LPs`
5. Deploy to Vercel/Netlify

### For Hanzo HIPs or Zoo ZIPs

Same process, using the appropriate brand configuration.

## License

MIT - See [LICENSE](../../LICENSE)
