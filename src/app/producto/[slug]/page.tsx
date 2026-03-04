import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getProductos, getProductoBySlug } from '@/lib/productos';
import Breadcrumb from '@/components/Breadcrumb';
import NutritionTable from '@/components/NutritionTable';
import ProductCard from '@/components/ProductCard';
import ProductoAddToCart from '@/components/ProductoAddToCart';

const categoriaLabel: Record<string, string> = {
  premium: 'Premium',
  tradicional: 'Tradicional',
  combo: 'Combo',
  especial: 'Especial',
  especialidad: 'Especialidad',
};

export async function generateStaticParams() {
  const productos = getProductos();
  return productos.map(p => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const producto = getProductoBySlug(slug);
  if (!producto) return {};
  return {
    title: `${producto.nombre} - Carnes & Cortes`,
    description: producto.descripcion,
  };
}

export default async function ProductoPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const producto = getProductoBySlug(slug);
  if (!producto) notFound();

  const todosLosProductos = getProductos();
  const relacionados = todosLosProductos
    .filter(p => p.categoria === producto.categoria && p.id !== producto.id)
    .slice(0, 4);

  const label = categoriaLabel[producto.categoria] || producto.categoria;
  const whatsappMsg = encodeURIComponent(
    `Hola, me interesa el ${producto.nombre} ($${producto.precio.toLocaleString('es-CO')}). ¿Podrían darme más información?`
  );

  return (
    <>
      {/* Breadcrumb */}
      <section className="bg-dark-900 pt-28 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumb items={[
            { label: 'Inicio', href: '/' },
            { label: 'Tienda', href: '/tienda' },
            { label, href: `/tienda?cat=${producto.categoria}` },
            { label: producto.nombre },
          ]} />
        </div>
      </section>

      {/* Producto principal */}
      <section className="bg-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Imagen */}
            <div className="space-y-4">
              <div className="aspect-square rounded-2xl overflow-hidden bg-gray-100">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={producto.imagen}
                  alt={producto.nombre}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Info */}
            <div className="flex flex-col">
              <div className="flex items-center gap-3 mb-4">
                <span className="bg-brand-red/10 text-brand-red px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                  {label}
                </span>
                {producto.stock && (
                  <span className="bg-green-50 text-green-600 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                    En Stock
                  </span>
                )}
              </div>

              <h1 className="text-3xl sm:text-4xl font-display font-bold text-gray-900 mb-2">{producto.nombre}</h1>
              <div className="flex items-baseline gap-3 mb-6">
                <span className="text-3xl font-bold text-brand-red">${producto.precio.toLocaleString('es-CO')}</span>
                <span className="text-gray-400 text-sm">/ {producto.peso}</span>
              </div>

              <p className="text-gray-600 leading-relaxed mb-8">{producto.descripcion}</p>

              {/* Características */}
              <div className="grid grid-cols-2 gap-4 mb-8">
                {producto.origen && (
                  <div className="bg-gray-50 rounded-xl p-4">
                    <span className="text-xs text-gray-500 uppercase tracking-wider">Origen</span>
                    <p className="font-semibold text-gray-900 text-sm mt-1">{producto.origen}</p>
                  </div>
                )}
                {producto.maduracion && (
                  <div className="bg-gray-50 rounded-xl p-4">
                    <span className="text-xs text-gray-500 uppercase tracking-wider">Maduración</span>
                    <p className="font-semibold text-gray-900 text-sm mt-1">{producto.maduracion}</p>
                  </div>
                )}
                {producto.grado && (
                  <div className="bg-gray-50 rounded-xl p-4">
                    <span className="text-xs text-gray-500 uppercase tracking-wider">Grado</span>
                    <p className="font-semibold text-gray-900 text-sm mt-1">{producto.grado}</p>
                  </div>
                )}
                <div className="bg-gray-50 rounded-xl p-4">
                  <span className="text-xs text-gray-500 uppercase tracking-wider">Peso</span>
                  <p className="font-semibold text-gray-900 text-sm mt-1">{producto.peso}</p>
                </div>
              </div>

              {/* Add to cart (client) */}
              <ProductoAddToCart
                id={producto.id}
                nombre={producto.nombre}
                precio={producto.precio}
                imagen={producto.imagen}
                peso={producto.peso}
                slug={producto.slug}
              />

              {/* WhatsApp directo */}
              <a
                href={`https://wa.me/5573001234567?text=${whatsappMsg}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 bg-green-600 text-white py-3 px-6 rounded-full font-semibold hover:bg-green-500 transition-all duration-300"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488" />
                </svg>
                Consultar por WhatsApp
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Detalles adicionales */}
      <section className="bg-cream py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Preparación */}
            {producto.preparacion && (
              <div className="bg-white rounded-2xl p-6 shadow-premium-sm">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <svg className="w-5 h-5 text-brand-red" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
                  </svg>
                  Preparación Recomendada
                </h3>
                <div className="space-y-3">
                  {[
                    { label: 'Método', value: producto.preparacion.metodo, iconPath: 'M13 10V3L4 14h7v7l9-11h-7z' },
                    { label: 'Tiempo', value: producto.preparacion.tiempo, iconPath: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' },
                    { label: 'Temperatura', value: producto.preparacion.temperatura, iconPath: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' },
                  ].map(item => (
                    <div key={item.label} className="flex items-start gap-3">
                      <span className="w-8 h-8 bg-brand-red/10 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                        <svg className="w-4 h-4 text-brand-red" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.iconPath} />
                        </svg>
                      </span>
                      <div>
                        <span className="font-semibold text-gray-900 text-sm">{item.label}</span>
                        <p className="text-gray-600 text-sm">{item.value}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {producto.preparacion.tips && producto.preparacion.tips.length > 0 && (
                  <div className="mt-5 pt-5 border-t border-gray-100">
                    <h4 className="font-semibold text-gray-900 text-sm mb-3">Tips:</h4>
                    <ul className="space-y-2">
                      {producto.preparacion.tips.map((tip, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                          <svg className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          {tip}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {/* Nutrición */}
            {producto.nutricion && <NutritionTable nutricion={producto.nutricion} />}
          </div>

          {/* Maridajes */}
          {producto.maridajes && producto.maridajes.length > 0 && (
            <div className="mt-8 bg-white rounded-2xl p-6 shadow-premium-sm">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <svg className="w-5 h-5 text-brand-red" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
                Maridajes Recomendados
              </h3>
              <div className="flex flex-wrap gap-2">
                {producto.maridajes.map(m => (
                  <span key={m} className="px-4 py-2 bg-brand-red/5 text-brand-red rounded-full text-sm font-medium border border-brand-red/10">
                    {m}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Productos relacionados */}
      {relacionados.length > 0 && (
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-end justify-between mb-10">
              <div>
                <span className="text-brand-red font-semibold text-sm uppercase tracking-widest">También te puede interesar</span>
                <h2 className="text-2xl sm:text-3xl font-display font-bold text-gray-900 mt-2">Productos Relacionados</h2>
              </div>
              <Link
                href={`/tienda?cat=${producto.categoria}`}
                className="text-brand-red font-semibold text-sm hover:underline hidden sm:inline-flex items-center gap-1"
              >
                Ver más
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relacionados.map(p => (
                <ProductCard key={p.id} {...p} />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
