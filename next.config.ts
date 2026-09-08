import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // The legacy TanStack build lives in ./legacy and must never be compiled.
  outputFileTracingExcludes: { "*": ["./legacy/**"] },
};

export default nextConfig;
