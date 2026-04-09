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

// Mapeo de slugs de categoría WooCommerce → categorías internas
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
  // 1. El badge propio del producto tiene prioridad
  const badge = getMeta<string>(p.meta_data, 'cyc_badge');
  if (badge) {
    const norm = badge.toLowerCase() as CategoriaValida;
    if (CATEGORIAS_VALIDAS.includes(norm)) return norm;
  }
  // 2. Categorías WooCommerce
  for (const cat of p.categories) {
    const mapped = CATEGORIA_MAP[cat.slug.toLowerCase()];
    if (mapped) return mapped;
  }
  return 'tradicional';
}

// ─── Mapeador principal ───────────────────────────────────────────────────────

export function wcProductoToProducto(p: WCProduct) {
  const precio = parseFloat(p.price || p.regular_price || '0');

  // Imagen: meta personalizado primero, luego campo estándar WC
  const imagen =
    getMeta<string>(p.meta_data, 'cyc_imagen_principal') ??
    p.images?.[0]?.src ??
    '';

  // Peso desde meta personalizado
  const peso = getMeta<string>(p.meta_data, 'cyc_peso_presentacion') ?? '';

  // Descripción: short primero, limpiando HTML
  const descripcion = (p.short_description || p.description)
    .replace(/<[^>]+>/g, '')
    .trim();

  // Stock: si hay meta propio usarlo, si no el campo estándar WC
  const stockMeta = getMeta<string>(p.meta_data, 'cyc_en_stock');
  const stock = stockMeta
    ? stockMeta === 'disponible'
    : p.stock_status === 'instock';

  // Destacado: badge secundario o campo featured de WC
  const badgeSecundario = getMeta<string>(p.meta_data, 'cyc_badge_secundario');
  const destacado = badgeSecundario === 'destacado' || p.featured;

  return {
    id: p.id,
    nombre: p.name,
    slug: p.slug,
    descripcion,
    precio,
    imagen,
    categoria: mapCategoria(p) as CategoriaValida,
    peso,
    destacado,
    stock,
    // Campos enriquecidos — se agregan en WC con sus meta keys
    nutricion: getMeta<Nutricion>(p.meta_data, 'cyc_nutricion'),
    preparacion: getMeta<Preparacion>(p.meta_data, 'cyc_preparacion'),
    maridajes: getMeta<string[]>(p.meta_data, 'cyc_maridajes'),
    origen: getMeta<string>(p.meta_data, 'cyc_origen'),
    maduracion: getMeta<string>(p.meta_data, 'cyc_maduracion'),
    grado: getMeta<string>(p.meta_data, 'cyc_grado'),
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
