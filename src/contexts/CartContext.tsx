'use client';

import { createContext, useContext, useEffect, useState, useCallback } from 'react';

export interface CartItem {
  id: number;
  nombre: string;
  precio: number;
  imagen: string;
  peso: string;
  slug: string;
  cantidad: number;
}

interface CartContextType {
  items: CartItem[];
  isOpen: boolean;
  addItem: (item: Omit<CartItem, 'cantidad'>, qty?: number) => void;
  updateQuantity: (id: number, change: number) => void;
  toggleCart: () => void;
  sendWhatsAppOrder: () => void;
  showNotification: (message: string) => void;
}

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('carrito');
    if (saved) setItems(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem('carrito', JSON.stringify(items));
  }, [items]);

  const addItem = useCallback((producto: Omit<CartItem, 'cantidad'>, qty = 1) => {
    setItems(prev => {
      const existing = prev.find(i => i.id === producto.id);
      if (existing) {
        return prev.map(i => i.id === producto.id ? { ...i, cantidad: i.cantidad + qty } : i);
      }
      return [...prev, { ...producto, cantidad: qty }];
    });
  }, []);

  const updateQuantity = useCallback((id: number, change: number) => {
    setItems(prev =>
      prev.map(i => i.id === id ? { ...i, cantidad: i.cantidad + change } : i)
         .filter(i => i.cantidad > 0)
    );
  }, []);

  const toggleCart = useCallback(() => {
    setIsOpen(prev => !prev);
  }, []);

  const showNotification = useCallback((message: string) => {
    const container = document.getElementById('notificationContainer');
    if (!container) return;
    const notification = document.createElement('div');
    notification.className =
      'bg-dark-900 text-white px-5 py-3 rounded-full shadow-premium-lg text-sm font-medium flex items-center gap-2 opacity-0 transition-all duration-300';
    notification.style.transform = 'translateX(100%)';
    notification.innerHTML = `
      <svg class="w-4 h-4 text-green-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
        <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
      </svg>
      ${message}
    `;
    container.appendChild(notification);
    requestAnimationFrame(() => {
      notification.style.transform = 'translateX(0)';
      notification.style.opacity = '1';
    });
    setTimeout(() => {
      notification.style.transform = 'translateX(100%)';
      notification.style.opacity = '0';
      setTimeout(() => notification.remove(), 300);
    }, 3000);
  }, []);

  const sendWhatsAppOrder = useCallback(() => {
    if (items.length === 0) return;
    let message = '🥩 *PEDIDO CARNES & CORTES*\n\n';
    message += '📋 *Productos:*\n';
    items.forEach(item => {
      message += `• ${item.nombre} ${item.peso ? `(${item.peso})` : ''}\n`;
      message += `  Cantidad: ${item.cantidad}\n`;
      message += `  Precio: $${item.precio.toLocaleString('es-CO')} c/u\n`;
      message += `  Subtotal: $${(item.precio * item.cantidad).toLocaleString('es-CO')}\n\n`;
    });
    const total = items.reduce((t, i) => t + i.precio * i.cantidad, 0);
    message += `💰 *Total: $${total.toLocaleString('es-CO')}*\n\n`;
    message += '📍 Por favor confirmen disponibilidad y tiempo de entrega.';
    window.open(`https://wa.me/5573001234567?text=${encodeURIComponent(message)}`, '_blank');
  }, [items]);

  return (
    <CartContext.Provider value={{ items, isOpen, addItem, updateQuantity, toggleCart, sendWhatsAppOrder, showNotification }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
