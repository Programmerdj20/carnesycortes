/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '/dpvmazymp/**',
      },
    ],
  },

  // Redirects 301 de los slugs viejos (con emoji y sin limpiar) hacia los
  // nuevos slugs legibles, para no romper enlaces ya compartidos por WhatsApp.
  // Generados a partir de src/content/../scratchpad/backup-woo-*.json — ver
  // scripts/migrar-catalogo.mjs para la tabla completa de reasignación.
  async redirects() {
    return [
      { source: '/producto/chata-premium', destination: '/producto/chata', permanent: true },
      { source: '/producto/🥩-lomo-de-aguja-premium', destination: '/producto/lomo-de-aguja', permanent: true },
      { source: '/producto/🥩-cola-de-cuadril-premium', destination: '/producto/cola-de-cuadril', permanent: true },
      { source: '/producto/🥩-tomahawk-mamut', destination: '/producto/tomahawk', permanent: true },
      { source: '/producto/🥩-rib-eye', destination: '/producto/rib-eye', permanent: true },
      { source: '/producto/🥩-osobuco', destination: '/producto/osobuco', permanent: true },
      { source: '/producto/🐖-punta-de-anca-de-cerdo', destination: '/producto/punta-de-anca-de-cerdo', permanent: true },
      { source: '/producto/🐖-tomahawk-de-cerdo', destination: '/producto/tomahawk-de-cerdo', permanent: true },
      { source: '/producto/🐖-chuleta-de-cerdo-premium', destination: '/producto/chuleta-de-cerdo', permanent: true },
      { source: '/producto/🐖-solomito-de-cerdo', destination: '/producto/solomito-de-cerdo', permanent: true },
      { source: '/producto/🥩-solomo-extranjero', destination: '/producto/solomo-extranjero', permanent: true },
      { source: '/producto/🥩-tabla', destination: '/producto/tabla', permanent: true },
      { source: '/producto/🥩-huevo-de-aldana', destination: '/producto/huevo-de-aldana', permanent: true },
      { source: '/producto/🥩-paletero', destination: '/producto/paletero', permanent: true },
      { source: '/producto/🥩-huevo-de-solomo', destination: '/producto/huevo-de-solomo', permanent: true },
      { source: '/producto/🥩-posta', destination: '/producto/posta', permanent: true },
      { source: '/producto/🥩-muchacho', destination: '/producto/muchacho', permanent: true },
      { source: '/producto/🥩-sobrebarriga', destination: '/producto/sobrebarriga', permanent: true },
      { source: '/producto/🥩-copete', destination: '/producto/copete', permanent: true },
      { source: '/producto/🥩-morrillo', destination: '/producto/morrillo', permanent: true },
      { source: '/producto/🥩-tres-telas', destination: '/producto/tres-telas', permanent: true },
    ];
  },
};

export default nextConfig;
