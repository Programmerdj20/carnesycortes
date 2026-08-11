'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, ShoppingBag } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import type { Producto } from '@/lib/productos';
import { badgeClase, nombreCategoria, getCategoria } from '@/lib/categorias';
import { UNIDAD_CORTA, MIN_LB } from '@/lib/unidades';

interface CortesRelacionadosCarouselProps {
  productos: Producto[];
}

// Tarjeta oscura — misma estética que la sección "Otros cortes de esta categoría"
// (bg-dark-800), a diferencia de ProductCard/ProductosCarousel que son de tema claro.
function RelacionadoCard({ producto }: { producto: Producto }) {
  const { addItem, showNotification } = useCart();
  const Icono = getCategoria(producto.categoria)?.icono;

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    addItem(
      { id: producto.id, nombre: producto.nombre, imagen: producto.imagen, peso: producto.peso, slug: producto.slug },
      MIN_LB
    );
    showNotification(`${producto.nombre} agregado al carrito`);
  };

  return (
    <article className="group relative flex flex-col overflow-hidden rounded-2xl bg-dark-700 border border-white/[0.06] transition-all duration-500 hover:-translate-y-1 hover:border-brand-red/30 hover:shadow-[0_12px_40px_rgba(196,30,58,0.15)]">
      <Link href={`/producto/${producto.slug}`} className="block relative overflow-hidden aspect-[4/3] shrink-0">
        {producto.imagen ? (
          <Image
            src={producto.imagen}
            alt={producto.nombre}
            fill
            sizes="(min-width: 640px) 45vw, 90vw"
            className="object-cover transition-transform duration-700 group-hover:scale-[1.06]"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-dark-900 to-dark-800">
            {Icono && <Icono className="w-10 h-10 text-gold/40" strokeWidth={1.5} />}
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-dark-900/70 via-transparent to-transparent" />
        <span className={`absolute top-3 left-3 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${badgeClase(producto.categoria)}`}>
          {nombreCategoria(producto.categoria)}
        </span>
      </Link>

      <div className="flex-1 flex flex-col p-5">
        <Link href={`/producto/${producto.slug}`}>
          <h3 className="font-bold text-base mb-1 leading-snug line-clamp-1 text-white group-hover:text-brand-red transition-colors duration-300">
            {producto.nombre}
          </h3>
        </Link>
        <p className="text-white/60 text-xs leading-relaxed mb-4 line-clamp-2 flex-1">
          {producto.descripcion}
        </p>
        <div className="flex items-center justify-between gap-3 mt-auto pt-3 border-t border-white/[0.10]">
          <span className="text-xs font-semibold uppercase tracking-wider text-white/50">{UNIDAD_CORTA}</span>
          <button
            onClick={handleAdd}
            className="flex items-center gap-1.5 bg-brand-red border border-brand-red text-white px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider hover:bg-brand-red-dark hover:border-brand-red-dark transition-all duration-300"
          >
            <ShoppingBag size={14} />
            Agregar
          </button>
        </div>
      </div>
    </article>
  );
}

export default function CortesRelacionadosCarousel({ productos }: CortesRelacionadosCarouselProps) {
  const [slide, setSlide] = useState(0);
  const [perView, setPerView] = useState(2);
  const [paused, setPaused] = useState(false);
  const touchStartX = useRef(0);
  const touchStartY = useRef(0);

  // 1 tarjeta en móvil, 2 desde >=640px (avanza de 2 en 2 en escritorio)
  useEffect(() => {
    function calc() {
      setPerView(window.innerWidth < 640 ? 1 : 2);
    }
    calc();
    window.addEventListener('resize', calc);
    return () => window.removeEventListener('resize', calc);
  }, []);

  const pages = Math.max(1, Math.ceil(productos.length / perView));

  useEffect(() => {
    setSlide(s => Math.min(s, pages - 1));
  }, [pages]);

  const goTo = useCallback((idx: number) => {
    setSlide(((idx % pages) + pages) % pages);
  }, [pages]);

  const next = useCallback(() => goTo(slide + 1), [goTo, slide]);
  const prev = useCallback(() => goTo(slide - 1), [goTo, slide]);

  // Autoplay, con pausa en hover
  useEffect(() => {
    if (paused || pages <= 1) return;
    const t = setInterval(next, 4500);
    return () => clearInterval(t);
  }, [paused, pages, next]);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  };
  const handleTouchEnd = (e: React.TouchEvent) => {
    const dx = touchStartX.current - e.changedTouches[0].clientX;
    const dy = touchStartY.current - e.changedTouches[0].clientY;
    if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 40) {
      dx > 0 ? next() : prev();
    }
  };

  if (productos.length === 0) return null;

  return (
    <div
      className="relative"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="overflow-hidden" onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
        <div
          className="flex transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${slide * 100}%)` }}
        >
          {Array.from({ length: pages }).map((_, pi) => {
            const pageItems = productos.slice(pi * perView, (pi + 1) * perView);
            const fillerCount = perView - pageItems.length;
            return (
              <div
                key={pi}
                className="min-w-full grid gap-5"
                style={{ gridTemplateColumns: `repeat(${perView}, minmax(0, 1fr))` }}
              >
                {pageItems.map(p => (
                  <RelacionadoCard key={p.id} producto={p} />
                ))}
                {Array.from({ length: fillerCount }).map((_, fi) => (
                  <div key={`filler-${fi}`} aria-hidden="true" />
                ))}
              </div>
            );
          })}
        </div>
      </div>

      {pages > 1 && (
        <>
          <button
            onClick={prev}
            aria-label="Anterior"
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 sm:-translate-x-5 z-10 bg-dark-800 border border-white/10 shadow-premium-md rounded-full w-10 h-10 flex items-center justify-center text-white/60 hover:text-white hover:border-white/25 transition-all duration-300"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            onClick={next}
            aria-label="Siguiente"
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 sm:translate-x-5 z-10 bg-dark-800 border border-white/10 shadow-premium-md rounded-full w-10 h-10 flex items-center justify-center text-white/60 hover:text-white hover:border-white/25 transition-all duration-300"
          >
            <ChevronRight size={18} />
          </button>

          <div className="flex justify-center items-center gap-2 mt-8" role="tablist" aria-label="Diapositivas del carrete">
            {Array.from({ length: pages }).map((_, i) => (
              <button
                key={i}
                role="tab"
                aria-selected={i === slide}
                aria-label={`Página ${i + 1}`}
                onClick={() => goTo(i)}
                className={`rounded-full transition-all duration-300 ${
                  i === slide ? 'w-6 h-2 bg-brand-red' : 'w-2 h-2 bg-white/20 hover:bg-brand-red/50'
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
