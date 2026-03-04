import fs from 'fs';
import path from 'path';

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

export function getProductos(): Producto[] {
  const productosDir = path.join(process.cwd(), 'src/content/productos');
  const files = fs.readdirSync(productosDir).filter(f => f.endsWith('.json'));
  return files.map(file => {
    const content = fs.readFileSync(path.join(productosDir, file), 'utf-8');
    return JSON.parse(content) as Producto;
  });
}

export function getProductoBySlug(slug: string): Producto | undefined {
  return getProductos().find(p => p.slug === slug);
}
