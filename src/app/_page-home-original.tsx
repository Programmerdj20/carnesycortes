import Link from 'next/link';
import { getProductos } from '@/lib/productos';
import TestimonialCard from '@/components/TestimonialCard';
import AddToCartBtn from '@/components/AddToCartBtn';
import ProductosCarousel from '@/components/ProductosCarousel';
import VitrinaSection from '@/components/VitrinaSection';
import { UNIDAD_CORTA } from '@/lib/unidades';

const categorias = [
  { id: 'premium', nombre: 'Cortes Premium', descripcion: 'Selección de los mejores cortes', imagen: 'https://images.unsplash.com/photo-1615937722923-67f6deaf2cc9?w=400&q=80', icono: '⭐' },
  { id: 'tradicional', nombre: 'Tradicionales', descripcion: 'Clásicos de nuestra tierra', imagen: 'https://images.unsplash.com/photo-1603048297172-c92544798d5a?w=400&q=80', icono: '🔥' },
  { id: 'combo', nombre: 'Combos', descripcion: 'Perfectos para compartir', imagen: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400&q=80', icono: '👨‍👩‍👧‍👦' },
  { id: 'especialidad', nombre: 'Especialidades', descripcion: 'Sabores únicos', imagen: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=400&q=80', icono: '🎯' },
];

const testimonios = [
  { nombre: 'Carlos Rodríguez', texto: 'La calidad de los cortes es excepcional. Desde que los probé no compro carne en otro lugar. El ribeye es simplemente perfecto.', rating: 5 },
  { nombre: 'María López', texto: 'El combo familiar fue un éxito total en la reunión. Todos quedaron encantados con la calidad y el sabor. Volveré a pedir.', rating: 5 },
  { nombre: 'Andrés García', texto: 'Excelente servicio de entrega y la carne siempre llega fresca. Los chorizos artesanales son los mejores que he probado.', rating: 5 },
];

const whatsappSvg = (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488" />
  </svg>
);

export default async function HomePage() {
  const todosLosProductos = await getProductos();
  // Banner: primero busca un combo, si no hay usa cualquier producto destacado o el primero
  const comboDestacado =
    todosLosProductos.find(p => p.categoria === 'combos') ??
    todosLosProductos.find(p => p.destacado) ??
    todosLosProductos[0];

  const tradicionales = todosLosProductos.filter(p => p.categoria === 'cortes-res').slice(0, 3);
  const especiales = todosLosProductos.filter(p => p.categoria === 'cortes-especiales-res' || p.categoria === 'cortes-especiales-cerdo').slice(0, 3);

  return (
    <>
      {/* ========== HERO ========== */}
      <section className="relative min-h-screen flex items-center overflow-hidden bg-dark-900">
        <div className="absolute inset-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://images.unsplash.com/photo-1558030006-450675393462?w=1600&q=80"
            alt="Cortes premium"
            className="w-full h-full object-cover parallax-bg"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-dark-900/95 via-dark-900/70 to-dark-900/40" />
          <div className="absolute inset-0 bg-gradient-to-t from-dark-900 via-transparent to-transparent" />
        </div>

        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 lg:py-0">
          <div className="grid lg:grid-cols-2 gap-12 items-center min-h-screen py-20">
            <div className="animate-slide-in-left">
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-5 py-2 mb-8">
                <span className="w-2 h-2 bg-brand-red rounded-full animate-pulse-dot" />
                <span className="text-white/90 text-xs font-semibold tracking-widest uppercase">Desde 2009</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-display font-bold leading-[1.1] mb-6">
                <span className="text-white">Cortes Premium de </span>
                <span className="text-brand-red">Calidad Excepcional</span>
              </h1>

              <p className="text-lg sm:text-xl text-gray-300 leading-relaxed mb-8 max-w-lg">
                Más de 15 años seleccionando los mejores cortes para los paladares más exigentes. Frescura y calidad garantizada.
              </p>

              <div className="flex flex-wrap gap-4 mb-12">
                <Link
                  href="/tienda"
                  className="inline-flex items-center gap-2 bg-brand-red text-white px-8 py-4 rounded-full font-semibold hover:bg-brand-red-dark transition-all duration-300 hover:-translate-y-0.5 shadow-red-glow"
                >
                  Explorar Productos
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
                <a
                  href="https://wa.me/5573001234567"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 text-white px-8 py-4 rounded-full font-semibold hover:bg-white/20 transition-all duration-300"
                >
                  {whatsappSvg}
                  Hacer Pedido
                </a>
              </div>
            </div>
            {/* ── Elementos flotantes sobre la imagen del Hero ── */}
            <div className="hidden lg:block relative animate-slide-in-right">

              {/* Badge superior: calidad */}
              <div className="absolute -top-8 right-8 flex items-center gap-2.5 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-4 py-2.5 shadow-[0_8px_32px_rgba(0,0,0,0.3)]">
                <span className="w-2 h-2 rounded-full bg-brand-red animate-pulse-dot" />
                <span className="text-white/90 text-[11px] font-bold uppercase tracking-[0.2em]">100% Premium</span>
              </div>

              {/* Card precio flotante — anclado al centro-derecha */}
              <div className="ml-auto w-fit mt-16">
                <div className="bg-dark-900/60 backdrop-blur-xl border border-white/[0.12] rounded-2xl px-6 py-5 shadow-[0_20px_60px_rgba(0,0,0,0.5)]">
                  <p className="text-white/40 text-[10px] uppercase tracking-[0.25em] mb-1">Corte del día</p>
                  <h3 className="font-display font-bold text-white text-lg leading-tight mb-1 max-w-[180px]">
                    {comboDestacado.nombre}
                  </h3>
                  <div className="flex items-baseline gap-2 mt-2">
                    <span className="font-display font-bold text-sm text-brand-red leading-none uppercase tracking-wider">
                      {UNIDAD_CORTA}
                    </span>
                  </div>
                </div>
              </div>

              {/* Línea decorativa vertical */}
              <div className="absolute left-0 top-1/2 -translate-y-1/2 flex flex-col items-center gap-1.5 -translate-x-8">
                <span className="block w-px h-16 bg-gradient-to-b from-transparent to-white/20" />
                <span className="block w-1 h-1 rounded-full bg-brand-red" />
                <span className="block w-px h-16 bg-gradient-to-t from-transparent to-white/20" />
              </div>

              {/* Badge inferior: frescura garantizada */}
              <div className="mt-8 ml-12 flex items-center gap-3 bg-dark-900/50 backdrop-blur-md border border-white/15 rounded-xl px-5 py-3 w-fit shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
                <svg className="w-4 h-4 text-white/70 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                <div>
                  <p className="text-white/90 text-xs font-semibold leading-none">Frescura garantizada</p>
                  <p className="text-white/40 text-[10px] mt-0.5">Cadena de frío de origen a puerta</p>
                </div>
              </div>

              {/* Estrellas flotantes */}
              <div className="mt-5 ml-12 flex items-center gap-1.5">
                {[1,2,3,4,5].map(i => (
                  <svg key={i} className="w-4 h-4 text-white/60" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
                <span className="text-white/40 text-[10px] ml-1 tracking-wide">+500 pedidos</span>
              </div>

            </div>
          </div>
        </div>

        {/* Stats bar */}
        <div className="absolute bottom-0 left-0 right-0 z-10">
          {/* Línea decorativa superior */}
          <div className="h-px bg-gradient-to-r from-transparent via-brand-red/60 to-transparent" />
          <div className="bg-dark-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-2 md:grid-cols-4">

                {/* 15+ Años */}
                <div className="group py-7 px-4 text-center border-r border-b md:border-b-0 border-white/20 hover:bg-white/[0.05] transition-colors duration-300">
                  <span className="block w-5 h-0.5 bg-brand-red mx-auto mb-3 rounded-full transition-all duration-500 group-hover:w-12" />
                  <span className="block text-3xl lg:text-4xl font-display font-bold text-brand-red tracking-tight">15+</span>
                  <p className="text-white/75 text-[10px] uppercase tracking-[0.2em] mt-2 leading-relaxed">Años de Experiencia</p>
                </div>

                {/* 50+ Cortes */}
                <div className="group py-7 px-4 text-center border-b md:border-b-0 md:border-r border-white/20 hover:bg-white/[0.05] transition-colors duration-300">
                  <span className="block w-5 h-0.5 bg-brand-red mx-auto mb-3 rounded-full transition-all duration-500 group-hover:w-12" />
                  <span className="block text-3xl lg:text-4xl font-display font-bold text-brand-red tracking-tight">50+</span>
                  <p className="text-white/75 text-[10px] uppercase tracking-[0.2em] mt-2 leading-relaxed">Cortes Disponibles</p>
                </div>

                {/* 100% Calidad */}
                <div className="group py-7 px-4 text-center border-r border-white/20 hover:bg-white/[0.05] transition-colors duration-300">
                  <span className="block w-5 h-0.5 bg-white mx-auto mb-3 rounded-full transition-all duration-500 group-hover:w-12" />
                  <span className="block text-3xl lg:text-4xl font-display font-bold text-white tracking-tight">100%</span>
                  <p className="text-white/75 text-[10px] uppercase tracking-[0.2em] mt-2 leading-relaxed">Calidad Garantizada</p>
                </div>

                {/* WhatsApp */}
                <div className="group py-7 px-4 text-center hover:bg-white/[0.05] transition-colors duration-300">
                  <span className="block w-5 h-0.5 bg-green-400 mx-auto mb-3 rounded-full transition-all duration-500 group-hover:w-12" />
                  <svg
                    className="w-9 h-9 text-green-400 mx-auto transition-transform duration-300 group-hover:scale-110"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488" />
                  </svg>
                  <p className="text-white/75 text-[10px] uppercase tracking-[0.2em] mt-2 leading-relaxed">Atención por WhatsApp</p>
                </div>

              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========== CATEGORÍAS ========== */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14 reveal-on-scroll">
            <span className="text-brand-red font-semibold text-sm uppercase tracking-widest">Explora</span>
            <h2 className="text-3xl sm:text-4xl font-display font-bold text-gray-900 mt-2">
              Nuestras <span className="text-brand-red">Categorías</span>
            </h2>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 reveal-on-scroll stagger-children">
            {categorias.map(cat => (
              <Link
                key={cat.id}
                href={`/tienda?cat=${cat.id}`}
                className="group relative overflow-hidden rounded-2xl aspect-[3/4] cursor-pointer"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={cat.imagen} alt={cat.nombre} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" loading="lazy" />
                <div className="absolute inset-0 bg-gradient-to-t from-dark-900/90 via-dark-900/30 to-transparent" />
                <div className="absolute inset-0 bg-brand-red/0 group-hover:bg-brand-red/20 transition-colors duration-500" />
                <div className="absolute bottom-0 left-0 right-0 p-5">
                  <span className="text-2xl mb-2 block">{cat.icono}</span>
                  <h3 className="text-lg font-bold text-white mb-1">{cat.nombre}</h3>
                  <p className="text-white/70 text-sm">{cat.descripcion}</p>
                  <div className="mt-3 flex items-center gap-1 text-brand-red text-sm font-semibold opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                    Ver productos
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ========== PRODUCTOS DESTACADOS — CARRUSEL ========== */}
      <section className="py-20 bg-cream" id="productos">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between mb-14 reveal-on-scroll">
            <div>
              <span className="text-brand-red font-semibold text-sm uppercase tracking-widest">Selección</span>
              <h2 className="text-3xl sm:text-4xl font-display font-bold text-gray-900 mt-2">
                Productos <span className="text-brand-red">Destacados</span>
              </h2>
              <p className="text-gray-500 text-sm mt-1">12 productos seleccionados para ti cada visita</p>
            </div>
            <Link href="/tienda" className="text-brand-red font-semibold text-sm hover:underline mt-4 sm:mt-0 inline-flex items-center gap-1">
              Ver todos
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>

          <div className="reveal-on-scroll">
            <ProductosCarousel productos={todosLosProductos} total={12} />
          </div>
        </div>
      </section>

      {/* ========== BANNER PROMOCIONAL ========== */}
      {comboDestacado && (
        <section className="py-20 bg-dark-900 relative overflow-hidden">
          <div className="absolute inset-0 opacity-20">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={comboDestacado.imagen} alt="" className="w-full h-full object-cover" loading="lazy" />
          </div>
          <div className="absolute inset-0 bg-gradient-to-r from-dark-900 via-dark-900/95 to-dark-900/80" />

          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 items-center reveal-on-scroll">
              <div className="rounded-2xl overflow-hidden shadow-premium-xl">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={comboDestacado.imagen} alt={comboDestacado.nombre} className="w-full aspect-[4/3] object-cover" loading="lazy" />
              </div>
              <div>
                <span className="inline-flex items-center gap-2 bg-white/10 text-white border border-white/20 rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-wider mb-6">
                  <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  Combo Destacado
                </span>
                <h2 className="text-3xl sm:text-4xl font-display font-bold text-white mb-4">{comboDestacado.nombre}</h2>
                <p className="text-gray-400 text-lg leading-relaxed mb-6">{comboDestacado.descripcion}</p>
                <div className="flex items-center gap-4 mb-8">
                  <span className="text-gray-500 uppercase tracking-wider text-sm font-semibold">{UNIDAD_CORTA}</span>
                </div>
                <div className="flex flex-wrap gap-3">
                  <Link
                    href={`/producto/${comboDestacado.slug}`}
                    className="inline-flex items-center gap-2 bg-brand-red text-white px-8 py-3.5 rounded-full font-semibold hover:bg-brand-red-dark transition-all duration-300 shadow-red-glow"
                  >
                    Ver Detalles
                  </Link>
                  <AddToCartBtn
                    id={comboDestacado.id}
                    nombre={comboDestacado.nombre}
                    imagen={comboDestacado.imagen}
                    peso={comboDestacado.peso}
                    slug={comboDestacado.slug}
                    className="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-white px-8 py-3.5 rounded-full font-semibold hover:bg-white/20 transition-all duration-300"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ========== LA VITRINA: TRADICIONALES & ESPECIALES ========== */}
      <VitrinaSection tradicionales={tradicionales} especiales={especiales} cantidad={3} />

      {/* ========== POR QUÉ ELEGIRNOS ========== */}
      <section className="py-24 bg-cream relative overflow-hidden">
        {/* Textura de fondo sutil */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{ backgroundImage: 'radial-gradient(circle, #0a0a0a 1px, transparent 1px)', backgroundSize: '32px 32px' }}
        />
        {/* Acento lateral rojo */}
        <div className="absolute top-0 bottom-0 left-0 w-1 bg-gradient-to-b from-transparent via-brand-red/40 to-transparent" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-start">

            {/* ── Columna izquierda: titular editorial ── */}
            <div className="reveal-on-scroll lg:sticky lg:top-32">
              <div className="flex items-center gap-4 mb-8">
                <span className="block h-px w-10 bg-brand-red" />
                <span className="text-brand-red text-[10px] font-bold uppercase tracking-[0.3em]">Por qué elegirnos</span>
              </div>

              <h2 className="font-display font-bold text-gray-900 leading-[1.05] mb-8">
                <span className="block text-5xl sm:text-6xl lg:text-7xl">15 años</span>
                <span className="block text-3xl sm:text-4xl lg:text-5xl text-gray-400 mt-1">eligiendo</span>
                <span className="block text-3xl sm:text-4xl lg:text-5xl text-brand-red mt-1">lo mejor.</span>
              </h2>

              <p className="text-gray-500 text-base leading-relaxed max-w-sm">
                No es solo carne. Es el compromiso diario de quienes llevamos más de una década seleccionando cada corte como si fuera para nuestra propia mesa.
              </p>

              {/* Logo como marca de agua */}
              <div className="mt-12 select-none pointer-events-none" aria-hidden="true">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/Assets/Logo cc.png"
                  alt=""
                  className="w-56 opacity-[0.06] grayscale"
                />
              </div>
            </div>

            {/* ── Columna derecha: lista editorial numerada ── */}
            <div className="reveal-on-scroll stagger-children">
              {[
                {
                  num: '01',
                  titulo: 'Calidad Certificada',
                  desc: 'Cada corte pasa por un proceso de selección riguroso. Solo llega a tu mesa lo que cumple nuestros estándares.',
                  acento: 'text-brand-red',
                },
                {
                  num: '02',
                  titulo: 'Entrega Rápida',
                  desc: 'Domicilios en toda la ciudad. Tu pedido sale fresco y llega fresco — sin excusas.',
                  acento: 'text-gray-900',
                },
                {
                  num: '03',
                  titulo: 'Cadena de Frío Total',
                  desc: 'Controlamos la temperatura desde el origen hasta tu puerta. La frescura no es opcional.',
                  acento: 'text-brand-red',
                },
                {
                  num: '04',
                  titulo: 'Frescura Garantizada',
                  desc: 'Productos del día, siempre. Si no está fresco, no sale de nuestra cocina.',
                  acento: 'text-brand-red',
                },
              ].map((item) => (
                <div
                  key={item.num}
                  className="group flex gap-8 py-8 border-b border-gray-200 last:border-0 hover:border-gray-400 transition-colors duration-500 cursor-default"
                >
                  {/* Número */}
                  <span className={`font-display font-bold text-4xl leading-none shrink-0 tabular-nums transition-colors duration-300 ${item.acento} opacity-20 group-hover:opacity-100`}>
                    {item.num}
                  </span>

                  {/* Texto */}
                  <div className="pt-1">
                    <h3 className="font-bold text-gray-900 text-lg mb-2">
                      {item.titulo}
                    </h3>
                    <p className="text-gray-400 text-sm leading-relaxed group-hover:text-gray-600 transition-colors duration-300">
                      {item.desc}
                    </p>
                  </div>

                  {/* Flecha que aparece en hover */}
                  <div className="ml-auto shrink-0 pt-1 opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0 transition-all duration-300">
                    <svg className={`w-5 h-5 ${item.acento}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ========== TESTIMONIOS ========== */}
      <section className="py-24 bg-cream relative overflow-hidden">
        {/* Acento vertical rojo */}
        <div className="absolute top-0 bottom-0 left-0 w-1 bg-gradient-to-b from-transparent via-brand-red/40 to-transparent" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Encabezado */}
          <div className="flex items-center gap-4 mb-16 reveal-on-scroll">
            <span className="block h-px w-10 bg-brand-red shrink-0" />
            <span className="text-brand-red text-[10px] font-bold uppercase tracking-[0.3em]">Lo que dicen nuestros clientes</span>
          </div>

          {/* Layout asimétrico: quote principal + dos secundarios */}
          <div className="grid lg:grid-cols-5 gap-10 lg:gap-16 items-start reveal-on-scroll">

            {/* ── Quote principal (ocupa 3 columnas) ── */}
            <div className="lg:col-span-3">
              {/* Comilla decorativa */}
              <span className="block font-display text-[96px] leading-none text-brand-red/20 select-none -mb-6" aria-hidden="true">
                &ldquo;
              </span>
              <blockquote>
                <p className="font-display text-2xl sm:text-3xl text-gray-900 leading-[1.3] font-medium">
                  {testimonios[0].texto}
                </p>
                <footer className="mt-8 flex items-center gap-4">
                  <div className="w-10 h-px bg-brand-red shrink-0" />
                  <div>
                    <p className="font-bold text-gray-900 text-sm">{testimonios[0].nombre}</p>
                    <p className="text-gray-400 text-xs mt-0.5 uppercase tracking-widest">Cliente frecuente</p>
                  </div>
                </footer>
              </blockquote>
            </div>

            {/* ── Quotes secundarios (2 columnas) ── */}
            <div className="lg:col-span-2 flex flex-col gap-8 lg:pt-8">
              {testimonios.slice(1).map((t, i) => (
                <div key={t.nombre} className="relative pl-6 border-l-2 border-brand-red/30">
                  <p className="text-gray-600 text-sm leading-relaxed italic">
                    &ldquo;{t.texto}&rdquo;
                  </p>
                  <footer className="mt-4 flex items-center gap-3">
                    <div className="w-6 h-px shrink-0 bg-brand-red/50" />
                    <div>
                      <p className="font-bold text-gray-900 text-xs">{t.nombre}</p>
                      <p className="text-gray-400 text-[10px] mt-0.5 uppercase tracking-widest">Cliente verificado</p>
                    </div>
                  </footer>
                </div>
              ))}

              {/* Número decorativo */}
              <div className="mt-4 pt-8 border-t border-gray-200">
                <p className="text-[10px] text-gray-400 uppercase tracking-[0.2em] mb-1">Satisfacción</p>
                <p className="font-display font-bold text-5xl text-gray-900">98<span className="text-brand-red text-3xl">%</span></p>
                <p className="text-gray-400 text-xs mt-1">de clientes repiten su pedido</p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ========== CTA FINAL ========== */}
      <section className="py-28 bg-dark-900 relative overflow-hidden">
        {/* Imagen de fondo con overlay fuerte */}
        <div className="absolute inset-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://images.unsplash.com/photo-1544025162-d76694265947?w=1400&q=80"
            alt=""
            className="w-full h-full object-cover opacity-20"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-dark-900 via-dark-900/80 to-dark-900/60" />
        </div>

        {/* Línea roja superior */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-brand-red/60 to-transparent" />

        {/* Orbe decorativo */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand-red/5 rounded-full blur-[120px] pointer-events-none" />

        <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center reveal-on-scroll">

          {/* Ornamento */}
          <div className="flex items-center justify-center gap-4 mb-8">
            <span className="block h-px w-12 bg-gradient-to-r from-transparent to-white/25" />
            <span className="text-white/50 text-[10px] font-bold uppercase tracking-[0.3em]">Tu mesa te espera</span>
            <span className="block h-px w-12 bg-gradient-to-l from-transparent to-white/25" />
          </div>

          <h2 className="font-display font-bold text-white leading-[1.05] mb-6">
            <span className="block text-4xl sm:text-5xl lg:text-6xl">¿Listo para el mejor</span>
            <span className="block text-4xl sm:text-5xl lg:text-6xl text-brand-red mt-1">corte de tu vida?</span>
          </h2>

          <p className="text-white/50 text-lg mb-12 max-w-xl mx-auto leading-relaxed">
            Haz tu pedido ahora y recibe en la puerta de tu casa la selección que llevan 15 años perfeccionando.
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/tienda"
              className="inline-flex items-center gap-2.5 bg-brand-red text-white px-10 py-4 rounded-full font-bold text-base hover:bg-brand-red-dark transition-all duration-300 hover:-translate-y-0.5 shadow-red-glow"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              Explorar la Tienda
            </Link>
            <a
              href="https://wa.me/5573001234567"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2.5 bg-white/10 backdrop-blur-sm border border-white/20 text-white px-10 py-4 rounded-full font-bold text-base hover:bg-white/20 transition-all duration-300 hover:-translate-y-0.5"
            >
              {whatsappSvg}
              Pedir por WhatsApp
            </a>
          </div>
        </div>

        {/* Línea inferior */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      </section>
    </>
  );
}
