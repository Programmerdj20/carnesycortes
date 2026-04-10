import 'server-only';

// ─── Tipos crudos de la API de WooCommerce ────────────────────────────────────

interface WCImage {
  src: string;
  alt: string;
}

interface WCCategory {
  id: number;
  name: string;
  slug: string;
}

interface WCAttribute {
  name: string;
  options: string[];
}

interface WCMetaData {
  key: string;
  value: unknown;
}

export interface WCGaleriaItem {
  url: string;
  alt: string;
}

export interface WCProduct {
  id: number;
  name: string;
  slug: string;
  description: string;
  short_description: string;
  price: string;
  regular_price: string;
  featured: boolean;
  stock_status: 'instock' | 'outofstock' | 'onbackorder';
  images: WCImage[];
  categories: WCCategory[];
  attributes: WCAttribute[];
  meta_data: WCMetaData[];
  related_ids: number[];
  // Campos personalizados CYC (top-level vía plugin WooCommerce)
  cyc_imagen_principal?: string;
  cyc_galeria?: WCGaleriaItem[];
  cyc_badge?: string;
  cyc_badge_secundario?: string;
  cyc_peso_presentacion?: string;
  cyc_en_stock?: string;
  cyc_origen?: string;
  cyc_maduracion?: number;
  cyc_grado?: string;
  cyc_marmoleo?: number;
  cyc_terneza?: number;
  cyc_intensidad_sabor?: number;
  cyc_metodos_coccion?: string[];
  cyc_metodo_principal?: string;
  cyc_temp_coccion?: number;
  cyc_tiempo_coccion?: string;
  cyc_tips_coccion?: string;
  cyc_maridaje?: string;
  cyc_calorias?: number;
  cyc_proteina?: number;
  cyc_grasa_total?: number;
  cyc_grasa_sat?: number;
  cyc_hierro?: number;
  cyc_sodio?: number;
  cyc_combo_personas?: number | null;
  cyc_combo_incluye?: string | null;
  cyc_combo_ocasion?: string | null;
}

// Tipos compartidos — espejo de los de productos.ts para evitar importación circular
interface Nutricion {
  calorias: number;
  proteinas: number;
  grasas: number;
  grasas_saturadas?: number;
  hierro?: number;
  sodio?: number;
}

interface Preparacion {
  metodo: string;
  tiempo: string;
  temperatura: string;
  tips?: string[];
}

type CategoriaValida = 'premium' | 'tradicional' | 'combo' | 'especial' | 'especialidad';

// ─── Cliente HTTP ─────────────────────────────────────────────────────────────

function getAuthHeader(): string {
  const key = process.env.WOOCOMMERCE_CONSUMER_KEY!;
  const secret = process.env.WOOCOMMERCE_CONSUMER_SECRET!;
  return 'Basic ' + Buffer.from(`${key}:${secret}`).toString('base64');
}

async function wcFetch<T>(endpoint: string): Promise<T> {
  const base = process.env.WOOCOMMERCE_URL!;
  const url = `${base}/wp-json/wc/v3/${endpoint}`;

  const res = await fetch(url, {
    headers: { Authorization: getAuthHeader() },
    // force-cache: Next.js deduplica durante el build y genera páginas estáticas
    cache: 'force-cache',
  });

  if (!res.ok) {
    throw new Error(`WooCommerce API error ${res.status} en ${url}`);
  }

  return res.json() as Promise<T>;
}

// ─── Helpers de mapeo ─────────────────────────────────────────────────────────

const CATEGORIAS_VALIDAS: CategoriaValida[] = ['premium', 'tradicional', 'combo', 'especial', 'especialidad'];

const CATEGORIA_MAP: Record<string, CategoriaValida> = {
  'premium': 'premium',
  'cortes-premium': 'premium',
  'tradicional': 'tradicional',
  'cortes-tradicionales': 'tradicional',
  'combo': 'combo',
  'combos': 'combo',
  'especial': 'especial',
  'especiales': 'especial',
  'especialidad': 'especialidad',
  'especialidades': 'especialidad',
};

function getMeta<T>(meta: WCMetaData[], key: string): T | undefined {
  const entry = meta.find(m => m.key === key);
  if (entry === undefined) return undefined;
  if (typeof entry.value === 'string') {
    try { return JSON.parse(entry.value) as T; } catch { /* no es JSON */ }
    return entry.value as unknown as T;
  }
  return entry.value as T;
}

function mapCategoria(p: WCProduct): CategoriaValida {
  const badge = p.cyc_badge ?? getMeta<string>(p.meta_data, 'cyc_badge');
  if (badge) {
    const norm = badge.toLowerCase() as CategoriaValida;
    if (CATEGORIAS_VALIDAS.includes(norm)) return norm;
  }
  for (const cat of p.categories) {
    const mapped = CATEGORIA_MAP[cat.slug.toLowerCase()];
    if (mapped) return mapped;
  }
  return 'tradicional';
}

function buildNutricion(p: WCProduct): Nutricion | undefined {
  // Campos individuales top-level tienen prioridad
  if (p.cyc_calorias != null) {
    return {
      calorias: p.cyc_calorias,
      proteinas: p.cyc_proteina ?? 0,
      grasas: p.cyc_grasa_total ?? 0,
      grasas_saturadas: p.cyc_grasa_sat,
      hierro: p.cyc_hierro,
      sodio: p.cyc_sodio,
    };
  }
  // Fallback al objeto en meta_data
  return getMeta<Nutricion>(p.meta_data, 'cyc_nutricion');
}

function buildPreparacion(p: WCProduct): Preparacion | undefined {
  const metodoPrincipal = p.cyc_metodo_principal ?? getMeta<string>(p.meta_data, 'cyc_metodo_principal');
  if (metodoPrincipal) {
    const tempRaw = p.cyc_temp_coccion ?? getMeta<number>(p.meta_data, 'cyc_temp_coccion');
    const tipsRaw = p.cyc_tips_coccion ?? getMeta<string>(p.meta_data, 'cyc_tips_coccion');
    return {
      metodo: metodoPrincipal,
      tiempo: p.cyc_tiempo_coccion ?? getMeta<string>(p.meta_data, 'cyc_tiempo_coccion') ?? '',
      temperatura: tempRaw != null ? `${tempRaw}°C` : '',
      tips: tipsRaw ? tipsRaw.split('\n').map(t => t.trim()).filter(Boolean) : [],
    };
  }
  return getMeta<Preparacion>(p.meta_data, 'cyc_preparacion');
}

// ─── Mapeador principal ───────────────────────────────────────────────────────

export function wcProductoToProducto(p: WCProduct) {
  const precio = parseFloat(p.price || p.regular_price || '0');

  const imagen =
    p.cyc_imagen_principal ??
    getMeta<string>(p.meta_data, 'cyc_imagen_principal') ??
    p.images?.[0]?.src ??
    '';

  const galeria: WCGaleriaItem[] =
    p.cyc_galeria ??
    getMeta<WCGaleriaItem[]>(p.meta_data, 'cyc_galeria') ??
    [];

  const peso =
    p.cyc_peso_presentacion ??
    getMeta<string>(p.meta_data, 'cyc_peso_presentacion') ??
    '';

  const descripcion = (p.short_description || p.description)
    .replace(/<[^>]+>/g, '')
    .trim();

  const stockMeta = p.cyc_en_stock ?? getMeta<string>(p.meta_data, 'cyc_en_stock');
  const stock = stockMeta ? stockMeta === 'disponible' : p.stock_status === 'instock';

  const badgeSecundario = p.cyc_badge_secundario ?? getMeta<string>(p.meta_data, 'cyc_badge_secundario');
  const destacado = badgeSecundario === 'destacado' || p.featured;

  // Maridajes: string separado por coma top-level, o array en meta
  const maridajeStr = p.cyc_maridaje ?? getMeta<string>(p.meta_data, 'cyc_maridaje');
  const maridajes = maridajeStr
    ? maridajeStr.split(',').map(m => m.trim()).filter(Boolean)
    : getMeta<string[]>(p.meta_data, 'cyc_maridajes');

  const maduracion = p.cyc_maduracion ?? getMeta<number>(p.meta_data, 'cyc_maduracion');
  const metodosCoccion = p.cyc_metodos_coccion ?? getMeta<string[]>(p.meta_data, 'cyc_metodos_coccion');

  return {
    id: p.id,
    nombre: p.name,
    slug: p.slug,
    descripcion,
    descripcion_html: p.description || undefined,
    precio,
    imagen,
    galeria,
    categoria: mapCategoria(p) as CategoriaValida,
    peso,
    destacado,
    stock,
    badge: p.cyc_badge ?? getMeta<string>(p.meta_data, 'cyc_badge'),
    badge_secundario: badgeSecundario,
    nutricion: buildNutricion(p),
    preparacion: buildPreparacion(p),
    maridajes,
    origen: p.cyc_origen ?? getMeta<string>(p.meta_data, 'cyc_origen'),
    maduracion,
    grado: p.cyc_grado ?? getMeta<string>(p.meta_data, 'cyc_grado'),
    marmoleo: p.cyc_marmoleo ?? getMeta<number>(p.meta_data, 'cyc_marmoleo'),
    terneza: p.cyc_terneza ?? getMeta<number>(p.meta_data, 'cyc_terneza'),
    intensidad_sabor: p.cyc_intensidad_sabor ?? getMeta<number>(p.meta_data, 'cyc_intensidad_sabor'),
    metodos_coccion: metodosCoccion,
    metodo_principal: p.cyc_metodo_principal ?? getMeta<string>(p.meta_data, 'cyc_metodo_principal'),
    temp_coccion: p.cyc_temp_coccion ?? getMeta<number>(p.meta_data, 'cyc_temp_coccion'),
    tiempo_coccion: p.cyc_tiempo_coccion ?? getMeta<string>(p.meta_data, 'cyc_tiempo_coccion'),
    tips_coccion: p.cyc_tips_coccion ?? getMeta<string>(p.meta_data, 'cyc_tips_coccion'),
    related_ids: p.related_ids ?? [],
  };
}

// ─── Funciones públicas ───────────────────────────────────────────────────────

export async function fetchProductos(): Promise<WCProduct[]> {
  return wcFetch<WCProduct[]>('products?per_page=100&status=publish');
}

export async function fetchProductoBySlug(slug: string): Promise<WCProduct | undefined> {
  const productos = await wcFetch<WCProduct[]>(
    `products?slug=${encodeURIComponent(slug)}&status=publish`
  );
  return productos[0];
}

export async function fetchProductosByIds(ids: number[]): Promise<WCProduct[]> {
  if (!ids.length) return [];
  return wcFetch<WCProduct[]>(
    `products?include=${ids.join(',')}&status=publish&per_page=${ids.length}`
  );
}
