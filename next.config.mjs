/** @type {import('next').NextConfig} */
const nextConfig = {
  poweredByHeader: false,
  allowedDevOrigins: [
    "192.168.1.7",
    "192.168.1.4",
    "localhost",
  ],
  compiler: {
    removeConsole: process.env.NODE_ENV === "production" ? { exclude: ["error", "warn"] } : false,
  },
  experimental: {
    optimizePackageImports: ["lucide-react", "react-icons"],
  },
  async rewrites() {
    // NOTE (test deployment): default to the Railway TEST backend so the test
    // dashboard never talks to production. A real API_PROXY_TARGET still wins.
    // Revert to "https://aqid.subcodeco.com/api" before shipping to production.
    const apiTarget =
      process.env.API_PROXY_TARGET ||
      "https://aqdi-new-backend-main-production.up.railway.app/api";

    return [
      {
        source: "/api/:path*",
        destination: `${apiTarget}/:path*`,
      },
    ];
  },
  async headers() {
    return [
      {
        // Header-only hardening: safe behind Apache/cPanel Passenger (server.js),
        // no script-src CSP so framework inline scripts and Firebase keep working.
        source: "/:path*",
        headers: [
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Content-Security-Policy", value: "frame-ancestors 'self'" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=()" },
          {
            // Report-only: never blocks. Flip to "Content-Security-Policy" to enforce after testing.
            key: "Content-Security-Policy-Report-Only",
            value: [
              "default-src 'self'",
              "base-uri 'self'",
              "frame-ancestors 'self'",
              "img-src 'self' data: blob: https:",
              "font-src 'self' data: https://fonts.gstatic.com",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.gstatic.com",
              "connect-src 'self' https: wss:",
            ].join("; "),
          },
        ],
      },
      {
        source: "/firebase-messaging-sw.js",
        headers: [
          { key: "Cache-Control", value: "no-cache, no-store, must-revalidate" },
          { key: "Service-Worker-Allowed", value: "/" },
        ],
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "aqid.subcodeco.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "aqdi-new-backend-main-production.up.railway.app",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "b3app.co",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
