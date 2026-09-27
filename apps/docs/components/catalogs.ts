'use client';

import dynamic from 'next/dynamic';

/**
 * The live catalogs — models, connectors, installs — as client islands. Each
 * fetches its data in the browser, so none holds up the page it sits in.
 */
export const ModelsCatalog = dynamic(() => import('@/components/models-catalog').then((m) => m.ModelsCatalog));
export const ConnectorsCatalog = dynamic(() => import('@/components/connectors-catalog').then((m) => m.ConnectorsCatalog));
export const InstallCatalog = dynamic(() => import('@/components/install-catalog').then((m) => m.InstallCatalog));
