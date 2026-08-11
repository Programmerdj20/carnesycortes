import { Suspense } from 'react';
import { getProductos } from '@/lib/productos';
import Breadcrumb from '@/components/Breadcrumb';
import TiendaClient from '@/components/TiendaClient';

export const metadata = {
  title: 'Tienda - Carnes & Cortes',
  description: 'Explora nuestra selección completa de cortes premium y especialidades',
};

export default async function TiendaPage() {
  const productos = await getProductos();

  return (
    <>
      {/* Hero compacto */}
      <section className="bg-dark-900 pt-28 pb-12 relative overflow-hidden">
        {/* Textura de marca en vez de foto stock */}
        <div
          className="absolute inset-0 opacity-[0.05]"
          style={{ backgroundImage: 'radial-gradient(circle, #D4A84B 1px, transparent 1px)', backgroundSize: '28px 28px' }}
        />
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-b from-dark-900/40 via-dark-900/70 to-dark-900" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumb items={[{ label: 'Inicio', href: '/' }, { label: 'Tienda' }]} />
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-white mt-4">Nuestra Tienda</h1>
          <p className="text-gray-400 mt-2 max-w-lg">Cortes de res y cerdo seleccionados — de lo premium a lo clásico</p>
        </div>
      </section>

      <Suspense fallback={null}>
        <TiendaClient productos={productos} />
      </Suspense>
    </>
  );
}
