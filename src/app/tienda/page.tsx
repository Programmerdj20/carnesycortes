import { Suspense } from 'react';
import { getProductos } from '@/lib/productos';
import Breadcrumb from '@/components/Breadcrumb';
import TiendaClient from '@/components/TiendaClient';

export const metadata = {
  title: 'Tienda - Carnes & Cortes',
  description: 'Explora nuestra selección completa de cortes premium y especialidades',
};

export default function TiendaPage() {
  const productos = getProductos();

  return (
    <>
      {/* Hero compacto */}
      <section className="bg-dark-900 pt-28 pb-12 relative overflow-hidden">
        <div className="absolute inset-0 opacity-30">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://images.unsplash.com/photo-1544025162-d76694265947?w=1600&q=60"
            alt=""
            className="w-full h-full object-cover"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-dark-900/80 to-dark-900" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumb items={[{ label: 'Inicio', href: '/' }, { label: 'Tienda' }]} />
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-white mt-4">Nuestra Tienda</h1>
          <p className="text-gray-400 mt-2 max-w-lg">Explora nuestra selección completa de cortes premium y especialidades</p>
        </div>
      </section>

      <Suspense fallback={null}>
        <TiendaClient productos={productos} />
      </Suspense>
    </>
  );
}
