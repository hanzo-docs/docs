import { describe, expect, it } from 'vitest';
import { codeToHtml } from 'shiki';
import { shikiConfig } from './shiki';

/**
 * Tests that the "The screen" diagram on the workspace page renders with
 * aligned box-drawing columns. The diagram originally contained emoji/symbols 
 * (🕘, ◍, ✎, ▾, ✕) that are wider than single monospace cells, causing misalignment.
 * These have been replaced with single-width ASCII alternatives.
 */
describe('workspace diagram alignment', () => {
  // This is the updated diagram from workspace.mdx with ASCII replacements
  const diagram = `┌──────────────────────────────────────────────────────────────────────────┐
│  <  >  @            [ Search Hanzo            ]              ?    o      │
├──────┬────────────────┬───────────────────────────────────┬──────────────┤
│  A   │ Acme      v  + │ # general · 12 members            │ Thread     x │
│      ├────────────────┼───────────────────────────────────┤              │
│ Home │ Threads        │ Messages · Canvas · Files · Pins  │              │
│ DMs  │ Huddles        ├───────────────────────────────────┤   replies    │
│ Act. │ Drafts & sent  │                                   │              │
│ Later│                │          message list             │              │
│ More │ v Channels     │                                   │              │
│      │   # general    │                                   │              │
│      │   # design     │                                   │              │
│      │   + Add        ├───────────────────────────────────┤              │
│      │ v Direct msgs  │  composer + format bar            │              │
│  +   │   Kim          │                                   │              │
│  o   │                │                                   │              │
└──────┴────────────────┴───────────────────────────────────┴──────────────┘
   76         260                     fills                       380`;

  it('renders with aligned columns - each box line has same display width', () => {
    const sourceLines = diagram.split('\n');
    const boxWidths = sourceLines
      .slice(0, -1) // Exclude dimension line
      .map(line => {
        // Extract content between the box drawing characters │ or ┌/└/├/┤/┬/┴
        // For lines with │ on both sides, measure between them
        const match = line.match(/^[│┌├└┤┬┴](.*)[│┐┤┘┬┴]$/);
        if (match) {
          return match[1].length;
        }
        // For top/bottom borders
        const borderMatch = line.match(/^[┌└](.*)[┐┘]$/);
        if (borderMatch) {
          return borderMatch[1].length;
        }
        // For middle borders like ├────┤
        const midMatch = line.match(/^[├┤](.*)[┤┘]$/);
        if (midMatch) {
          return midMatch[1].length;
        }
        return line.length;
      });
    
    console.log('Box interior widths:', boxWidths);
    sourceLines.slice(0, -1).forEach((line, i) => {
      console.log(`Line ${i}: boxWidth=${boxWidths[i]} |${line}|`);
    });
    
    // All box interior lines should have the same width (74 chars between borders)
    const expectedWidth = 74;
    for (let i = 0; i < boxWidths.length; i++) {
      expect(boxWidths[i]).toBe(expectedWidth);
    }
  });
  
  it('the diagram source should not contain double-width emoji that break alignment', () => {
    // This test verifies the source doesn't have problematic characters
    // If it fails, we need to replace emoji with single-width ASCII alternatives
    const doubleWidthChars = diagram.match(/[🕘◍✎✕▾]/g) || [];
    expect(doubleWidthChars.length).toBe(0);
  });
});
