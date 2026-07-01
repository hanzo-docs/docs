import { ImageResponse } from 'next/og';
import type { ReactNode } from 'react';
import type { ImageResponseOptions } from 'next/dist/compiled/@vercel/og/types';

interface GenerateProps {
  title: ReactNode;
  description?: ReactNode;
  icon?: ReactNode;
  primaryColor?: string;
  primaryTextColor?: string;
  site?: ReactNode;
}

export function generateOGImage(options: GenerateProps & ImageResponseOptions): ImageResponse {
  const { title, description, icon, site, primaryColor, primaryTextColor, ...rest } = options;

  return new ImageResponse(
    generate({
      title,
      description,
      icon,
      site,
      primaryTextColor,
      primaryColor,
    }),
    {
      width: 1200,
      height: 630,
      ...rest,
    },
  );
}

// Canonical Hanzo block-H mark (white), used as the default og icon.
function BrandMark() {
  return (
    <svg width="56" height="56" viewBox="0 0 67 67" fill="#fff">
      <path d="M22.21 67V44.6369H0V67H22.21Z" />
      <path d="M66.7038 22.3184H22.2534L0.0878906 44.6367H44.4634L66.7038 22.3184Z" />
      <path d="M22.21 0H0V22.3184H22.21V0Z" />
      <path d="M66.7198 0H44.5098V22.3184H66.7198V0Z" />
      <path d="M66.7198 67V44.6369H44.5098V67H66.7198Z" />
    </svg>
  );
}

export function generate({
  // Monochrome by default (white accent). Per-brand docs sites pass their own
  // accent (e.g. Zoo's prism green) — Hanzo & Lux stay monochrome.
  primaryColor = '#FFFFFF',
  primaryTextColor = 'rgba(255,255,255,0.7)',
  ...props
}: GenerateProps) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        width: '100%',
        height: '100%',
        color: 'white',
        padding: '88px',
        backgroundColor: '#0A0A0A',
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {props.icon ?? <BrandMark />}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <p style={{ fontWeight: 800, fontSize: '80px', letterSpacing: '-2px', margin: 0 }}>
          {props.title}
        </p>
        <p style={{ fontSize: '30px', color: 'rgba(255,255,255,0.6)', margin: '12px 0 0' }}>
          {props.description}
        </p>
      </div>

      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          fontSize: '24px',
          color: primaryTextColor,
        }}
      >
        <p style={{ margin: 0 }}>{props.site}</p>
      </div>
    </div>
  );
}
