import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Lux DeFi - Redirecting to Lux Network',
  description: 'Lux DeFi has been merged with Lux Network. Redirecting...',
};

export default function RedirectPage() {
  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center text-white">
      <div className="text-center max-w-md mx-auto px-6">
        <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" className="w-20 h-20 mx-auto mb-6 text-white">
          <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="2" />
          <text
            x="50"
            y="58"
            textAnchor="middle"
            fill="currentColor"
            fontSize="32"
            fontWeight="bold"
            fontFamily="system-ui, sans-serif"
          >
            LUX
          </text>
        </svg>

        <h1 className="text-3xl font-bold mb-4">Lux DeFi</h1>
        <p className="text-gray-400 mb-8">
          Lux DeFi has been consolidated into the main Lux Network organization.
        </p>

        <a
          href="https://luxfi.github.io"
          className="inline-flex items-center gap-2 px-6 py-3 bg-white text-black font-semibold rounded-lg hover:bg-gray-200 transition-colors"
        >
          Go to Lux Network
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14" />
            <path d="m12 5 7 7-7 7" />
          </svg>
        </a>

        <p className="text-sm text-gray-500 mt-8">
          You will be redirected automatically in a few seconds.
        </p>
      </div>
    </div>
  );
}
