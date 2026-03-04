'use client';

import { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import ProductCard from './ProductCard';
import type { Producto } from '@/lib/productos';

const categorias = [
  { id: 'todos', nombre: 'Todos', icono: '🥩' },
  { id: 'premium', nombre: 'Premium', icono: '⭐' },
  { id: 'tradicional', nombre: 'Tradicionales', icono: '🔥' },
  { id: 'combo', nombre: 'Combos', icono: '👨‍👩‍👧‍👦' },
  { id: 'especial', nombre: 'Especiales', icono: '👑' },
  { id: 'especialidad', nombre: 'Especialidades', icono: '🎯' },
];

export default function TiendaClient({ productos }: { productos: Producto[] }) {
  const searchParams = useSearchParams();
  const [activeCategory, setActiveCategory] = useState('todos');
  const [sortBy, setSortBy] = useState('default');

  useEffect(() => {
    const cat = searchParams.get('cat');
    if (cat) setActiveCategory(cat);
  }, [searchParams]);

  const filteredProductos = useMemo(() => {
    const filtered = activeCategory === 'todos'
      ? productos
      : productos.filter(p => p.categoria === activeCategory);

    switch (sortBy) {
      case 'price-asc': return [...filtered].sort((a, b) => a.precio - b.precio);
      case 'price-desc': return [...filtered].sort((a, b) => b.precio - a.precio);
      case 'name': return [...filtered].sort((a, b) => a.nombre.localeCompare(b.nombre));
      default: return filtered;
    }
  }, [productos, activeCategory, sortBy]);

  return (
    <>
      {/* Filtros sticky */}
      <section className="sticky top-[72px] z-30 bg-white border-b border-gray-100 shadow-premium-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 py-4 overflow-x-auto scrollbar-hide">
            {categorias.map(cat => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-medium text-sm whitespace-nowrap transition-all duration-300 border ${
                  activeCategory === cat.id
                    ? 'bg-brand-red text-white border-brand-red'
                    : 'bg-white text-gray-600 border-gray-200 hover:border-brand-red'
                }`}
              >
                <span>{cat.icono}</span>
                <span>{cat.nombre}</span>
              </button>
            ))}

            <div className="w-px h-8 bg-gray-200 mx-2 flex-shrink-0" />

            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value)}
              className="px-4 py-2.5 rounded-full border border-gray-200 text-sm text-gray-600 bg-white focus:outline-none focus:border-brand-red cursor-pointer"
            >
              <option value="default">Ordenar por</option>
              <option value="price-asc">Precio: Menor a Mayor</option>
              <option value="price-desc">Precio: Mayor a Menor</option>
              <option value="name">Nombre A-Z</option>
            </select>
          </div>
        </div>
      </section>

      {/* Grid de productos */}
      <section className="py-12 bg-cream min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <p className="text-gray-500 text-sm">
              Mostrando <span className="font-semibold text-gray-900">{filteredProductos.length}</span> productos
            </p>
          </div>

          {filteredProductos.length === 0 ? (
            <div className="text-center py-16">
              <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <p className="text-gray-500 font-medium">No se encontraron productos en esta categoría</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProductos.map(producto => (
                <ProductCard key={producto.id} {...producto} />
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
