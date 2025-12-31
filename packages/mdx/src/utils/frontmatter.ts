/**
 * Frontmatter parser - inspired by gray-matter
 */
import { load } from 'js-yaml';

interface FrontmatterOutput {
  /**
   * The frontmatter section, including the delimiter.
   */
  matter: string;
  content: string;
  data: unknown;
}

const regex = /^---\r?\n(.+?)\r?\n---\r?\n?/s;

/**
 * Parse YAML frontmatter from markdown content
 */
export function parseFrontmatter(input: string): FrontmatterOutput {
  const output: FrontmatterOutput = { matter: '', data: {}, content: input };
  const match = regex.exec(input);
  if (!match) {
    return output;
  }

  // get the raw front-matter block
  output.matter = match[0];
  output.content = input.slice(match[0].length);

  const loaded = load(match[1]);
  output.data = loaded ?? {};

  return output;
}
