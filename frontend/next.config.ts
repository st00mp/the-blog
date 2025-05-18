import { NextConfig } from "next";

// Validation des variables d'environnement requises
const requiredEnvVars = [
  'BACKEND_API_URL',
  'NEXT_PUBLIC_BACKEND_API_URL'
];

const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);

if (missingVars.length > 0) {
  throw new Error(
    `❌ Variables d'environnement manquantes : ${missingVars.join(', ')}\n` +
    '→ Créez un fichier `.env.local` à la racine du frontend avec les variables requises :\n' +
    'BACKEND_API_URL=http://nginx:80\n' +
    'NEXT_PUBLIC_BACKEND_API_URL=http://localhost:8082'
  );
}

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Variables d'environnement exposées au build
  env: {
    BACKEND_API_URL: process.env.BACKEND_API_URL,
    NEXT_PUBLIC_BACKEND_API_URL: process.env.NEXT_PUBLIC_BACKEND_API_URL,
  },
  // Configuration des rewrites pour le proxy API
  async rewrites() {
    return {
      beforeFiles: [],
      afterFiles: [],
      fallback: [
        {
          source: '/api/:path*',
          destination: `${process.env.BACKEND_API_URL}/api/:path*`,
        },
      ],
    };
  },
  // Configuration des en-têtes de sécurité
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'X-Requested-With', value: 'XMLHttpRequest' },
        ],
      },
    ];
  },
};

export default nextConfig;
