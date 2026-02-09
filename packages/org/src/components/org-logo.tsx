import type { ReactNode } from 'react';
import type { OrgConfig } from '../types';

interface OrgLogoProps {
  org: OrgConfig;
  className?: string;
}

/**
 * Renders the org logo. If the logo is a string (icon name), renders text.
 * If it's a ReactNode, renders it directly.
 */
export function OrgLogo({ org, className }: OrgLogoProps): ReactNode {
  if (typeof org.logo === 'string') {
    return <span className={className}>{org.logo}</span>;
  }
  return org.logo;
}
