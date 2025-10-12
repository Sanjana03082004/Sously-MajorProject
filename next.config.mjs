// /** @type {import('next').NextConfig} */
// const nextConfig = {
//   output: 'export',            // ✅ Required for next export to work
//   distDir: 'out',              // ✅ Matches with capacitor.config.ts webDir
//   eslint: {
//     ignoreDuringBuilds: true,
//   },
//   typescript: {
//     ignoreBuildErrors: true,
//   },
//   images: {
//     unoptimized: true,
//   },
// };


// export default nextConfig;

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {},
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
