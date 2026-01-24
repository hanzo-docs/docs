import { OramaCloud } from '@orama/core';

export const DataSourceId = process.env.NEXT_PUBLIC_ORAMA_DATASOURCE_ID as string;

export const isAdmin = process.env.ORAMA_PRIVATE_API_KEY !== undefined;

// Lazy-initialize the client to avoid SSR issues with localStorage
let _orama: OramaCloud | null = null;

export function getOrama(): OramaCloud {
  if (!_orama) {
    _orama = new OramaCloud({
      projectId: process.env.NEXT_PUBLIC_ORAMA_PROJECT_ID as string,
      apiKey: process.env.ORAMA_PRIVATE_API_KEY ?? (process.env.NEXT_PUBLIC_ORAMA_API_KEY as string),
    });
  }
  return _orama;
}

// For backwards compatibility - only safe to use on client side
export const orama = typeof window !== 'undefined'
  ? new OramaCloud({
      projectId: process.env.NEXT_PUBLIC_ORAMA_PROJECT_ID as string,
      apiKey: process.env.ORAMA_PRIVATE_API_KEY ?? (process.env.NEXT_PUBLIC_ORAMA_API_KEY as string),
    })
  : (null as unknown as OramaCloud);
