import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import type { BrandConfig, ProposalCategory } from './brand';

/**
 * Proposal Metadata from frontmatter
 */
export interface ProposalMetadata {
  proposal?: number | string;
  title?: string;
  description?: string;
  status?: 'Draft' | 'Review' | 'Last Call' | 'Final' | 'Withdrawn' | 'Stagnant' | 'Superseded';
  type?: 'Standards Track' | 'Meta' | 'Informational';
  category?: string;
  author?: string;
  created?: string;
  updated?: string;
  requires?: string | number[];
  tags?: string[];
  [key: string]: unknown;
}

/**
 * A single proposal page
 */
export interface ProposalPage {
  slug: string[];
  data: {
    title: string;
    description?: string;
    content: string;
    frontmatter: ProposalMetadata;
  };
}

/**
 * A category with its proposals
 */
export interface ProposalCategoryWithPages extends ProposalCategory {
  proposals: ProposalPage[];
}

/**
 * Create a proposal source loader for a given brand and directory
 */
export function createProposalSource(brand: BrandConfig, proposalsDir: string) {
  const prefix = brand.proposalPrefix.toLowerCase();

  function getAllProposalFiles(): string[] {
    try {
      const files = fs.readdirSync(proposalsDir);
      return files
        .filter(file => file.endsWith('.md') || file.endsWith('.mdx'))
        .filter(file => file.startsWith(`${prefix}-`) || file === 'index.mdx');
    } catch (error) {
      console.error('Error reading proposals directory:', error);
      return [];
    }
  }

  function readProposalFile(filename: string): ProposalPage | null {
    try {
      const filePath = path.join(proposalsDir, filename);
      const fileContents = fs.readFileSync(filePath, 'utf8');
      const { data, content } = matter(fileContents);

      const slug = filename.replace(/\.mdx?$/, '').split('/');

      // Extract proposal number from filename or frontmatter
      const numMatch = filename.match(new RegExp(`${prefix}-(\\d+)`));
      const proposalNumber = data.proposal || data[prefix.toLowerCase()] || (numMatch ? parseInt(numMatch[1], 10) : null);

      // Convert Date objects to strings
      const processedData: Record<string, unknown> = {};
      for (const [key, value] of Object.entries(data)) {
        if (value instanceof Date) {
          processedData[key] = value.toISOString().split('T')[0];
        } else {
          processedData[key] = value;
        }
      }

      return {
        slug,
        data: {
          title: processedData.title as string || filename.replace(/\.mdx?$/, ''),
          description: processedData.description as string,
          content,
          frontmatter: {
            ...processedData,
            proposal: proposalNumber,
          } as ProposalMetadata,
        },
      };
    } catch (error) {
      console.error(`Error reading proposal file ${filename}:`, error);
      return null;
    }
  }

  function getProposalNumber(page: ProposalPage): number {
    const num = page.data.frontmatter.proposal;
    if (typeof num === 'number') return num;
    if (typeof num === 'string') return parseInt(num, 10) || 9999;
    return 9999;
  }

  return {
    brand,
    prefix,

    getPage(slugParam?: string[]): ProposalPage | null {
      if (!slugParam || slugParam.length === 0) {
        return null;
      }

      const slug = slugParam;
      const filename = `${slug.join('/')}.md`;
      const mdxFilename = `${slug.join('/')}.mdx`;

      let page = readProposalFile(filename);
      if (!page) {
        page = readProposalFile(mdxFilename);
      }

      return page;
    },

    generateParams(): { slug: string[] }[] {
      const files = getAllProposalFiles();
      return files.map(file => ({
        slug: file.replace(/\.mdx?$/, '').split('/'),
      }));
    },

    getAllPages(): ProposalPage[] {
      const files = getAllProposalFiles();
      return files
        .map(readProposalFile)
        .filter((page): page is ProposalPage => page !== null)
        .sort((a, b) => getProposalNumber(a) - getProposalNumber(b));
    },

    getPagesByStatus(status: string): ProposalPage[] {
      return this.getAllPages().filter(
        page => page.data.frontmatter.status?.toLowerCase() === status.toLowerCase()
      );
    },

    getPagesByType(type: string): ProposalPage[] {
      return this.getAllPages().filter(
        page => page.data.frontmatter.type?.toLowerCase() === type.toLowerCase()
      );
    },

    getCategorizedPages(): ProposalCategoryWithPages[] {
      const allPages = this.getAllPages();

      return brand.categories.map(cat => ({
        ...cat,
        proposals: allPages.filter(page => {
          const num = getProposalNumber(page);
          return num >= cat.range[0] && num <= cat.range[1];
        }),
      })).filter(cat => cat.proposals.length > 0);
    },

    getAllCategories(): ProposalCategoryWithPages[] {
      const allPages = this.getAllPages();

      return brand.categories.map(cat => ({
        ...cat,
        proposals: allPages.filter(page => {
          const num = getProposalNumber(page);
          return num >= cat.range[0] && num <= cat.range[1];
        }),
      }));
    },

    getStats(): { total: number; byStatus: Record<string, number>; byType: Record<string, number> } {
      const pages = this.getAllPages();
      const byStatus: Record<string, number> = {};
      const byType: Record<string, number> = {};

      pages.forEach(page => {
        const status = page.data.frontmatter.status || 'Unknown';
        const type = page.data.frontmatter.type || 'Unknown';
        byStatus[status] = (byStatus[status] || 0) + 1;
        byType[type] = (byType[type] || 0) + 1;
      });

      return { total: pages.length, byStatus, byType };
    },

    getPageTree() {
      const categories = this.getCategorizedPages();

      return {
        name: brand.shortName,
        children: [
          {
            type: 'page',
            name: 'Overview',
            url: '/docs',
          },
          ...categories.map(cat => ({
            type: 'folder',
            name: cat.name,
            description: cat.shortDesc,
            children: cat.proposals.slice(0, 20).map(p => ({
              type: 'page',
              name: `${brand.proposalPrefix}-${p.data.frontmatter.proposal}: ${p.data.title.substring(0, 40)}${p.data.title.length > 40 ? '...' : ''}`,
              url: `/docs/${p.slug.join('/')}`,
            })),
          })),
        ],
      };
    },

    search(query: string): ProposalPage[] {
      const q = query.toLowerCase();
      return this.getAllPages().filter(page => {
        const title = page.data.title.toLowerCase();
        const description = (page.data.description || '').toLowerCase();
        const content = page.data.content.toLowerCase();
        const tags = (page.data.frontmatter.tags || []).join(' ').toLowerCase();

        return title.includes(q) || description.includes(q) || content.includes(q) || tags.includes(q);
      });
    },
  };
}

export type ProposalSource = ReturnType<typeof createProposalSource>;
