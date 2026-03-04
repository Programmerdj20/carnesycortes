'use client';

import { useCart } from '@/contexts/CartContext';

interface AddToCartBtnProps {
  id: number;
  nombre: string;
  precio: number;
  imagen: string;
  peso: string;
  slug: string;
  className?: string;
  label?: string;
}

export default function AddToCartBtn({ id, nombre, precio, imagen, peso, slug, className, label }: AddToCartBtnProps) {
  const { addItem, showNotification } = useCart();

  return (
    <button
      onClick={() => {
        addItem({ id, nombre, precio, imagen, peso, slug });
        showNotification(`${nombre} agregado al carrito`);
      }}
      className={className}
    >
      {label ?? 'Agregar al Carrito'}
    </button>
  );
}
