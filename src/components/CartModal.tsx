'use client';

import { useEffect } from 'react';
import { useCart } from '@/contexts/CartContext';

export default function CartModal() {
  const { items, isOpen, toggleCart, updateQuantity, sendWhatsAppOrder } = useCart();
  const total = items.reduce((t, i) => t + i.precio * i.cantidad, 0);

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60]">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={toggleCart} />
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl transform translate-x-0 transition-transform duration-300">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-6 border-b border-gray-100 bg-gray-50/80">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-display font-bold text-gray-900">Mi Carrito</h2>
                <p className="text-gray-500 text-sm mt-0.5">Productos seleccionados</p>
              </div>
              <button
                onClick={toggleCart}
                className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-200 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Items */}
          <div className="flex-1 overflow-y-auto p-6">
            {items.length === 0 ? (
              <div className="text-center text-gray-400 py-12">
                <svg className="w-16 h-16 mx-auto mb-4 text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                <p className="font-medium">Tu carrito está vacío</p>
                <p className="text-sm mt-1">Agrega algunos productos deliciosos</p>
              </div>
            ) : (
              items.map(item => (
                <div key={item.id} className="flex items-center gap-4 p-3 bg-gray-50 rounded-xl mb-3 transition-all duration-300">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={item.imagen} alt={item.nombre} className="w-16 h-16 object-cover rounded-lg flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-gray-900 text-sm truncate">{item.nombre}</h4>
                    <p className="text-xs text-gray-500">{item.peso}</p>
                    <p className="text-brand-red font-bold text-sm">${item.precio.toLocaleString('es-CO')}</p>
                  </div>
                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    <button
                      onClick={() => updateQuantity(item.id, -1)}
                      className="w-7 h-7 bg-white border border-gray-200 text-gray-600 rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors text-sm"
                    >-</button>
                    <span className="w-7 text-center font-semibold text-sm">{item.cantidad}</span>
                    <button
                      onClick={() => updateQuantity(item.id, 1)}
                      className="w-7 h-7 bg-brand-red text-white rounded-full flex items-center justify-center hover:bg-brand-red-dark transition-colors text-sm"
                    >+</button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          <div className="border-t border-gray-100 p-6 bg-gray-50/80">
            <div className="flex items-center justify-between mb-4">
              <span className="text-gray-600 font-medium">Total:</span>
              <span className="text-2xl font-bold text-brand-red">${total.toLocaleString('es-CO')}</span>
            </div>
            <div className="space-y-3">
              <button
                onClick={sendWhatsAppOrder}
                disabled={items.length === 0}
                className="w-full bg-green-600 text-white py-3.5 px-6 rounded-full font-semibold hover:bg-green-700 transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488" />
                </svg>
                Pedir por WhatsApp
              </button>
              <button
                onClick={toggleCart}
                className="w-full bg-gray-100 text-gray-700 py-3 px-6 rounded-full font-semibold hover:bg-gray-200 transition-colors flex items-center justify-center gap-2 text-sm"
              >
                Seguir comprando
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
