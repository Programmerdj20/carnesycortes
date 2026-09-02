import 'server-only';
import { CATEGORIA_IDS, type CategoriaId } from './categorias';

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
  status: 'publish' | 'draft' | 'pending' | 'private' | 'future' | 'trash';
  catalog_visibility: 'visible' | 'catalog' | 'search' | 'hidden';
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

type CategoriaValida = CategoriaId;

// ─── Cliente HTTP ─────────────────────────────────────────────────────────────

function getAuthHeader(): string {
  const key = process.env.WOOCOMMERCE_CONSUMER_KEY!;
  const secret = process.env.WOOCOMMERCE_CONSUMER_SECRET!;
  return 'Basic ' + Buffer.from(`${key}:${secret}`).toString('base64');
}

// WooCommerce corre en el mismo servidor que Next, así que refrescar cada
// minuto es prácticamente gratis. Antes se usaba cache: 'force-cache' sin
// revalidate (caché permanente): un producto pasado a borrador en WooCommerce
// seguía sirviéndose desde el Data Cache indefinidamente hasta un rebuild
// manual. El tag 'productos' permite además invalidar al instante vía
// revalidateTag() desde un webhook (ver /api/revalidate).
const REVALIDATE_SEGUNDOS = 60;

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// WooCommerce vive en hosting compartido (PHP-FPM con muy pocos workers para
// ese vhost). Se comprobó que incluso 2 requests simultáneos ya lo tumban con
// 500, mientras que en serie decenas de requests seguidos nunca fallan. Por
// eso la defensa real es esta cola: nunca dejar salir más de una petición a
// la vez, sin importar cuánto paralelice `next build` la generación estática.
// Los reintentos con backoff son solo una red de seguridad adicional.
let colaWc: Promise<void> = Promise.resolve();
function encolar<T>(tarea: () => Promise<T>): Promise<T> {
  const resultado = colaWc.then(tarea, tarea);
  colaWc = resultado.then(() => undefined, () => undefined);
  return resultado;
}

const REINTENTOS = 5;
const ESPERA_BASE_MS = 1000;

async function wcFetch<T>(endpoint: string): Promise<T> {
  return encolar(() => wcFetchIntentos<T>(endpoint));
}

async function wcFetchIntentos<T>(endpoint: string): Promise<T> {
  const base = process.env.WOOCOMMERCE_URL;
  if (!base) throw new Error('Falta la variable de entorno WOOCOMMERCE_URL en .env.local');
  const url = `${base}/wp-json/wc/v3/${endpoint}`;

  for (let intento = 1; intento <= REINTENTOS; intento++) {
    try {
      const res = await fetch(url, {
        headers: { Authorization: getAuthHeader() },
        next: { revalidate: REVALIDATE_SEGUNDOS, tags: ['productos'] },
      });

      if (res.ok) return res.json() as Promise<T>;

      // Errores 4xx no se arreglan reintentando (URL/credenciales mal formadas).
      if (res.status < 500 || intento === REINTENTOS) {
        throw new Error(`WooCommerce API error ${res.status} en ${url}`);
      }
    } catch (err) {
      if (intento === REINTENTOS) throw err;
    }
    await sleep(ESPERA_BASE_MS * 2 ** (intento - 1));
  }

  throw new Error(`WooCommerce API: agotados los reintentos en ${url}`);
}

// Red de seguridad: aunque cada endpoint ya pide status=publish, filtramos
// aquí una última vez por si alguna consulta futura lo omite, y además
// descartamos productos publicados pero ocultos del catálogo en WooCommerce.
function soloPublicados(productos: WCProduct[]): WCProduct[] {
  return productos.filter(
    p => p.status === 'publish' && p.catalog_visibility !== 'hidden'
  );
}

// ─── Helpers de mapeo ─────────────────────────────────────────────────────────

const CATEGORIAS_VALIDAS: CategoriaValida[] = CATEGORIA_IDS;

// WooCommerce devuelve '' (string vacío) para campos numéricos personalizados
// que nunca se diligenciaron, en vez de null/undefined. `?? ` no lo detecta
// porque '' no es nullish, así que sin este filtro un producto sin datos
// termina con marmoleo: '' — que pasa el check `!= null` como si tuviera valor.
function numOrUndef(v: unknown): number | undefined {
  if (typeof v === 'number' && !Number.isNaN(v)) return v;
  if (typeof v === 'string' && v.trim() !== '' && !Number.isNaN(Number(v))) return Number(v);
  return undefined;
}

// Mismo problema para campos de texto: '' en vez de ausente.
function strOrUndef(v: unknown): string | undefined {
  if (typeof v === 'string' && v.trim() !== '') return v;
  return undefined;
}

function getMeta<T>(meta: WCMetaData[], key: string): T | undefined {
  const entry = meta.find(m => m.key === key);
  if (entry === undefined) return undefined;
  if (typeof entry.value === 'string') {
    try { return JSON.parse(entry.value) as T; } catch { /* no es JSON */ }
    return entry.value as unknown as T;
  }
  return entry.value as T;
}

// La categoría asignada en WooCommerce es la autoridad (coincide 1:1 con el
// slug de la taxonomía en src/lib/categorias.ts). cyc_badge queda solo como
// sello visual decorativo ("premium", "destacado"), ya no decide la categoría.
function mapCategoria(p: WCProduct): CategoriaValida {
  for (const cat of p.categories) {
    const slug = cat.slug.toLowerCase();
    if (CATEGORIAS_VALIDAS.includes(slug as CategoriaValida)) return slug as CategoriaValida;
  }
  const badge = p.cyc_badge ?? getMeta<string>(p.meta_data, 'cyc_badge');
  if (badge) {
    const norm = badge.toLowerCase() as CategoriaValida;
    if (CATEGORIAS_VALIDAS.includes(norm)) return norm;
  }
  return 'cortes-res';
}

function buildNutricion(p: WCProduct): Nutricion | undefined {
  // Campos individuales top-level tienen prioridad
  const calorias = numOrUndef(p.cyc_calorias);
  if (calorias != null) {
    return {
      calorias,
      proteinas: numOrUndef(p.cyc_proteina) ?? 0,
      grasas: numOrUndef(p.cyc_grasa_total) ?? 0,
      grasas_saturadas: numOrUndef(p.cyc_grasa_sat),
      hierro: numOrUndef(p.cyc_hierro),
      sodio: numOrUndef(p.cyc_sodio),
    };
  }
  // Fallback al objeto en meta_data
  return getMeta<Nutricion>(p.meta_data, 'cyc_nutricion');
}

function buildPreparacion(p: WCProduct): Preparacion | undefined {
  const metodoPrincipal = strOrUndef(p.cyc_metodo_principal) ?? getMeta<string>(p.meta_data, 'cyc_metodo_principal');
  if (metodoPrincipal) {
    const tempRaw = numOrUndef(p.cyc_temp_coccion) ?? getMeta<number>(p.meta_data, 'cyc_temp_coccion');
    const tipsRaw = strOrUndef(p.cyc_tips_coccion) ?? getMeta<string>(p.meta_data, 'cyc_tips_coccion');
    return {
      metodo: metodoPrincipal,
      tiempo: strOrUndef(p.cyc_tiempo_coccion) ?? getMeta<string>(p.meta_data, 'cyc_tiempo_coccion') ?? '',
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

  const maduracion = numOrUndef(p.cyc_maduracion) ?? getMeta<number>(p.meta_data, 'cyc_maduracion');
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
    badge: strOrUndef(p.cyc_badge) ?? getMeta<string>(p.meta_data, 'cyc_badge'),
    badge_secundario: badgeSecundario,
    nutricion: buildNutricion(p),
    preparacion: buildPreparacion(p),
    maridajes,
    origen: strOrUndef(p.cyc_origen) ?? getMeta<string>(p.meta_data, 'cyc_origen'),
    maduracion,
    grado: strOrUndef(p.cyc_grado) ?? getMeta<string>(p.meta_data, 'cyc_grado'),
    marmoleo: numOrUndef(p.cyc_marmoleo) ?? getMeta<number>(p.meta_data, 'cyc_marmoleo'),
    terneza: numOrUndef(p.cyc_terneza) ?? getMeta<number>(p.meta_data, 'cyc_terneza'),
    intensidad_sabor: numOrUndef(p.cyc_intensidad_sabor) ?? getMeta<number>(p.meta_data, 'cyc_intensidad_sabor'),
    metodos_coccion: metodosCoccion,
    metodo_principal: strOrUndef(p.cyc_metodo_principal) ?? getMeta<string>(p.meta_data, 'cyc_metodo_principal'),
    temp_coccion: numOrUndef(p.cyc_temp_coccion) ?? getMeta<number>(p.meta_data, 'cyc_temp_coccion'),
    tiempo_coccion: strOrUndef(p.cyc_tiempo_coccion) ?? getMeta<string>(p.meta_data, 'cyc_tiempo_coccion'),
    tips_coccion: strOrUndef(p.cyc_tips_coccion) ?? getMeta<string>(p.meta_data, 'cyc_tips_coccion'),
    related_ids: p.related_ids ?? [],
  };
}

// ─── Funciones públicas ───────────────────────────────────────────────────────

export async function fetchProductos(): Promise<WCProduct[]> {
  const productos = await wcFetch<WCProduct[]>('products?per_page=100&status=publish');
  return soloPublicados(productos);
}

export async function fetchProductoBySlug(slug: string): Promise<WCProduct | undefined> {
  const productos = await wcFetch<WCProduct[]>(
    `products?slug=${encodeURIComponent(slug)}&status=publish`
  );
  return soloPublicados(productos)[0];
}

export async function fetchProductosByIds(ids: number[]): Promise<WCProduct[]> {
  if (!ids.length) return [];
  const productos = await wcFetch<WCProduct[]>(
    `products?include=${ids.join(',')}&status=publish&per_page=${ids.length}`
  );
  return soloPublicados(productos);
}
