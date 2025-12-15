'use client';

import { createContext, useContext, useState, type ReactNode } from 'react';
import type { BrandConfig, BrandContextValue, BrandId } from './types';
import { hanzoBrand } from './brands/hanzo';
import { luxBrand } from './brands/lux';
import { zooBrand } from './brands/zoo';

/**
 * Map of all available brand configurations
 */
export const brands: Record<BrandId, BrandConfig> = {
  hanzo: hanzoBrand,
  lux: luxBrand,
  zoo: zooBrand,
};

/**
 * Get brand configuration by ID
 */
export function getBrand(id: BrandId): BrandConfig {
  return brands[id] ?? hanzoBrand;
}

/**
 * Get brand ID from environment variable
 */
export function getBrandFromEnv(): BrandId {
  const envBrand = process.env.NEXT_PUBLIC_BRAND as BrandId | undefined;
  if (envBrand && envBrand in brands) {
    return envBrand;
  }
  return 'hanzo';
}

/**
 * Brand context
 */
const BrandContext = createContext<BrandContextValue | null>(null);

/**
 * Brand context provider props
 */
export interface BrandProviderProps {
  /** Initial brand configuration or ID */
  brand?: BrandConfig | BrandId;
  /** Child components */
  children: ReactNode;
}

/**
 * Brand context provider component
 */
export function BrandProvider({ brand: initialBrand, children }: BrandProviderProps) {
  const defaultBrand = typeof initialBrand === 'string' 
    ? getBrand(initialBrand) 
    : initialBrand ?? getBrand(getBrandFromEnv());
  
  const [brand, setBrand] = useState<BrandConfig>(defaultBrand);

  return (
    <BrandContext.Provider value={{ brand, setBrand }}>
      {children}
    </BrandContext.Provider>
  );
}

/**
 * Hook to access brand configuration
 */
export function useBrand(): BrandConfig {
  const context = useContext(BrandContext);
  if (!context) {
    // Return default brand if used outside provider
    return getBrand(getBrandFromEnv());
  }
  return context.brand;
}

/**
 * Hook to access brand context with setter
 */
export function useBrandContext(): BrandContextValue {
  const context = useContext(BrandContext);
  if (!context) {
    throw new Error('useBrandContext must be used within a BrandProvider');
  }
  return context;
}
