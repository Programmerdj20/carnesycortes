import {
  fetchProductos,
  fetchProductoBySlug,
  fetchProductosByIds,
  wcProductoToProducto,
  type WCGaleriaItem,
} from './woocommerce';
import type { CategoriaId } from './categorias';

export interface Nutricion {
  calorias: number;
  proteinas: number;
  grasas: number;
  grasas_saturadas?: number;
  hierro?: number;
  sodio?: number;
}

export interface Preparacion {
  metodo: string;
  tiempo: string;
  temperatura: string;
  tips?: string[];
}

export interface Producto {
  id: number;
  nombre: string;
  descripcion: string;
  descripcion_html?: string;
  precio: number;
  imagen: string;
  galeria: WCGaleriaItem[];
  categoria: CategoriaId;
  peso: string;
  destacado?: boolean;
  stock?: boolean;
  slug: string;
  badge?: string;
  badge_secundario?: string;
  nutricion?: Nutricion;
  preparacion?: Preparacion;
  maridajes?: string[];
  origen?: string;
  maduracion?: number;
  grado?: string;
  marmoleo?: number;
  terneza?: number;
  intensidad_sabor?: number;
  metodos_coccion?: string[];
  metodo_principal?: string;
  temp_coccion?: number;
  tiempo_coccion?: string;
  tips_coccion?: string;
  related_ids: number[];
}

export async function getProductos(): Promise<Producto[]> {
  const wcProductos = await fetchProductos();
  return wcProductos.map(wcProductoToProducto);
}

export async function getProductoBySlug(slug: string): Promise<Producto | undefined> {
  const wc = await fetchProductoBySlug(slug);
  return wc ? wcProductoToProducto(wc) : undefined;
}

export async function getProductosByIds(ids: number[]): Promise<Producto[]> {
  const wcProductos = await fetchProductosByIds(ids);
  return wcProductos.map(wcProductoToProducto);
}
