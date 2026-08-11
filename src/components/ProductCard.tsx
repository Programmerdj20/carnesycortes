'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ShoppingBag, Star } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { badgeClase, nombreCategoria, getCategoria } from '@/lib/categorias';
import { whatsappLink } from '@/lib/contacto';

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

export default function ProductCard({ id, nombre, descripcion, precio, imagen, categoria, peso, slug, destacado }: ProductCardProps) {
  const { addItem, showNotification } = useCart();
  const badgeClass = badgeClase(categoria);
  const Icono = getCategoria(categoria)?.icono;
  const sinPrecio = precio <= 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addItem({ id, nombre, precio, imagen, peso, slug });
    showNotification(`${nombre} agregado al carrito`);
  };

  return (
    <article className="group bg-white rounded-2xl overflow-hidden shadow-premium-sm hover:shadow-premium-lg transition-all duration-500 hover:-translate-y-2 border border-gray-100" data-category={categoria}>
      <Link href={`/producto/${slug}`} className="block">
        <div className="relative overflow-hidden aspect-[4/3] bg-dark-800">
          {imagen ? (
            <Image
              src={imagen}
              alt={nombre}
              fill
              sizes="(min-width: 1280px) 23vw, (min-width: 1024px) 30vw, (min-width: 640px) 45vw, 92vw"
              className="object-cover transition-transform duration-700 group-hover:scale-110"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-dark-900 to-dark-800">
              {Icono && <Icono className="w-10 h-10 text-gold/40" strokeWidth={1.5} />}
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <span className={`absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${badgeClass}`}>
            {nombreCategoria(categoria)}
          </span>
          {destacado && (
            <span className="absolute top-4 right-4 bg-gold text-dark-900 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1">
              <Star size={12} fill="currentColor" strokeWidth={0} />
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
        <div className="flex items-center justify-between gap-3">
          <div>
            {sinPrecio ? (
              <span className="text-sm font-semibold text-gray-500">Consultar precio</span>
            ) : (
              <span className="text-xl font-bold text-brand-red">${precio.toLocaleString('es-CO')}</span>
            )}
            <span className="text-gray-400 text-xs block">{peso}</span>
          </div>
          {sinPrecio ? (
            <a
              href={whatsappLink(`Hola, quiero consultar el precio de: ${nombre}`)}
              target="_blank"
              rel="noopener noreferrer"
              onClick={e => e.stopPropagation()}
              className="flex items-center gap-1.5 bg-dark-800 text-white px-4 py-2 rounded-full text-sm font-semibold hover:bg-dark-700 transition-all duration-300 whitespace-nowrap"
            >
              WhatsApp
            </a>
          ) : (
            <button
              onClick={handleAddToCart}
              className="flex items-center gap-1.5 bg-brand-red text-white px-4 py-2 rounded-full text-sm font-semibold hover:bg-brand-red-dark transition-all duration-300 hover:shadow-red-glow cursor-pointer"
            >
              <ShoppingBag size={16} />
              Agregar
            </button>
          )}
        </div>
      </div>
    </article>
  );
}
