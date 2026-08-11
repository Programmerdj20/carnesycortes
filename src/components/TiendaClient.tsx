'use client';

import { useState, useMemo, useEffect, useCallback } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { Search, MessageCircle } from 'lucide-react';
import ProductCard from './ProductCard';
import type { Producto } from '@/lib/productos';
import {
  CATEGORIAS,
  ANIMALES,
  type AnimalId,
  type CategoriaId,
  getCategoria,
  esCategoriaValida,
} from '@/lib/categorias';
import { whatsappLink } from '@/lib/contacto';

type AnimalFiltro = AnimalId | 'todos';
type CategoriaFiltro = CategoriaId | 'todos';

export default function TiendaClient({ productos }: { productos: Producto[] }) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const [animal, setAnimal] = useState<AnimalFiltro>('todos');
  const [categoria, setCategoria] = useState<CategoriaFiltro>('todos');
  const [sortBy, setSortBy] = useState('default');

  // La URL es la fuente de verdad del filtro activo: se lee al montar y cada
  // vez que cambia externamente (botón atrás/adelante, enlace compartido).
  useEffect(() => {
    const animalParam = searchParams.get('animal');
    const catParam = searchParams.get('cat');
    setAnimal(animalParam === 'res' || animalParam === 'cerdo' ? animalParam : 'todos');
    setCategoria(catParam && esCategoriaValida(catParam) ? catParam : 'todos');
  }, [searchParams]);

  const updateURL = useCallback((nextAnimal: AnimalFiltro, nextCategoria: CategoriaFiltro) => {
    const params = new URLSearchParams();
    if (nextAnimal !== 'todos') params.set('animal', nextAnimal);
    if (nextCategoria !== 'todos') params.set('cat', nextCategoria);
    const qs = params.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  }, [router, pathname]);

  const handleAnimal = (a: AnimalFiltro) => {
    // Si la categoría activa no pertenece al nuevo animal, se limpia el filtro de corte.
    let nextCategoria = categoria;
    if (categoria !== 'todos' && a !== 'todos') {
      const cat = getCategoria(categoria);
      if (cat && cat.animal !== null && cat.animal !== a) nextCategoria = 'todos';
    }
    setAnimal(a);
    setCategoria(nextCategoria);
    updateURL(a, nextCategoria);
  };

  const handleCategoria = (c: CategoriaFiltro) => {
    setCategoria(c);
    updateURL(animal, c);
  };

  // Conteo de productos por categoría, para mostrar en cada chip
  const counts = useMemo(() => {
    const m: Record<string, number> = {};
    for (const cat of CATEGORIAS) m[cat.id] = productos.filter(p => p.categoria === cat.id).length;
    return m;
  }, [productos]);

  const categoriaActiva = categoria !== 'todos' ? getCategoria(categoria) : undefined;
  const esProximamente = categoriaActiva?.proximamente ?? false;

  const filteredProductos = useMemo(() => {
    let list = productos;
    if (animal !== 'todos') {
      list = list.filter(p => getCategoria(p.categoria)?.animal === animal);
    }
    if (categoria !== 'todos') {
      list = list.filter(p => p.categoria === categoria);
    }
    switch (sortBy) {
      case 'name': return [...list].sort((a, b) => a.nombre.localeCompare(b.nombre));
      default: return list;
    }
  }, [productos, animal, categoria, sortBy]);

  const categoriasOrdenadas = [...CATEGORIAS].sort((a, b) => a.orden - b.orden);

  return (
    <>
      {/* ── Filtros sticky ── */}
      <section
        className="sticky z-30 pointer-events-none"
        style={{ top: 'var(--header-h, 96px)' }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-cream/95 backdrop-blur-sm pointer-events-auto py-4 space-y-3">
            {/* Eje 1: Animal */}
            <div role="group" aria-label="Filtrar por animal" className="flex items-center gap-2">
              <button
                onClick={() => handleAnimal('todos')}
                aria-pressed={animal === 'todos'}
                className={`px-5 py-2 rounded-full font-semibold text-sm transition-all duration-300 border cursor-pointer ${
                  animal === 'todos'
                    ? 'bg-dark-900 text-white border-dark-900'
                    : 'bg-white text-gray-600 border-gray-200 hover:border-dark-900'
                }`}
              >
                Todo
              </button>
              {ANIMALES.map(a => {
                const Icono = a.icono;
                return (
                  <button
                    key={a.id}
                    onClick={() => handleAnimal(a.id)}
                    aria-pressed={animal === a.id}
                    className={`flex items-center gap-2 px-5 py-2 rounded-full font-semibold text-sm transition-all duration-300 border cursor-pointer ${
                      animal === a.id
                        ? 'bg-dark-900 text-white border-dark-900'
                        : 'bg-white text-gray-600 border-gray-200 hover:border-dark-900'
                    }`}
                  >
                    <Icono size={16} strokeWidth={2} />
                    {a.nombre}
                  </button>
                );
              })}
            </div>

            {/* Eje 2: Tipo de corte */}
            <div role="group" aria-label="Filtrar por tipo de corte" className="flex items-center gap-2 overflow-x-auto scrollbar-hide">
              <button
                onClick={() => handleCategoria('todos')}
                aria-pressed={categoria === 'todos'}
                className={`px-4 py-2 rounded-full font-medium text-sm whitespace-nowrap transition-all duration-300 border cursor-pointer ${
                  categoria === 'todos'
                    ? 'bg-brand-red text-white border-brand-red'
                    : 'bg-white text-gray-600 border-gray-200 hover:border-brand-red'
                }`}
              >
                Todos los cortes
              </button>
              {categoriasOrdenadas.map(cat => {
                const Icono = cat.icono;
                const perteneceAlAnimal = animal === 'todos' || cat.animal === null || cat.animal === animal;
                const nombre = animal === 'todos' ? cat.nombreLargo : cat.nombre;
                return (
                  <button
                    key={cat.id}
                    onClick={() => perteneceAlAnimal && handleCategoria(cat.id)}
                    disabled={!perteneceAlAnimal}
                    aria-pressed={categoria === cat.id}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full font-medium text-sm whitespace-nowrap transition-all duration-300 border ${
                      !perteneceAlAnimal
                        ? 'bg-white text-gray-300 border-gray-100 cursor-not-allowed opacity-50'
                        : categoria === cat.id
                        ? 'bg-brand-red text-white border-brand-red cursor-pointer'
                        : 'bg-white text-gray-600 border-gray-200 hover:border-brand-red cursor-pointer'
                    }`}
                  >
                    <Icono size={15} strokeWidth={2} />
                    {nombre}
                    {!cat.proximamente && (
                      <span className={`text-xs ${categoria === cat.id ? 'text-white/70' : 'text-gray-400'}`}>
                        {counts[cat.id]}
                      </span>
                    )}
                  </button>
                );
              })}

              <div className="w-px h-8 bg-gray-200 mx-1 flex-shrink-0" />

              <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value)}
                className="px-4 py-2 rounded-full border border-gray-200 text-sm text-gray-600 bg-white focus:outline-none focus:border-brand-red cursor-pointer flex-shrink-0"
              >
                <option value="default">Ordenar por</option>
                <option value="name">Nombre A-Z</option>
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* ── Grid de productos ── */}
      <section className="py-12 bg-cream min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {!esProximamente && (
            <div className="flex items-center justify-between mb-8">
              <p className="text-gray-500 text-sm" aria-live="polite">
                Mostrando <span className="font-semibold text-gray-900">{filteredProductos.length}</span> productos
              </p>
            </div>
          )}

          {esProximamente ? (
            <div className="text-center py-20 max-w-md mx-auto">
              <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-dark-900 flex items-center justify-center">
                {categoriaActiva && <categoriaActiva.icono className="w-8 h-8 text-gold" strokeWidth={1.5} />}
              </div>
              <h2 className="font-display text-2xl font-bold text-gray-900 mb-2">Combos — Muy pronto</h2>
              <p className="text-gray-500 text-sm leading-relaxed mb-6">
                Estamos armando combos especiales para compartir. Mientras tanto, escríbenos y armamos uno a tu medida.
              </p>
              <a
                href={whatsappLink('Hola, quiero armar un combo a la medida')}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-brand-red text-white px-6 py-3 rounded-full font-semibold text-sm hover:bg-brand-red-dark transition-all duration-300 hover:shadow-red-glow"
              >
                <MessageCircle size={16} />
                Armar combo por WhatsApp
              </a>
            </div>
          ) : filteredProductos.length === 0 ? (
            <div className="text-center py-16">
              <Search className="w-14 h-14 mx-auto mb-4 text-gray-300" strokeWidth={1.5} />
              <p className="text-gray-500 font-medium">No se encontraron productos con este filtro</p>
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
