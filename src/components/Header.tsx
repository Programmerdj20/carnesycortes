'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCart } from '@/contexts/CartContext';

const navLinks = [
  { href: '/', label: 'Inicio' },
  { href: '/tienda', label: 'Tienda' },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  const { items, toggleCart } = useCart();
  const cartCount = items.reduce((t, i) => t + i.cantidad, 0);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  const headerStyle = scrolled ? {
    background: 'rgba(255, 255, 255, 0.97)',
    backdropFilter: 'blur(20px)',
    borderBottom: '1px solid rgba(196, 30, 58, 0.1)',
    boxShadow: '0 2px 16px rgba(0,0,0,0.06)',
  } : {};

  const linkColor = scrolled ? 'text-gray-700 hover:text-brand-red' : 'text-white';
  const iconColor = scrolled ? 'text-gray-700 hover:text-brand-red' : 'text-white hover:text-brand-red';
  const menuBarColor = scrolled ? 'bg-gray-700' : 'bg-white';

  return (
    <header
      id="mainHeader"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? 'scrolled' : ''}`}
      style={headerStyle}
    >
      <nav className="py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="logo-link relative z-10 block flex-shrink-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/Assets/Logo cc.png"
                alt="Carnes & Cortes"
                className={`logo-img w-auto transition-all duration-500 hover:scale-105 ${
                  scrolled
                    ? 'h-14 sm:h-28 logo-sticker logo-pop-anim'
                    : 'h-10 sm:h-20'
                }`}
              />
            </Link>

            {/* Nav central */}
            <div className="hidden md:flex items-center space-x-8">
              {navLinks.map(link => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`font-medium transition-colors duration-300 relative group text-sm uppercase tracking-wider ${
                    pathname === link.href ? 'text-brand-red' : linkColor
                  }`}
                >
                  {link.label}
                  <span className={`absolute -bottom-1 left-0 h-0.5 bg-brand-red transition-all duration-300 ${
                    pathname === link.href ? 'w-full' : 'w-0 group-hover:w-full'
                  }`} />
                </Link>
              ))}
            </div>

            {/* Derecha */}
            <div className="flex items-center space-x-3 sm:space-x-4">
              {/* Carrito */}
              <button
                onClick={toggleCart}
                className={`relative p-2 transition-colors duration-300 ${iconColor}`}
                aria-label="Abrir carrito"
              >
                <svg width="28" height="28" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.8">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2 3h2l.5 3h15l-1.5 9H6.5L5 6M9 21a1 1 0 100-2 1 1 0 000 2zm8 0a1 1 0 100-2 1 1 0 000 2z" />
                </svg>
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-brand-red text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">
                    {cartCount}
                  </span>
                )}
              </button>

              {/* CTA */}
              <Link
                href="/tienda"
                className="hidden sm:inline-flex items-center gap-2 bg-brand-red text-white px-5 py-2.5 rounded-full font-semibold text-sm hover:bg-brand-red-dark transition-all duration-300 hover:-translate-y-0.5 shadow-red-glow"
              >
                Hacer Pedido
              </Link>

              {/* Mobile toggle */}
              <button
                onClick={() => setMenuOpen(o => !o)}
                className={`md:hidden flex flex-col p-2 space-y-1.5 focus:outline-none ${iconColor}`}
                aria-label="Menú"
              >
                <span className={`w-6 h-0.5 transition-all duration-300 origin-center ${menuBarColor} ${menuOpen ? 'translate-y-2 rotate-45' : ''}`} />
                <span className={`w-6 h-0.5 transition-all duration-300 ${menuBarColor} ${menuOpen ? 'opacity-0' : ''}`} />
                <span className={`w-6 h-0.5 transition-all duration-300 origin-center ${menuBarColor} ${menuOpen ? '-translate-y-2 -rotate-45' : ''}`} />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer */}
      <div id="mobileDrawer" className={`md:hidden fixed inset-0 top-0 z-40 ${menuOpen ? 'open' : ''}`}>
        <div
          className={`drawer-overlay absolute inset-0 bg-black/60 opacity-0 pointer-events-none transition-opacity duration-300 ${menuOpen ? '!opacity-100 pointer-events-auto' : ''}`}
          onClick={() => setMenuOpen(false)}
        />
        <div className={`drawer-panel absolute right-0 top-0 h-full w-72 bg-white shadow-2xl transform translate-x-full transition-transform duration-300 ${menuOpen ? '!translate-x-0' : ''}`}>
          <div className="pt-20 px-6 pb-8">
            <div className="space-y-1">
              {navLinks.map(link => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className={`block py-3 px-4 rounded-lg font-medium transition-colors duration-200 text-lg ${
                    pathname === link.href ? 'bg-brand-red/10 text-brand-red' : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
            <div className="mt-8 pt-6 border-t border-gray-200">
              <Link
                href="/tienda"
                onClick={() => setMenuOpen(false)}
                className="flex items-center justify-center gap-2 bg-brand-red text-white px-6 py-3 rounded-full font-semibold hover:bg-brand-red-dark transition-colors"
              >
                Hacer Pedido
              </Link>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
