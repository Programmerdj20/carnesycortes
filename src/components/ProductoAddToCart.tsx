'use client';

import { useState } from 'react';
import { useCart } from '@/contexts/CartContext';

interface ProductoAddToCartProps {
  id: number;
  nombre: string;
  precio: number;
  imagen: string;
  peso: string;
  slug: string;
}

export default function ProductoAddToCart({ id, nombre, precio, imagen, peso, slug }: ProductoAddToCartProps) {
  const [qty, setQty] = useState(1);
  const { addItem, showNotification } = useCart();

  const handleAdd = () => {
    addItem({ id, nombre, precio, imagen, peso, slug }, qty);
    showNotification(`${nombre} x${qty} agregado al carrito`);
  };

  return (
    <div>
      <div className="flex items-center gap-4 mb-6">
        <div className="flex items-center border-2 border-gray-200 rounded-full overflow-hidden">
          <button
            onClick={() => setQty(q => Math.max(1, q - 1))}
            className="w-12 h-12 flex items-center justify-center text-gray-600 hover:bg-gray-50 transition-colors text-lg font-bold"
          >-</button>
          <span className="w-12 h-12 flex items-center justify-center font-bold text-gray-900 border-x-2 border-gray-200">
            {qty}
          </span>
          <button
            onClick={() => setQty(q => q + 1)}
            className="w-12 h-12 flex items-center justify-center text-gray-600 hover:bg-gray-50 transition-colors text-lg font-bold"
          >+</button>
        </div>
        <button
          onClick={handleAdd}
          className="flex-1 bg-brand-red text-white py-3.5 px-8 rounded-full font-semibold hover:bg-brand-red-dark transition-all duration-300 shadow-red-glow flex items-center justify-center gap-2 text-lg"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
          Agregar al Carrito
        </button>
      </div>
    </div>
  );
}
