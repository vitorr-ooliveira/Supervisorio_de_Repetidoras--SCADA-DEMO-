import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  basePath: '/Supervisorio_de_Repetidoras--SCADA-DEMO-',
  /* config options here */
};

export default nextConfig;
