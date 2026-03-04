'use client';

import Link from 'next/link';
import { useCart } from '@/contexts/CartContext';

interface ProductCardProps {
  id: number;
  nombre: string;
  descripcion: string;
  precio: number;
  imagen: string;
  categoria: string;
  peso: string;
  slug: string;
  destacado?: boolean;
}

const categoriaBadgeColors: Record<string, string> = {
  premium: 'bg-gold text-dark-900',
  tradicional: 'bg-brand-red text-white',
  combo: 'bg-green-600 text-white',
  especial: 'bg-purple-600 text-white',
  especialidad: 'bg-dark-800 text-white',
};

export default function ProductCard({ id, nombre, descripcion, precio, imagen, categoria, peso, slug, destacado }: ProductCardProps) {
  const { addItem, showNotification } = useCart();
  const badgeClass = categoriaBadgeColors[categoria] || 'bg-brand-red text-white';

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addItem({ id, nombre, precio, imagen, peso, slug });
    showNotification(`${nombre} agregado al carrito`);
  };

  return (
    <article className="group bg-white rounded-2xl overflow-hidden shadow-premium-sm hover:shadow-premium-lg transition-all duration-500 hover:-translate-y-2 border border-gray-100" data-category={categoria}>
      <Link href={`/producto/${slug}`} className="block">
        <div className="relative overflow-hidden aspect-[4/3]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={imagen}
            alt={nombre}
            loading="lazy"
            decoding="async"
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <span className={`absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${badgeClass}`}>
            {categoria}
          </span>
          {destacado && (
            <span className="absolute top-4 right-4 bg-gold text-dark-900 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1">
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
      <div className="p-5">
        <Link href={`/producto/${slug}`} className="block">
          <h3 className="text-lg font-bold text-gray-900 mb-1 group-hover:text-brand-red transition-colors">{nombre}</h3>
        </Link>
        <p className="text-gray-500 text-sm mb-3 line-clamp-2">{descripcion}</p>
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xl font-bold text-brand-red">${precio.toLocaleString('es-CO')}</span>
            <span className="text-gray-400 text-xs block">{peso}</span>
          </div>
          <button
            onClick={handleAddToCart}
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
