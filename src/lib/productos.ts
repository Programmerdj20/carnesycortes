import { fetchProductos, fetchProductoBySlug, wcProductoToProducto } from './woocommerce';

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
  precio: number;
  imagen: string;
  categoria: 'premium' | 'tradicional' | 'combo' | 'especial' | 'especialidad';
  peso: string;
  destacado?: boolean;
  stock?: boolean;
  slug: string;
  nutricion?: Nutricion;
  preparacion?: Preparacion;
  maridajes?: string[];
  origen?: string;
  maduracion?: string;
  grado?: string;
}

export async function getProductos(): Promise<Producto[]> {
  const wcProductos = await fetchProductos();
  return wcProductos.map(wcProductoToProducto);
}

export async function getProductoBySlug(slug: string): Promise<Producto | undefined> {
  const wc = await fetchProductoBySlug(slug);
  return wc ? wcProductoToProducto(wc) : undefined;
}
