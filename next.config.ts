import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* Security hardening configuration */

  // Disable powered by header to reduce information disclosure
  poweredByHeader: false,

  // Enable strict mode for better React practices
  reactStrictMode: true,

  // Configure security headers
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()',
          },
        ],
      },
    ];
  },

  // Ensure experimental features are explicitly controlled
  experimental: {
    // Only enable if needed and with explicit understanding
    // reactCompiler: false, // Keep disabled unless required
    // serverActions: true, // Required for Server Actions
  },
};

export default nextConfig;
