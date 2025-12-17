/**
 * Brand Configuration for Improvement Proposals Sites
 *
 * This file defines the branding for the proposals documentation site.
 * Override these values in your project to customize for:
 * - LPs (Lux Proposals) - lps.lux.network
 * - HIPs (Hanzo Improvement Proposals) - hips.hanzo.ai
 * - ZIPs (Zoo Improvement Proposals) - zips.zoo.ngo
 */

export interface BrandConfig {
  // Site identity
  name: string;
  shortName: string;
  fullName: string;
  description: string;

  // URLs
  baseUrl: string;
  githubRepo: string;
  forumUrl?: string;
  docsUrl?: string;

  // Proposal naming
  proposalPrefix: string; // e.g., "LP", "HIP", "ZIP"
  proposalName: string;   // e.g., "Lux Proposal"

  // Categories
  categories: ProposalCategory[];

  // Theme
  primaryColor?: string;
  logoPath?: string;
}

export interface ProposalCategory {
  name: string;
  shortDesc: string;
  description: string;
  range: [number, number];
  icon: string;
  color: string;
  learnMore: string;
  keyTopics: string[];
}

// Default brand configuration (override in your project)
export const defaultBrand: BrandConfig = {
  name: 'Proposals',
  shortName: 'PIPs',
  fullName: 'Project Improvement Proposals',
  description: 'Community-driven governance and standards',

  baseUrl: 'https://proposals.example.com',
  githubRepo: 'https://github.com/example/proposals',
  forumUrl: 'https://forum.example.com',
  docsUrl: 'https://docs.example.com',

  proposalPrefix: 'PIP',
  proposalName: 'Project Improvement Proposal',

  categories: [
    {
      name: 'Core',
      shortDesc: 'Core specifications',
      description: 'Foundational specifications defining core functionality.',
      range: [0, 99],
      icon: 'layers',
      color: 'blue',
      learnMore: 'Core proposals define the fundamental architecture and protocols.',
      keyTopics: ['Architecture', 'Protocols', 'Data structures'],
    },
    {
      name: 'Standards',
      shortDesc: 'Technical standards',
      description: 'Technical specifications and standards for interoperability.',
      range: [100, 199],
      icon: 'code',
      color: 'purple',
      learnMore: 'Standards ensure consistent implementations across the ecosystem.',
      keyTopics: ['APIs', 'Interfaces', 'Formats'],
    },
    {
      name: 'Process',
      shortDesc: 'Governance processes',
      description: 'Process and governance proposals for community coordination.',
      range: [200, 299],
      icon: 'users',
      color: 'green',
      learnMore: 'Process proposals define how the community makes decisions.',
      keyTopics: ['Governance', 'Voting', 'Proposals'],
    },
  ],
};

// Lux Proposals branding
export const luxBrand: BrandConfig = {
  name: 'Lux Proposals',
  shortName: 'LPs',
  fullName: 'Lux Improvement Proposals',
  description: 'Standards and improvement proposals for the Lux Network',

  baseUrl: 'https://lps.lux.network',
  githubRepo: 'https://github.com/luxfi/lps',
  forumUrl: 'https://forum.lux.network',
  docsUrl: 'https://docs.lux.network',

  proposalPrefix: 'LP',
  proposalName: 'Lux Proposal',

  categories: [
    {
      name: 'Core Architecture',
      shortDesc: 'Network fundamentals',
      description: 'Foundational specifications for Lux Network operation.',
      range: [0, 99],
      icon: 'layers',
      color: 'blue',
      learnMore: 'Core architecture LPs define the backbone of Lux Network.',
      keyTopics: ['Network topology', 'Node specifications', 'Multi-chain design'],
    },
    {
      name: 'Consensus',
      shortDesc: 'Consensus protocols',
      description: 'Consensus mechanisms securing the network with sub-second finality.',
      range: [100, 199],
      icon: 'consensus',
      color: 'purple',
      learnMore: 'Consensus protocols enable fast, secure agreement across nodes.',
      keyTopics: ['Snowman', 'Avalanche', 'Byzantine tolerance'],
    },
    {
      name: 'Cryptography',
      shortDesc: 'Cryptographic standards',
      description: 'Cryptographic primitives and post-quantum security standards.',
      range: [200, 299],
      icon: 'lock',
      color: 'emerald',
      learnMore: 'Cryptography secures transactions and future-proofs the network.',
      keyTopics: ['Digital signatures', 'Post-quantum', 'Zero-knowledge'],
    },
    {
      name: 'Token Standards',
      shortDesc: 'LRC token specifications',
      description: 'Standards for fungible and non-fungible tokens on Lux.',
      range: [300, 399],
      icon: 'token',
      color: 'amber',
      learnMore: 'Token standards define how digital assets are managed.',
      keyTopics: ['LRC-20', 'LRC-721', 'LRC-1155'],
    },
  ],
};

// Hanzo Improvement Proposals branding
export const hanzoBrand: BrandConfig = {
  name: 'Hanzo Improvement Proposals',
  shortName: 'HIPs',
  fullName: 'Hanzo Improvement Proposals',
  description: 'Standards and protocols for Hanzo AI infrastructure',

  baseUrl: 'https://hips.hanzo.ai',
  githubRepo: 'https://github.com/hanzoai/hips',
  forumUrl: 'https://forum.hanzo.ai',
  docsUrl: 'https://docs.hanzo.ai',

  proposalPrefix: 'HIP',
  proposalName: 'Hanzo Improvement Proposal',

  categories: [
    {
      name: 'AI Infrastructure',
      shortDesc: 'AI/ML infrastructure',
      description: 'Specifications for AI model serving and inference.',
      range: [0, 99],
      icon: 'brain',
      color: 'blue',
      learnMore: 'AI infrastructure HIPs define model deployment standards.',
      keyTopics: ['Model serving', 'Inference', 'Scaling'],
    },
    {
      name: 'MCP',
      shortDesc: 'Model Context Protocol',
      description: 'Model Context Protocol specifications and extensions.',
      range: [100, 199],
      icon: 'network',
      color: 'purple',
      learnMore: 'MCP enables seamless communication between AI models.',
      keyTopics: ['Context management', 'Tools', 'Resources'],
    },
    {
      name: 'Agents',
      shortDesc: 'Agent frameworks',
      description: 'Standards for AI agent orchestration and coordination.',
      range: [200, 299],
      icon: 'bot',
      color: 'emerald',
      learnMore: 'Agent HIPs define how autonomous AI systems interact.',
      keyTopics: ['Orchestration', 'Memory', 'Planning'],
    },
  ],
};

// Zoo Improvement Proposals branding
export const zooBrand: BrandConfig = {
  name: 'Zoo Improvement Proposals',
  shortName: 'ZIPs',
  fullName: 'Zoo Improvement Proposals',
  description: 'Standards for decentralized AI research and governance',

  baseUrl: 'https://zips.zoo.ngo',
  githubRepo: 'https://github.com/zoolabs/zips',
  forumUrl: 'https://forum.zoo.ngo',
  docsUrl: 'https://docs.zoo.ngo',

  proposalPrefix: 'ZIP',
  proposalName: 'Zoo Improvement Proposal',

  categories: [
    {
      name: 'DeAI',
      shortDesc: 'Decentralized AI',
      description: 'Decentralized AI research and experimentation standards.',
      range: [0, 99],
      icon: 'network',
      color: 'blue',
      learnMore: 'DeAI ZIPs enable distributed AI research coordination.',
      keyTopics: ['Distributed training', 'Federated learning', 'Model sharing'],
    },
    {
      name: 'DeSci',
      shortDesc: 'Decentralized Science',
      description: 'Decentralized science research and publishing standards.',
      range: [100, 199],
      icon: 'flask',
      color: 'purple',
      learnMore: 'DeSci ZIPs define open science protocols and incentives.',
      keyTopics: ['Open access', 'Peer review', 'Research funding'],
    },
    {
      name: 'Governance',
      shortDesc: 'Community governance',
      description: 'Community governance and coordination mechanisms.',
      range: [200, 299],
      icon: 'vote',
      color: 'emerald',
      learnMore: 'Governance ZIPs define how the Zoo community operates.',
      keyTopics: ['Voting', 'Proposals', 'Treasury'],
    },
  ],
};
