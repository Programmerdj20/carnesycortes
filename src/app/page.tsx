import Link from 'next/link';
import { getProductos } from '@/lib/productos';
import ProductCard from '@/components/ProductCard';
import TestimonialCard from '@/components/TestimonialCard';
import AddToCartBtn from '@/components/AddToCartBtn';

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

export default function HomePage() {
  const todosLosProductos = getProductos();
  const productosDestacados = todosLosProductos.filter(p => p.destacado);
  const comboDestacado = todosLosProductos.find(p => p.slug === 'parrillada-ejecutiva');

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
            <div className="hidden lg:block" />
          </div>
        </div>

        {/* Stats bar */}
        <div className="absolute bottom-0 left-0 right-0 z-10">
          <div className="bg-brand-red">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-white/20">
                {[
                  { valor: '15+', label: 'Años de Experiencia' },
                  { valor: '50+', label: 'Cortes Disponibles' },
                  { valor: '100%', label: 'Calidad Garantizada' },
                  { valor: '24/7', label: 'Atención al Cliente' },
                ].map(stat => (
                  <div key={stat.label} className="py-6 text-center">
                    <span className="text-3xl lg:text-4xl font-display font-bold text-white">{stat.valor}</span>
                    <p className="text-white/80 text-sm mt-1">{stat.label}</p>
                  </div>
                ))}
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

      {/* ========== PRODUCTOS DESTACADOS ========== */}
      <section className="py-20 bg-cream" id="productos">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between mb-14 reveal-on-scroll">
            <div>
              <span className="text-brand-red font-semibold text-sm uppercase tracking-widest">Selección</span>
              <h2 className="text-3xl sm:text-4xl font-display font-bold text-gray-900 mt-2">
                Productos <span className="text-brand-red">Destacados</span>
              </h2>
            </div>
            <Link href="/tienda" className="text-brand-red font-semibold text-sm hover:underline mt-4 sm:mt-0 inline-flex items-center gap-1">
              Ver todos
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 reveal-on-scroll stagger-children">
            {productosDestacados.map(producto => (
              <ProductCard key={producto.id} {...producto} />
            ))}
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
                <span className="inline-flex items-center gap-2 bg-gold/20 text-gold border border-gold/30 rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-wider mb-6">
                  <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  Combo Destacado
                </span>
                <h2 className="text-3xl sm:text-4xl font-display font-bold text-white mb-4">{comboDestacado.nombre}</h2>
                <p className="text-gray-400 text-lg leading-relaxed mb-6">{comboDestacado.descripcion}</p>
                <div className="flex items-center gap-4 mb-8">
                  <span className="text-4xl font-display font-bold text-brand-red">${comboDestacado.precio.toLocaleString('es-CO')}</span>
                  <span className="text-gray-500">/ {comboDestacado.peso}</span>
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
                    precio={comboDestacado.precio}
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

      {/* ========== POR QUÉ ELEGIRNOS ========== */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14 reveal-on-scroll">
            <span className="text-brand-red font-semibold text-sm uppercase tracking-widest">Confianza</span>
            <h2 className="text-3xl sm:text-4xl font-display font-bold text-gray-900 mt-2">
              Por Qué <span className="text-brand-red">Elegirnos</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 reveal-on-scroll stagger-children">
            {[
              {
                icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />,
                titulo: 'Calidad Certificada',
                desc: 'Cortes seleccionados con los más altos estándares de calidad y frescura',
              },
              {
                icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />,
                titulo: 'Entrega Rápida',
                desc: 'Domicilios en toda la ciudad con cadena de frío garantizada',
              },
              {
                icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />,
                titulo: 'Control de Temperatura',
                desc: 'Mantenemos la cadena de frío desde el origen hasta tu puerta',
              },
              {
                icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />,
                titulo: 'Frescura Garantizada',
                desc: 'Productos frescos del día con la mejor selección del mercado',
              },
            ].map(item => (
              <div key={item.titulo} className="text-center p-8 rounded-2xl bg-cream border border-gray-100 hover:-translate-y-2 transition-all duration-300">
                <div className="w-16 h-16 bg-brand-red/10 rounded-2xl flex items-center justify-center mx-auto mb-5">
                  <svg className="w-8 h-8 text-brand-red" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    {item.icon}
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{item.titulo}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== TESTIMONIOS ========== */}
      <section className="py-20 bg-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14 reveal-on-scroll">
            <span className="text-brand-red font-semibold text-sm uppercase tracking-widest">Testimonios</span>
            <h2 className="text-3xl sm:text-4xl font-display font-bold text-gray-900 mt-2">
              Lo Que Dicen <span className="text-brand-red">Nuestros Clientes</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 reveal-on-scroll stagger-children">
            {testimonios.map(t => (
              <TestimonialCard key={t.nombre} nombre={t.nombre} texto={t.texto} rating={t.rating} />
            ))}
          </div>
        </div>
      </section>

      {/* ========== CTA FINAL ========== */}
      <section className="py-20 bg-brand-red relative overflow-hidden">
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center reveal-on-scroll">
          <h2 className="text-3xl sm:text-4xl font-display font-bold text-white mb-4">
            ¿Listo para probar los mejores cortes?
          </h2>
          <p className="text-white/90 text-lg mb-8 max-w-2xl mx-auto">
            Haz tu pedido ahora y recibe en la puerta de tu casa la mejor selección de carnes premium
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/tienda"
              className="inline-flex items-center gap-2 bg-white text-brand-red px-8 py-4 rounded-full font-bold text-lg hover:bg-cream transition-all duration-300 hover:-translate-y-0.5 shadow-xl"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              Ir a la Tienda
            </Link>
            <a
              href="https://wa.me/5573001234567"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-green-600 text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-green-500 transition-all duration-300 hover:-translate-y-0.5 shadow-xl"
            >
              {whatsappSvg}
              Pedir por WhatsApp
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
