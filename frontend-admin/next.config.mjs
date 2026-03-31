/** @type {import('next').NextConfig} */
const nextConfig = {
  // Use this only on VM with nginx
  basePath: "/admin",
  trailingSlash: true,
  // ----------------------
  experimental: {
    typedRoutes: false,
  },
};

export default nextConfig;
