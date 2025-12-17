import path from 'path';
import { createProposalSource } from './source';
import { brand } from './config';

// Create the proposals source
// Proposals are expected in ../content/docs directory by default
// For actual deployment, point to your proposals directory
const PROPOSALS_DIR = path.join(process.cwd(), 'content/docs');

export const source = createProposalSource(brand, PROPOSALS_DIR);
