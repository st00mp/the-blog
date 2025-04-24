import { NextConfig } from "next";

// Vérification de la présence de BACKEND_API_URL
if (!process.env.BACKEND_API_URL) {
  throw new Error(
    "❌ La variable BACKEND_API_URL est manquante.\n→ Crée un fichier `.env.local` à la racine de ton frontend avec :\nBACKEND_API_URL=http://nginx:80"
  );
}

const nextConfig: NextConfig = {
  reactStrictMode: true,
  env: {
    BACKEND_API_URL: process.env.BACKEND_API_URL,
    NEXT_PUBLIC_BACKEND_API_URL: process.env.NEXT_PUBLIC_BACKEND_API_URL,
  },
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${process.env.BACKEND_API_URL}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;


// import { NextConfig } from "next";

// const nextConfig: NextConfig = {
//   reactStrictMode: true,
//   env: {
//     BACKEND_API_URL: process.env.BACKEND_API_URL,
//   },
//   async rewrites() {
//     return [
//       {
//         source: "/api/:path*",
//         destination: `${process.env.BACKEND_API_URL}/api/:path*`,
//       },
//     ];
//   },
// };

// export default nextConfig;
