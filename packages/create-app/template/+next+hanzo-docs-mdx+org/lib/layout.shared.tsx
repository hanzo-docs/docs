import config from '@/docs.config';
import { createOrgLayout } from '@hanzo/docs-org/layout';

const { baseOptions, createMetadata, linkItems, logo } = createOrgLayout(config);

export { baseOptions, createMetadata, linkItems, logo };
