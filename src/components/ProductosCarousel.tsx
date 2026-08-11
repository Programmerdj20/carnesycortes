'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { useCart } from '@/contexts/CartContext';
import type { Producto } from '@/lib/productos';
import { badgeClase, nombreCategoria } from '@/lib/categorias';
import { UNIDAD_CORTA, MIN_LB } from '@/lib/unidades';

interface ProductosCarouselProps {
  productos: Producto[];
  total?: number; // cuántos mostrar (default 12)
}

function shufflePick<T>(arr: T[], n: number): T[] {
  return [...arr].sort(() => Math.random() - 0.5).slice(0, n);
}

function CarouselCard({ producto }: { producto: Producto }) {
  const { addItem, showNotification } = useCart();
  const badgeClass = badgeClase(producto.categoria);

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    addItem({ id: producto.id, nombre: producto.nombre, imagen: producto.imagen, peso: producto.peso, slug: producto.slug }, MIN_LB);
    showNotification(`${producto.nombre} agregado al carrito`);
  };

  return (
    <article className="group bg-white rounded-2xl overflow-hidden shadow-premium-sm hover:shadow-premium-lg transition-all duration-500 hover:-translate-y-2 border border-gray-100 flex flex-col">
      <Link href={`/producto/${producto.slug}`} className="block">
        <div className="relative overflow-hidden aspect-[4/3]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={producto.imagen}
            alt={producto.nombre}
            loading="lazy"
            decoding="async"
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <span className={`absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${badgeClass}`}>
            {nombreCategoria(producto.categoria)}
          </span>
          {producto.destacado && (
            <span className="absolute top-4 right-4 bg-brand-red text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              Destacado
            </span>
          )}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
            <span className="bg-white text-dark-900 px-6 py-2.5 rounded-full font-semibold text-sm shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
              Ver Detalles
            </span>
          </div>
        </div>
      </Link>
      <div className="p-5 flex flex-col flex-1">
        <Link href={`/producto/${producto.slug}`} className="block">
          <h3 className="text-lg font-bold text-gray-900 mb-1 group-hover:text-brand-red transition-colors line-clamp-1">{producto.nombre}</h3>
        </Link>
        <p className="text-gray-500 text-sm mb-3 line-clamp-2 flex-1">{producto.descripcion}</p>
        <div className="flex items-center justify-between">
          <span className="text-gray-400 text-xs">{UNIDAD_CORTA}</span>
          <button
            onClick={handleAdd}
            className="flex items-center gap-1.5 bg-brand-red text-white px-4 py-2 rounded-full text-sm font-semibold hover:bg-brand-red-dark transition-all duration-300 hover:shadow-red-glow"
          >
            <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Agregar
          </button>
        </div>
      </div>
    </article>
  );
}

// Skeleton placeholder mientras carga el shuffle
function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-gray-100">
      <div className="aspect-[4/3] bg-gray-100 animate-pulse" />
      <div className="p-5 space-y-3">
        <div className="h-5 bg-gray-100 rounded animate-pulse w-3/4" />
        <div className="h-4 bg-gray-100 rounded animate-pulse w-full" />
        <div className="h-4 bg-gray-100 rounded animate-pulse w-2/3" />
        <div className="flex justify-between items-center pt-1">
          <div className="h-7 bg-gray-100 rounded animate-pulse w-1/3" />
          <div className="h-9 bg-gray-100 rounded-full animate-pulse w-24" />
        </div>
      </div>
    </div>
  );
}

export default function ProductosCarousel({ productos, total = 12 }: ProductosCarouselProps) {
  const [items, setItems] = useState<Producto[]>([]);
  const [slide, setSlide] = useState(0);
  const [perView, setPerView] = useState(4);
  const [paused, setPaused] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const touchStartX = useRef(0);
  const touchStartY = useRef(0);

  // Shuffle client-side en mount para que cada visita sea diferente
  useEffect(() => {
    setItems(shufflePick(productos, Math.min(total, productos.length)));
    setIsReady(true);
  }, [productos, total]);

  // Breakpoints responsivos
  useEffect(() => {
    function calc() {
      const w = window.innerWidth;
      if (w < 640) setPerView(1);
      else if (w < 768) setPerView(2);
      else if (w < 1024) setPerView(3);
      else setPerView(4);
    }
    calc();
    window.addEventListener('resize', calc);
    return () => window.removeEventListener('resize', calc);
  }, []);

  const pages = Math.max(1, Math.ceil(items.length / perView));

  // Ajustar slide al cambiar perView para no quedar fuera de rango
  useEffect(() => {
    setSlide(s => Math.min(s, pages - 1));
  }, [pages]);

  const goTo = useCallback((idx: number) => {
    setSlide(((idx % pages) + pages) % pages);
  }, [pages]);

  const next = useCallback(() => goTo(slide + 1), [goTo, slide]);
  const prev = useCallback(() => goTo(slide - 1), [goTo, slide]);

  // Auto-play
  useEffect(() => {
    if (paused || !isReady || pages <= 1) return;
    const t = setInterval(next, 4500);
    return () => clearInterval(t);
  }, [paused, isReady, pages, next]);

  // Touch handlers (evita conflicto con scroll vertical)
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  };
  const handleTouchEnd = (e: React.TouchEvent) => {
    const dx = touchStartX.current - e.changedTouches[0].clientX;
    const dy = touchStartY.current - e.changedTouches[0].clientY;
    // Solo navega si el swipe es más horizontal que vertical
    if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 40) {
      dx > 0 ? next() : prev();
    }
  };

  return (
    <div
      className="relative"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* ── Track ── */}
      <div
        className="overflow-hidden"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {!isReady ? (
          // Skeletons mientras se monta el cliente
          <div
            className="grid gap-6"
            style={{ gridTemplateColumns: `repeat(${perView}, minmax(0, 1fr))` }}
          >
            {Array.from({ length: perView }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : (
          <div
            className="flex transition-transform duration-500 ease-in-out"
            style={{ transform: `translateX(-${slide * 100}%)` }}
          >
            {Array.from({ length: pages }).map((_, pi) => {
              const pageItems = items.slice(pi * perView, (pi + 1) * perView);
              // Rellenar la última página si tiene menos de perView items
              const fillerCount = perView - pageItems.length;
              return (
                <div
                  key={pi}
                  className="min-w-full grid gap-6"
                  style={{ gridTemplateColumns: `repeat(${perView}, minmax(0, 1fr))` }}
                >
                  {pageItems.map(p => (
                    <CarouselCard key={p.id} producto={p} />
                  ))}
                  {/* Espaciadores transparentes para mantener el grid */}
                  {Array.from({ length: fillerCount }).map((_, fi) => (
                    <div key={`filler-${fi}`} aria-hidden="true" />
                  ))}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ── Botones Prev/Next ── */}
      {isReady && pages > 1 && (
        <>
          <button
            onClick={prev}
            aria-label="Anterior"
            className="absolute left-0 top-1/2 -translate-y-8 -translate-x-4 sm:-translate-x-5 z-10 bg-white shadow-lg rounded-full w-10 h-10 flex items-center justify-center text-gray-700 hover:bg-brand-red hover:text-white transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-red"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={next}
            aria-label="Siguiente"
            className="absolute right-0 top-1/2 -translate-y-8 translate-x-4 sm:translate-x-5 z-10 bg-white shadow-lg rounded-full w-10 h-10 flex items-center justify-center text-gray-700 hover:bg-brand-red hover:text-white transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-red"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </>
      )}

      {/* ── Dots ── */}
      {isReady && pages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-8" role="tablist" aria-label="Diapositivas del carrusel">
          {Array.from({ length: pages }).map((_, i) => (
            <button
              key={i}
              role="tab"
              aria-selected={i === slide}
              aria-label={`Página ${i + 1}`}
              onClick={() => goTo(i)}
              className={`rounded-full transition-all duration-300 ${
                i === slide
                  ? 'w-6 h-2 bg-brand-red'
                  : 'w-2 h-2 bg-gray-300 hover:bg-brand-red/50'
              }`}
            />
          ))}
        </div>
      )}

      {/* ── Contador ── */}
      {isReady && pages > 1 && (
        <p className="text-center text-xs text-gray-400 mt-3 tabular-nums">
          {slide + 1} / {pages}
        </p>
      )}
    </div>
  );
}
