import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Try the most basic toggle available for your version
  devIndicators: false as any,

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "nakoybvelouefamdlfja.supabase.co",
        port: "",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
};

export default nextConfig;
