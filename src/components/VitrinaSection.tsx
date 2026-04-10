'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useCart } from '@/contexts/CartContext';
import type { Producto } from '@/lib/productos';

interface VitrinaSectionProps {
  tradicionales: Producto[];
  especiales: Producto[];
  cantidad?: number;
}

function shufflePick<T>(arr: T[], n: number): T[] {
  return [...arr].sort(() => Math.random() - 0.5).slice(0, n);
}

// Skeleton card mientras carga el shuffle
function SkeletonCard({ accent }: { accent: 'red' | 'gold' }) {
  const border = accent === 'gold' ? 'border-gold/10' : 'border-brand-red/10';
  return (
    <div className={`rounded-2xl overflow-hidden bg-dark-700 border ${border} animate-pulse`}>
      <div className="aspect-[4/3] bg-dark-600" />
      <div className="p-5 space-y-3">
        <div className="h-4 bg-dark-600 rounded w-3/4" />
        <div className="h-3 bg-dark-600 rounded w-full" />
        <div className="h-3 bg-dark-600 rounded w-2/3" />
        <div className="flex justify-between items-center pt-2">
          <div className="h-6 bg-dark-600 rounded w-1/3" />
          <div className="h-8 bg-dark-600 rounded-full w-20" />
        </div>
      </div>
    </div>
  );
}

function VitrinaCard({ producto, accent }: { producto: Producto; accent: 'red' | 'gold' }) {
  const { addItem, showNotification } = useCart();

  const handleAdd = () => {
    addItem({
      id: producto.id,
      nombre: producto.nombre,
      precio: producto.precio,
      imagen: producto.imagen,
      peso: producto.peso,
      slug: producto.slug,
    });
    showNotification(`${producto.nombre} agregado al carrito`);
  };

  const isGold = accent === 'gold';

  return (
    <article
      className={`group relative flex flex-col overflow-hidden rounded-2xl bg-dark-700 border border-white/[0.06] transition-all duration-500 hover:-translate-y-1 ${
        isGold
          ? 'hover:border-gold/35 hover:shadow-[0_12px_40px_rgba(212,168,75,0.12)]'
          : 'hover:border-brand-red/30 hover:shadow-[0_12px_40px_rgba(196,30,58,0.15)]'
      }`}
    >
      {/* Imagen */}
      <Link href={`/producto/${producto.slug}`} className="block relative overflow-hidden aspect-[4/3] shrink-0">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={producto.imagen}
          alt={producto.nombre}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.06]"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-dark-900/70 via-transparent to-transparent" />
        {producto.badge && (
          <span
            className={`absolute top-3 left-3 text-[10px] font-bold uppercase tracking-wider bg-dark-900/75 backdrop-blur-sm px-2.5 py-1 rounded-full border ${
              isGold ? 'text-gold/90 border-gold/20' : 'text-white/90 border-white/10'
            }`}
          >
            {producto.badge}
          </span>
        )}
        <span className="absolute bottom-3 right-3 text-[10px] text-white/60 bg-dark-900/60 backdrop-blur-sm px-2 py-0.5 rounded-full">
          {producto.peso}
        </span>
      </Link>

      {/* Contenido */}
      <div className="flex-1 flex flex-col p-5">
        <Link href={`/producto/${producto.slug}`}>
          <h3
            className={`font-bold text-base mb-1 leading-snug line-clamp-1 transition-colors duration-300 ${
              isGold ? 'text-white group-hover:text-gold' : 'text-white group-hover:text-brand-red'
            }`}
          >
            {producto.nombre}
          </h3>
        </Link>
        <p className="text-white/35 text-xs leading-relaxed mb-4 line-clamp-2 flex-1">
          {producto.descripcion}
        </p>
        <div className="flex items-center justify-between gap-3 mt-auto pt-3 border-t border-white/[0.07]">
          <span className={`text-xl font-display font-bold tracking-tight ${isGold ? 'text-gold' : 'text-brand-red'}`}>
            ${producto.precio.toLocaleString('es-CO')}
          </span>
          <button
            onClick={handleAdd}
            className={`text-[11px] font-bold uppercase tracking-wider px-4 py-2 rounded-full border transition-all duration-300 ${
              isGold
                ? 'border-gold/35 text-gold bg-gold/10 hover:bg-gold hover:text-dark-900 hover:border-gold'
                : 'border-brand-red/40 text-brand-red bg-brand-red/10 hover:bg-brand-red hover:text-white hover:border-brand-red'
            }`}
          >
            Agregar
          </button>
        </div>
      </div>
    </article>
  );
}

export default function VitrinaSection({ tradicionales, especiales, cantidad = 3 }: VitrinaSectionProps) {
  const [tradItems, setTradItems] = useState<Producto[]>([]);
  const [especItems, setEspecItems] = useState<Producto[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setTradItems(shufflePick(tradicionales, Math.min(cantidad, tradicionales.length)));
    setEspecItems(shufflePick(especiales, Math.min(cantidad, especiales.length)));
    setReady(true);
  }, [tradicionales, especiales, cantidad]);

  const hasTrad = tradicionales.length > 0;
  const hasEspec = especiales.length > 0;

  if (!hasTrad && !hasEspec) return null;

  return (
    <section className="py-24 bg-dark-800 relative overflow-hidden">
      {/* Dot-grid texture */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{ backgroundImage: 'radial-gradient(circle, #ffffff 1px, transparent 1px)', backgroundSize: '28px 28px' }}
      />
      {/* Gold top accent */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/70 to-transparent" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Encabezado de sección */}
        <div className="text-center mb-16 reveal-on-scroll">
          <div className="flex items-center justify-center gap-5 mb-5">
            <span className="block h-px w-20 bg-gradient-to-r from-transparent to-gold/60" />
            <span className="text-gold font-semibold text-[10px] uppercase tracking-[0.3em]">La Vitrina</span>
            <span className="block h-px w-20 bg-gradient-to-l from-transparent to-gold/60" />
          </div>
          <h2 className="text-3xl sm:text-4xl font-display font-bold text-white leading-tight">
            Más que un Combo,<br />
            <span className="text-gold">una Tradición</span>
          </h2>
          <p className="text-white/40 text-sm mt-4 max-w-md mx-auto leading-relaxed">
            Cortes clásicos y especialidades únicas que cuentan la historia de nuestra cocina
          </p>
        </div>

        {/* ---- Cortes Tradicionales ---- */}
        {hasTrad && (
          <div className="mb-16 reveal-on-scroll">
            <div className="flex items-center gap-4 mb-8">
              <div className="flex items-center gap-2.5 bg-brand-red/15 border border-brand-red/35 rounded-full px-4 py-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-red" />
                <span className="text-brand-red text-[10px] font-bold uppercase tracking-[0.2em]">Cortes Tradicionales</span>
              </div>
              <div className="flex-1 h-px bg-gradient-to-r from-brand-red/25 to-transparent" />
              <Link
                href="/tienda?cat=tradicional"
                className="text-white/35 hover:text-brand-red text-[10px] font-semibold uppercase tracking-wider transition-colors duration-300 flex items-center gap-1 shrink-0"
              >
                Ver todos
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {!ready
                ? Array.from({ length: cantidad }).map((_, i) => <SkeletonCard key={i} accent="red" />)
                : tradItems.map(p => <VitrinaCard key={p.id} producto={p} accent="red" />)
              }
            </div>
          </div>
        )}

        {/* Divisor decorativo */}
        {hasTrad && hasEspec && (
          <div className="relative mb-16">
            <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-dark-800 px-5">
              <div className="w-1.5 h-1.5 rounded-full bg-gold/50 mx-auto" />
            </div>
          </div>
        )}

        {/* ---- Cortes Especiales ---- */}
        {hasEspec && (
          <div className="reveal-on-scroll">
            <div className="flex items-center gap-4 mb-8">
              <div className="flex items-center gap-2.5 bg-gold/10 border border-gold/30 rounded-full px-4 py-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-gold" />
                <span className="text-gold text-[10px] font-bold uppercase tracking-[0.2em]">Cortes Especiales</span>
              </div>
              <div className="flex-1 h-px bg-gradient-to-r from-gold/25 to-transparent" />
              <Link
                href="/tienda?cat=especial"
                className="text-white/35 hover:text-gold text-[10px] font-semibold uppercase tracking-wider transition-colors duration-300 flex items-center gap-1 shrink-0"
              >
                Ver todos
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {!ready
                ? Array.from({ length: cantidad }).map((_, i) => <SkeletonCard key={i} accent="gold" />)
                : especItems.map(p => <VitrinaCard key={p.id} producto={p} accent="gold" />)
              }
            </div>
          </div>
        )}
      </div>

      {/* Gold bottom accent */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/40 to-transparent" />
    </section>
  );
}
