'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import Image from 'next/image';
import {
  ShoppingBag,
  Minus,
  Plus,
  Heart,
  Share2,
  X,
  Truck,
  ShieldCheck,
  Award,
  ChevronLeft,
  ChevronRight,
  Scale,
  Package,
  MessageCircle,
} from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { whatsappLink } from '@/lib/contacto';

// ─── WhatsApp SVG (no está en Lucide) ────────────────────────────────────────
function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488" />
    </svg>
  );
}

// ─── Tipos ────────────────────────────────────────────────────────────────────

interface GaleriaItem {
  url: string;
  alt: string;
}

interface ProductoHeroProps {
  id: number;
  nombre: string;
  descripcion_corta: string;
  precio: number;
  peso: string;
  sku?: string;
  imagen: string;
  galeria: GaleriaItem[];
  badge?: string;
  badge_secundario?: string;
  stock?: boolean;
  origen?: string;
  slug: string;
}

// cyc_badge es un sello decorativo libre en WooCommerce (no es la categoría,
// ver src/lib/categorias.ts para la taxonomía real).
const BADGE_LABELS: Record<string, string> = {
  premium: 'Premium',
  especial: 'Especial',
  tradicional: 'Tradicional',
  destacado: 'Destacado',
};

// ─── Componente principal ─────────────────────────────────────────────────────

export default function ProductoHero({
  id,
  nombre,
  descripcion_corta,
  precio,
  peso,
  sku,
  imagen,
  galeria,
  badge,
  badge_secundario,
  stock = true,
  origen,
  slug,
}: ProductoHeroProps) {
  const [currentImg, setCurrentImg] = useState(imagen || galeria[0]?.url || '');
  const [fading, setFading] = useState(false);
  const [qty, setQty] = useState(1);
  const [wishlisted, setWishlisted] = useState(false);
  const [showSticky, setShowSticky] = useState(false);
  const { addItem, showNotification } = useCart();

  const ctaRef = useRef<HTMLDivElement>(null);
  const filmstripRef = useRef<HTMLDivElement>(null);

  // Todas las imágenes: principal + galería
  const allImages: GaleriaItem[] = imagen ? [{ url: imagen, alt: nombre }, ...galeria] : galeria;

  // Precio formateado COP
  const precioFmt = new Intl.NumberFormat('es-CO').format(precio);
  const sinPrecio = precio <= 0;
  const waMensaje = sinPrecio
    ? `Hola, quiero consultar el precio de: ${nombre}`
    : `Hola, quiero pedir: ${nombre} (${peso}) — $${precioFmt}`;
  const waLink = whatsappLink(waMensaje);

  // Sticky CTA bar — aparece cuando el botón principal sale del viewport
  useEffect(() => {
    if (!ctaRef.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => setShowSticky(!entry.isIntersecting),
      { threshold: 0, rootMargin: '-64px 0px 0px 0px' }
    );
    observer.observe(ctaRef.current);
    return () => observer.disconnect();
  }, []);

  // Cambio de imagen con crossfade
  const switchImage = useCallback((url: string) => {
    if (url === currentImg) return;
    setFading(true);
    setTimeout(() => {
      setCurrentImg(url);
      setFading(false);
    }, 180);
  }, [currentImg]);

  // Scroll del filmstrip
  const scrollFilmstrip = (dir: 'left' | 'right') => {
    if (!filmstripRef.current) return;
    filmstripRef.current.scrollBy({ left: dir === 'left' ? -200 : 200, behavior: 'smooth' });
  };

  const handleAdd = () => {
    if (sinPrecio) return;
    addItem({ id, nombre, precio, imagen: currentImg, peso, slug }, qty);
    showNotification(`${nombre} agregado al carrito`);
  };

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({ title: nombre, url: window.location.href });
    } else {
      await navigator.clipboard.writeText(window.location.href);
      showNotification('Enlace copiado al portapapeles');
    }
  };

  return (
    <>
      {/* ═══════════════════════════════════════════════════════════════════
          SECCIÓN PRINCIPAL — Grid dos columnas en desktop
      ════════════════════════════════════════════════════════════════════ */}
      <section className="bg-dark-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-[56%_1fr] lg:gap-12 xl:gap-16 py-8 lg:py-12">

            {/* ── COLUMNA IZQUIERDA: Galería ─────────────────────────────── */}
            <div className="lg:sticky lg:top-28 lg:self-start space-y-3">

              {/* Imagen principal */}
              <div className="relative overflow-hidden rounded-2xl bg-dark-800 group aspect-square">
                {currentImg ? (
                  <Image
                    src={currentImg}
                    alt={nombre}
                    fill
                    priority
                    sizes="(min-width: 1024px) 50vw, 100vw"
                    className={[
                      'object-cover transition-all duration-200',
                      'group-hover:scale-[1.03]',
                      fading ? 'opacity-0' : 'opacity-100',
                    ].join(' ')}
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center gap-3 bg-gradient-to-br from-dark-900 to-dark-800">
                    <Award className="w-12 h-12 text-gold/30" strokeWidth={1.5} />
                    <span className="font-display text-xl text-white/20">{nombre}</span>
                  </div>
                )}

                {/* Badge de categoría — esquina superior izquierda */}
                {badge && (
                  <div className="absolute top-4 left-4">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest bg-dark-900/70 backdrop-blur-sm text-gold border border-gold/20">
                      <Award size={11} />
                      {BADGE_LABELS[badge] ?? badge}
                    </span>
                  </div>
                )}

                {/* Origen — esquina inferior izquierda */}
                {origen && (
                  <div className="absolute bottom-4 left-4">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-dark-900/75 backdrop-blur-sm text-white/70">
                      <Package size={11} />
                      {origen}
                    </span>
                  </div>
                )}

                {/* Botón wishlist flotante */}
                <button
                  onClick={() => setWishlisted(w => !w)}
                  className={[
                    'absolute top-4 right-4 w-9 h-9 rounded-full flex items-center justify-center',
                    'bg-dark-900/70 backdrop-blur-sm border border-white/10',
                    'transition-all duration-200 hover:border-white/25',
                    wishlisted ? 'text-brand-red' : 'text-white/50',
                  ].join(' ')}
                  aria-label="Guardar en favoritos"
                >
                  <Heart size={15} fill={wishlisted ? 'currentColor' : 'none'} />
                </button>
              </div>

              {/* Filmstrip de miniaturas */}
              {allImages.length > 1 && (
                <div className="relative">
                  {/* Botón izquierda */}
                  <button
                    onClick={() => scrollFilmstrip('left')}
                    className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-3 z-10 w-7 h-7 rounded-full bg-dark-800 border border-white/10 flex items-center justify-center text-white/50 hover:text-white transition-colors shadow-premium-md"
                    aria-label="Anterior"
                  >
                    <ChevronLeft size={14} />
                  </button>

                  {/* Tira de miniaturas */}
                  <div
                    ref={filmstripRef}
                    className="flex gap-2.5 overflow-x-auto scroll-smooth pb-0.5"
                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                  >
                    {allImages.map((item, i) => (
                      <button
                        key={i}
                        onClick={() => switchImage(item.url)}
                        className={[
                          'relative flex-none w-[72px] h-[72px] sm:w-20 sm:h-20 rounded-xl overflow-hidden border-2 transition-all duration-200',
                          currentImg === item.url
                            ? 'border-gold opacity-100 scale-[1.04]'
                            : 'border-dark-700 opacity-50 hover:opacity-80 hover:border-white/20',
                        ].join(' ')}
                        aria-label={item.alt || `Imagen ${i + 1}`}
                      >
                        <Image src={item.url} alt={item.alt} fill sizes="80px" className="object-cover" />
                      </button>
                    ))}
                  </div>

                  {/* Botón derecha */}
                  <button
                    onClick={() => scrollFilmstrip('right')}
                    className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-3 z-10 w-7 h-7 rounded-full bg-dark-800 border border-white/10 flex items-center justify-center text-white/50 hover:text-white transition-colors shadow-premium-md"
                    aria-label="Siguiente"
                  >
                    <ChevronRight size={14} />
                  </button>
                </div>
              )}
            </div>

            {/* ── COLUMNA DERECHA: Info del producto ────────────────────── */}
            <div className="mt-8 lg:mt-0 space-y-6">

              {/* Badges */}
              {(badge || badge_secundario) && (
                <div className="flex flex-wrap gap-2">
                  {badge && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest bg-brand-red/10 text-brand-red border border-brand-red/20">
                      <Award size={11} />
                      {BADGE_LABELS[badge] ?? badge}
                    </span>
                  )}
                  {badge_secundario && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest bg-gold/10 text-gold border border-gold/20">
                      {BADGE_LABELS[badge_secundario] ?? badge_secundario}
                    </span>
                  )}
                </div>
              )}

              {/* Nombre del producto */}
              <div>
                <h1 className="font-display text-3xl sm:text-4xl xl:text-[2.75rem] font-bold text-white leading-tight tracking-tight">
                  {nombre}
                </h1>
              </div>

              {/* Precio + Stock */}
              <div className="flex items-center justify-between gap-4 pt-1">
                <div>
                  {sinPrecio ? (
                    <span className="text-2xl font-bold text-white/70 tracking-tight">Consultar precio</span>
                  ) : (
                    <span className="text-4xl font-bold text-white tracking-tight">
                      ${precioFmt}
                    </span>
                  )}
                  {peso && (
                    <span className="ml-3 text-sm text-white/40 font-light">/ {peso}</span>
                  )}
                </div>
                {!stock && (
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold bg-white/5 text-white/40 border border-white/10">
                    <X size={12} />
                    Agotado
                  </div>
                )}
              </div>

              {/* SKU + Peso en chips */}
              <div className="flex flex-wrap items-center gap-3">
                {sku && (
                  <span className="inline-flex items-center gap-1.5 text-xs text-white/35 font-mono tracking-wider">
                    REF {sku}
                  </span>
                )}
                {peso && (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-dark-800 border border-white/7 text-xs text-white/50">
                    <Scale size={11} />
                    {peso}
                  </span>
                )}
              </div>

              {/* Descripción corta */}
              {descripcion_corta && (
                <p className="text-white/55 text-sm leading-relaxed border-t border-white/7 pt-5">
                  {descripcion_corta}
                </p>
              )}

              {/* ── CTA Principal ─────────────────────────────────────── */}
              <div ref={ctaRef} className="space-y-3 pt-1">
                {sinPrecio ? (
                  /* Sin precio publicado: WhatsApp es la acción principal */
                  <a
                    href={waLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2.5 w-full py-4 rounded-full font-semibold text-sm bg-brand-red text-white hover:bg-brand-red-dark shadow-red-glow transition-all duration-200 active:scale-[0.98]"
                  >
                    <MessageCircle size={17} />
                    Consultar precio por WhatsApp
                  </a>
                ) : (
                  <>
                    {/* Selector de cantidad + Agregar al carrito */}
                    <div className="flex items-stretch gap-3">
                      {/* Cantidad */}
                      <div className="flex items-center border border-white/12 rounded-full bg-dark-800/60 overflow-hidden">
                        <button
                          onClick={() => setQty(q => Math.max(1, q - 1))}
                          disabled={qty <= 1}
                          className="w-11 h-12 flex items-center justify-center text-white/50 hover:text-white disabled:text-white/20 transition-colors"
                          aria-label="Reducir cantidad"
                        >
                          <Minus size={15} />
                        </button>
                        <span className="w-10 h-12 flex items-center justify-center text-white font-semibold text-sm border-x border-white/10">
                          {qty}
                        </span>
                        <button
                          onClick={() => setQty(q => q + 1)}
                          className="w-11 h-12 flex items-center justify-center text-white/50 hover:text-white transition-colors"
                          aria-label="Aumentar cantidad"
                        >
                          <Plus size={15} />
                        </button>
                      </div>

                      {/* Agregar al carrito */}
                      <button
                        onClick={handleAdd}
                        disabled={!stock}
                        className={[
                          'flex-1 flex items-center justify-center gap-2.5 rounded-full font-semibold text-sm transition-all duration-200 cursor-pointer disabled:cursor-not-allowed',
                          stock
                            ? 'bg-brand-red text-white hover:bg-brand-red-dark shadow-red-glow active:scale-[0.98]'
                            : 'bg-dark-700 text-white/30 cursor-not-allowed',
                        ].join(' ')}
                      >
                        <ShoppingBag size={17} />
                        Agregar al Carrito
                      </button>
                    </div>

                    {/* WhatsApp */}
                    <a
                      href={waLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2.5 w-full py-3.5 rounded-full border border-white/10 bg-dark-800/50 text-white/70 hover:text-white hover:border-white/20 hover:bg-dark-700/50 transition-all duration-200 text-sm font-medium"
                    >
                      <WhatsAppIcon className="w-4 h-4" />
                      Consultar por WhatsApp
                    </a>
                  </>
                )}
              </div>

              {/* Compartir */}
              <div className="flex items-center gap-3 pt-1">
                <button
                  onClick={handleShare}
                  className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg border border-white/8 bg-dark-800/40 text-white/40 hover:text-white/70 hover:border-white/15 transition-all text-xs"
                >
                  <Share2 size={13} />
                  Compartir
                </button>
                <span className="text-white/20 text-xs">·</span>
                <button
                  onClick={() => setWishlisted(w => !w)}
                  className={[
                    'inline-flex items-center gap-2 px-3.5 py-2 rounded-lg border transition-all text-xs',
                    wishlisted
                      ? 'border-brand-red/30 bg-brand-red/5 text-brand-red/80'
                      : 'border-white/8 bg-dark-800/40 text-white/40 hover:text-white/70 hover:border-white/15',
                  ].join(' ')}
                >
                  <Heart size={13} fill={wishlisted ? 'currentColor' : 'none'} />
                  {wishlisted ? 'Guardado' : 'Favoritos'}
                </button>
              </div>

              {/* Señales de confianza */}
              <div className="grid grid-cols-3 gap-3 pt-2 border-t border-white/7">
                {[
                  { icon: <Truck size={16} />, title: 'Entregas Rápidas', sub: 'En toda la ciudad' },
                  { icon: <ShieldCheck size={16} />, title: 'Calidad certificada', sub: 'Origen controlado' },
                  { icon: <Award size={16} />, title: 'Corte garantizado', sub: 'Frescura asegurada' },
                ].map(item => (
                  <div key={item.title} className="flex flex-col items-center text-center gap-2 py-3">
                    <span className="text-gold/70">{item.icon}</span>
                    <div>
                      <p className="text-white/60 text-[11px] font-semibold leading-tight">{item.title}</p>
                      <p className="text-white/30 text-[10px] mt-0.5 leading-tight">{item.sub}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          STICKY CTA BAR — aparece al hacer scroll
      ════════════════════════════════════════════════════════════════════ */}
      <div
        className={[
          'fixed bottom-0 left-0 right-0 z-50 transition-transform duration-300',
          showSticky ? 'translate-y-0' : 'translate-y-full',
        ].join(' ')}
      >
        <div className="bg-dark-800/95 backdrop-blur-md border-t border-white/10 shadow-premium-xl">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <div className="flex items-center gap-4">
              {/* Miniatura */}
              <div className="hidden sm:block relative w-12 h-12 rounded-lg overflow-hidden flex-none bg-dark-700">
                {currentImg && <Image src={currentImg} alt={nombre} fill sizes="48px" className="object-cover" />}
              </div>

              {/* Nombre + precio */}
              <div className="flex-1 min-w-0">
                <p className="text-white text-sm font-semibold truncate">{nombre}</p>
                <p className="text-white/50 text-xs">{sinPrecio ? 'Consultar precio' : `$${precioFmt}`}</p>
              </div>

              {/* Qty + Add */}
              <div className="flex items-center gap-2">
                {sinPrecio ? (
                  <a
                    href={waLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 bg-brand-red text-white px-5 py-2.5 rounded-full font-semibold text-sm hover:bg-brand-red-dark transition-all shadow-red-glow active:scale-[0.98] whitespace-nowrap"
                  >
                    <MessageCircle size={15} />
                    <span className="hidden xs:inline">WhatsApp</span>
                  </a>
                ) : (
                  <>
                    <div className="hidden sm:flex items-center border border-white/12 rounded-full bg-dark-900/50 overflow-hidden">
                      <button
                        onClick={() => setQty(q => Math.max(1, q - 1))}
                        className="w-8 h-9 flex items-center justify-center text-white/50 hover:text-white transition-colors"
                      >
                        <Minus size={12} />
                      </button>
                      <span className="w-7 h-9 flex items-center justify-center text-white text-xs font-semibold border-x border-white/10">
                        {qty}
                      </span>
                      <button
                        onClick={() => setQty(q => q + 1)}
                        className="w-8 h-9 flex items-center justify-center text-white/50 hover:text-white transition-colors"
                      >
                        <Plus size={12} />
                      </button>
                    </div>

                    <button
                      onClick={handleAdd}
                      disabled={!stock}
                      className="flex items-center gap-2 bg-brand-red text-white px-5 py-2.5 rounded-full font-semibold text-sm hover:bg-brand-red-dark transition-all shadow-red-glow active:scale-[0.98] whitespace-nowrap cursor-pointer disabled:cursor-not-allowed"
                    >
                      <ShoppingBag size={15} />
                      <span className="hidden xs:inline">Agregar</span>
                    </button>

                    <a
                      href={waLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center w-10 h-10 rounded-full border border-white/10 bg-dark-700/50 text-white/50 hover:text-white hover:border-white/25 transition-all"
                      aria-label="Pedir por WhatsApp"
                    >
                      <WhatsAppIcon className="w-4 h-4" />
                    </a>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
