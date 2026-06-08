import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    // Pin the workspace root to this project. Without this, Next walks up the
    // tree and mistakes a stray lockfile in the home directory for the root.
    root: import.meta.dirname,
  },
};

export default nextConfig;
