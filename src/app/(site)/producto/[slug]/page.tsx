import { notFound } from 'next/navigation';
import Link from 'next/link';
import {
  Flame,
  Thermometer,
  Clock,
  Lightbulb,
  Wine,
  MapPin,
  Timer,
  Beef,
  Award,
  ChevronRight,
  Zap,
  Droplets,
  Activity,
  Bean,
  FlameKindling,
} from 'lucide-react';
import { getProductoBySlug, getProductosByIds, getProductos } from '@/lib/productos';
import { getCategoria, nombreCategoria } from '@/lib/categorias';
import Breadcrumb from '@/components/Breadcrumb';
import ProductCard from '@/components/ProductCard';
import ProductoHero from '@/components/ProductoHero';
import CorteProfileBars from '@/components/CorteProfileBars';

// ─── Mapas ────────────────────────────────────────────────────────────────────

// Íconos SVG para métodos de cocción (Lucide no tiene todos)
function CookMethodIcon({ method }: { method: string }) {
  switch (method) {
    case 'parrilla':
    case 'bbq':
      return <FlameKindling size={18} />;
    case 'sartenHierro':
    case 'plancha':
      return <Beef size={18} />;
    case 'horno':
      return <Thermometer size={18} />;
    case 'frito':
      return <Zap size={18} />;
    case 'sancocho':
      return <Droplets size={18} />;
    case 'sous_vide':
      return <Activity size={18} />;
    default:
      return <Flame size={18} />;
  }
}

const METODO_LABEL: Record<string, string> = {
  parrilla:     'Parrilla',
  sartenHierro: 'Sartén de hierro',
  horno:        'Horno',
  plancha:      'Plancha',
  frito:        'Fritar',
  sancocho:     'Sancocho',
  bbq:          'BBQ / Asador',
  sous_vide:    'Sous Vide',
};

// ─── Metadata ─────────────────────────────────────────────────────────────────

export async function generateStaticParams() {
  const productos = await getProductos();
  return productos.map(p => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const producto = await getProductoBySlug(slug);
  if (!producto) return {};
  return {
    title: `${producto.nombre} — Carnes & Cortes`,
    description: producto.descripcion,
    openGraph: {
      images: producto.imagen ? [{ url: producto.imagen }] : [],
    },
  };
}

// ─── Página ───────────────────────────────────────────────────────────────────

export default async function ProductoPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const producto = await getProductoBySlug(slug);
  if (!producto) notFound();

  const categoriaInfo = getCategoria(producto.categoria);

  // Relacionados: por related_ids si existen, sino otros cortes de la misma categoría
  const todosLosProductos = await getProductos();
  const relacionados = await (async () => {
    if (producto.related_ids.length > 0) {
      const lista = await getProductosByIds(producto.related_ids.slice(0, 4));
      return lista.filter(p => p.id !== producto.id).slice(0, 4);
    }
    return todosLosProductos
      .filter(p => p.categoria === producto.categoria && p.id !== producto.id)
      .slice(0, 4);
  })();

  // Bloque cruzado: solo aplica a "Especiales" (única familia presente en ambos animales)
  const animalCruzado = categoriaInfo?.animal === 'res' ? 'cerdo' : categoriaInfo?.animal === 'cerdo' ? 'res' : null;
  const hayContraparteCruzada =
    animalCruzado != null &&
    (producto.categoria === 'cortes-especiales-res' || producto.categoria === 'cortes-especiales-cerdo');

  const label = nombreCategoria(producto.categoria, { largo: true });

  const tienePerfil = producto.marmoleo != null || producto.terneza != null || producto.intensidad_sabor != null;

  const tieneCoccion =
    (producto.metodos_coccion?.length ?? 0) > 0 || producto.metodo_principal != null;

  const tieneNutricion = producto.nutricion != null;

  return (
    <>
      {/* ── Breadcrumb ──────────────────────────────────────────────────── */}
      <div className="bg-dark-900 border-b border-white/5 pt-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <Breadcrumb
            items={[
              { label: 'Inicio', href: '/' },
              { label: 'Tienda', href: '/tienda' },
              { label, href: `/tienda?cat=${producto.categoria}` },
              { label: producto.nombre },
            ]}
          />
        </div>
      </div>

      {/* ── Hero + Galería ── (Client Component) ─────────────────────── */}
      <ProductoHero
        id={producto.id}
        nombre={producto.nombre}
        descripcion_corta={producto.descripcion}
        precio={producto.precio}
        peso={producto.peso}
        imagen={producto.imagen}
        galeria={producto.galeria}
        badge={producto.badge}
        badge_secundario={producto.badge_secundario}
        stock={producto.stock}
        origen={producto.origen}
        slug={producto.slug}
      />

      {/* ── Perfil del Corte + Cómo Cocinarlo ─────────────────────────── */}
      {(tienePerfil || tieneCoccion) && (
        <section className="bg-dark-900 py-16 border-t border-white/5">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className={`grid gap-6 ${tienePerfil && tieneCoccion ? 'lg:grid-cols-2' : 'max-w-2xl'}`}>

              {/* ── Perfil del Corte ─────────────────────────────────── */}
              {tienePerfil && (
                <div className="rounded-2xl bg-dark-800 border border-white/6 p-7">
                  {/* Header */}
                  <div className="flex items-center gap-3 mb-7">
                    <div className="w-9 h-9 rounded-xl bg-gold/10 border border-gold/15 flex items-center justify-center">
                      <Award size={17} className="text-gold" />
                    </div>
                    <div>
                      <h2 className="font-display text-lg font-bold text-white">Perfil del Corte</h2>
                      {producto.grado && (
                        <p className="text-gold text-xs font-medium tracking-widest uppercase mt-0.5">{producto.grado}</p>
                      )}
                    </div>
                  </div>

                  {/* Datos: Origen, Maduración, Grado */}
                  {(producto.origen || producto.maduracion != null || producto.grado) && (
                    <div className="grid grid-cols-3 gap-3 mb-8">
                      {producto.origen && (
                        <div className="bg-dark-700/40 border border-white/5 rounded-xl p-3.5 text-center">
                          <MapPin size={14} className="text-white/30 mx-auto mb-2" />
                          <p className="text-white/35 text-[10px] uppercase tracking-widest font-medium mb-1">Origen</p>
                          <p className="text-white/80 text-xs font-semibold leading-snug">{producto.origen}</p>
                        </div>
                      )}
                      {producto.maduracion != null && (
                        <div className="bg-dark-700/40 border border-white/5 rounded-xl p-3.5 text-center">
                          <Timer size={14} className="text-white/30 mx-auto mb-2" />
                          <p className="text-white/35 text-[10px] uppercase tracking-widest font-medium mb-1">Maduración</p>
                          <p className="text-white font-bold text-lg leading-none">
                            {producto.maduracion}
                            <span className="text-white/40 text-xs font-normal ml-1">días</span>
                          </p>
                        </div>
                      )}
                      {producto.grado && (
                        <div className="bg-dark-700/40 border border-white/5 rounded-xl p-3.5 text-center">
                          <Award size={14} className="text-gold/50 mx-auto mb-2" />
                          <p className="text-white/35 text-[10px] uppercase tracking-widest font-medium mb-1">Grado</p>
                          <p className="text-gold text-xs font-bold">{producto.grado}</p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Barras animadas */}
                  <CorteProfileBars
                    marmoleo={producto.marmoleo ?? 0}
                    terneza={producto.terneza ?? 0}
                    intensidad={producto.intensidad_sabor ?? 0}
                  />
                </div>
              )}

              {/* ── Cómo Cocinarlo ───────────────────────────────────── */}
              {tieneCoccion && (
                <div className="rounded-2xl bg-dark-800 border border-white/6 p-7">
                  {/* Header */}
                  <div className="flex items-center gap-3 mb-7">
                    <div className="w-9 h-9 rounded-xl bg-brand-red/10 border border-brand-red/15 flex items-center justify-center">
                      <Flame size={17} className="text-brand-red" />
                    </div>
                    <h2 className="font-display text-lg font-bold text-white">Cómo Cocinarlo</h2>
                  </div>

                  {/* Métodos */}
                  {(producto.metodos_coccion?.length ?? 0) > 0 && (
                    <div className="flex flex-wrap gap-2 mb-6">
                      {producto.metodos_coccion!.map(m => (
                        <span
                          key={m}
                          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-full bg-dark-700/50 border border-white/7 text-white/60 text-xs font-medium"
                        >
                          <span className="text-white/40">
                            <CookMethodIcon method={m} />
                          </span>
                          {METODO_LABEL[m] ?? m}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Detalles de cocción */}
                  <div className="space-y-3.5 mb-6">
                    {producto.metodo_principal && (
                      <div className="flex items-start gap-3.5">
                        <div className="w-8 h-8 rounded-lg bg-dark-700/60 border border-white/7 flex items-center justify-center flex-none mt-0.5">
                          <Beef size={14} className="text-white/40" />
                        </div>
                        <div>
                          <p className="text-white/35 text-[10px] uppercase tracking-widest font-medium mb-0.5">Método principal</p>
                          <p className="text-white/75 text-sm">{producto.metodo_principal}</p>
                        </div>
                      </div>
                    )}
                    {producto.temp_coccion != null && (
                      <div className="flex items-start gap-3.5">
                        <div className="w-8 h-8 rounded-lg bg-dark-700/60 border border-white/7 flex items-center justify-center flex-none mt-0.5">
                          <Thermometer size={14} className="text-white/40" />
                        </div>
                        <div>
                          <p className="text-white/35 text-[10px] uppercase tracking-widest font-medium mb-0.5">Temperatura interna</p>
                          <p className="text-white/75 text-sm">
                            {producto.temp_coccion}°C
                          </p>
                        </div>
                      </div>
                    )}
                    {producto.tiempo_coccion && (
                      <div className="flex items-start gap-3.5">
                        <div className="w-8 h-8 rounded-lg bg-dark-700/60 border border-white/7 flex items-center justify-center flex-none mt-0.5">
                          <Clock size={14} className="text-white/40" />
                        </div>
                        <div>
                          <p className="text-white/35 text-[10px] uppercase tracking-widest font-medium mb-0.5">Tiempo de cocción</p>
                          <p className="text-white/75 text-sm">{producto.tiempo_coccion}</p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Tips callout */}
                  {producto.tips_coccion && (
                    <div className="bg-white/3 border border-white/8 rounded-xl p-4 mb-6">
                      <div className="flex items-center gap-2 mb-2.5">
                        <Lightbulb size={14} className="text-gold" />
                        <p className="text-gold text-[10px] font-bold uppercase tracking-widest">Tips del chef</p>
                      </div>
                      <div className="space-y-1.5">
                        {producto.tips_coccion.split('\n').filter(Boolean).map((tip, i) => (
                          <p key={i} className="text-white/55 text-sm leading-relaxed">{tip}</p>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Maridaje */}
                  {(producto.maridajes?.length ?? 0) > 0 && (
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <Wine size={13} className="text-white/30" />
                        <p className="text-white/35 text-[10px] uppercase tracking-widest font-medium">Maridaje sugerido</p>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {producto.maridajes!.map(m => (
                          <span
                            key={m}
                            className="px-3 py-1.5 rounded-full text-xs font-medium bg-gold/8 border border-gold/15 text-gold/80"
                          >
                            {m}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* ── Información Nutricional ────────────────────────────────────── */}
      {tieneNutricion && (
        <section className="bg-dark-800 py-14 border-t border-white/5">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl">
              {/* Header */}
              <div className="flex items-center gap-3 mb-8">
                <div className="w-9 h-9 rounded-xl bg-white/5 border border-white/8 flex items-center justify-center">
                  <Activity size={16} className="text-white/50" />
                </div>
                <div>
                  <h2 className="font-display text-lg font-bold text-white">Información Nutricional</h2>
                  <p className="text-white/30 text-xs mt-0.5">Valores por 100g</p>
                </div>
              </div>

              {/* Grid 3×2 */}
              <div className="grid grid-cols-3 sm:grid-cols-3 gap-3">
                {[
                  {
                    label: 'Calorías',
                    value: producto.nutricion!.calorias,
                    unit: 'kcal',
                    icon: <Flame size={14} className="text-orange-400/70" />,
                  },
                  {
                    label: 'Proteína',
                    value: producto.nutricion!.proteinas,
                    unit: 'g',
                    icon: <Bean size={14} className="text-brand-red/70" />,
                  },
                  {
                    label: 'Grasa total',
                    value: producto.nutricion!.grasas,
                    unit: 'g',
                    icon: <Droplets size={14} className="text-amber-400/70" />,
                  },
                  ...(producto.nutricion!.grasas_saturadas != null
                    ? [{
                        label: 'Grasa sat.',
                        value: producto.nutricion!.grasas_saturadas!,
                        unit: 'g',
                        icon: <Droplets size={14} className="text-yellow-400/60" />,
                      }]
                    : []),
                  ...(producto.nutricion!.hierro != null
                    ? [{
                        label: 'Hierro',
                        value: producto.nutricion!.hierro!,
                        unit: 'mg',
                        icon: <Activity size={14} className="text-red-400/70" />,
                      }]
                    : []),
                  ...(producto.nutricion!.sodio != null
                    ? [{
                        label: 'Sodio',
                        value: producto.nutricion!.sodio!,
                        unit: 'mg',
                        icon: <Zap size={14} className="text-blue-400/60" />,
                      }]
                    : []),
                ].map(item => (
                  <div
                    key={item.label}
                    className="bg-dark-700/30 border border-white/5 rounded-xl p-4 flex flex-col items-center text-center gap-2"
                  >
                    <span>{item.icon}</span>
                    <div>
                      <p className="text-white font-bold text-xl leading-none tabular-nums">
                        {item.value}
                        <span className="text-white/35 text-xs font-normal ml-1">{item.unit}</span>
                      </p>
                      <p className="text-white/35 text-[11px] mt-1.5">{item.label}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ── Descripción completa ──────────────────────────────────────── */}
      {producto.descripcion_html && (
        <section className="bg-dark-900 py-14 border-t border-white/5">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl">
              <h2 className="font-display text-xl font-bold text-white mb-8">
                Sobre este corte
              </h2>
              <div
                className={[
                  'text-white/55 leading-relaxed text-sm',
                  '[&_p]:mb-4 [&_p:last-child]:mb-0',
                  '[&_strong]:text-white/80 [&_strong]:font-semibold',
                  '[&_h2]:text-white [&_h2]:font-display [&_h2]:text-lg [&_h2]:font-bold [&_h2]:mb-3 [&_h2]:mt-6',
                  '[&_h3]:text-white/80 [&_h3]:font-semibold [&_h3]:mb-2 [&_h3]:mt-4',
                  '[&_ul]:space-y-1.5 [&_ul]:mb-4 [&_li]:pl-4 [&_li]:relative',
                  '[&_li]:before:content-["—"] [&_li]:before:absolute [&_li]:before:left-0 [&_li]:before:text-white/20',
                ].join(' ')}
                dangerouslySetInnerHTML={{ __html: producto.descripcion_html }}
              />
            </div>
          </div>
        </section>
      )}

      {/* ── Productos relacionados ────────────────────────────────────── */}
      {relacionados.length > 0 && (
        <section className="bg-dark-800 py-16 border-t border-white/5">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Header */}
            <div className="flex items-end justify-between mb-10">
              <div>
                <p className="text-brand-red text-xs font-bold uppercase tracking-widest mb-2">
                  También te puede interesar
                </p>
                <h2 className="font-display text-2xl sm:text-3xl font-bold text-white">
                  Otros cortes de esta categoría
                </h2>
              </div>
              <Link
                href={`/tienda?cat=${producto.categoria}`}
                className="hidden sm:inline-flex items-center gap-1.5 text-white/35 hover:text-white/70 text-sm transition-colors"
              >
                Ver más
                <ChevronRight size={15} />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {relacionados.map(p => (
                <ProductCard key={p.id} {...p} />
              ))}
            </div>

            {/* Bloque cruzado: Especiales de Res <-> Especiales de Cerdo */}
            {hayContraparteCruzada && (
              <Link
                href={`/tienda?animal=${animalCruzado}`}
                className="mt-6 flex items-center justify-between gap-4 rounded-2xl bg-dark-700/50 border border-white/8 px-6 py-5 hover:border-gold/30 transition-colors group"
              >
                <p className="text-white/60 text-sm">
                  También tenemos <span className="text-white font-semibold capitalize">cortes especiales de {animalCruzado}</span>
                </p>
                <ChevronRight size={16} className="text-white/30 group-hover:text-gold group-hover:translate-x-1 transition-all" />
              </Link>
            )}
          </div>
        </section>
      )}
    </>
  );
}
