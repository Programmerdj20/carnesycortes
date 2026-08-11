/**
 * Fuente única de verdad para categorías de producto.
 *
 * Antes esta lista vivía duplicada (y desincronizada) en 7 archivos distintos:
 * productos.ts, woocommerce.ts, TiendaClient.tsx, ProductCard.tsx,
 * ProductosCarousel.tsx, producto/[slug]/page.tsx y ProductoHero.tsx.
 * Todos esos sitios deben importar de aquí.
 *
 * Corresponde 1:1 a las 6 categorías del documento "PRODUCTOS PAGINA WEB.xlsx"
 * y a los slugs creados en WooCommerce por scripts/migrar-catalogo.mjs.
 */

import { Award, Crown, Flame, Beef, Package, PiggyBank, type LucideIcon } from 'lucide-react';

export type AnimalId = 'res' | 'cerdo';

export type CategoriaId =
  | 'cortes-premium-res'
  | 'cortes-especiales-res'
  | 'cortes-especiales-cerdo'
  | 'cortes-asar-freir-res'
  | 'cortes-res'
  | 'combos';

export interface Categoria {
  id: CategoriaId;
  /** Nombre corto — usar cuando el filtro de animal ya distingue res/cerdo */
  nombre: string;
  /** Nombre completo — usar cuando conviven productos de ambos animales (ej. vista "Todo") */
  nombreLargo: string;
  animal: AnimalId | null;
  icono: LucideIcon;
  orden: number;
  /** Categoría sin productos aún — se muestra con estado "Muy pronto" */
  proximamente?: boolean;
  /** Clases Tailwind para el badge/pill de la categoría */
  badgeClase: string;
}

export const CATEGORIAS: Categoria[] = [
  {
    id: 'cortes-premium-res',
    nombre: 'Premium',
    nombreLargo: 'Cortes Premium de Res',
    animal: 'res',
    icono: Award,
    orden: 1,
    badgeClase: 'bg-gold text-dark-900',
  },
  {
    id: 'cortes-especiales-res',
    nombre: 'Especiales',
    nombreLargo: 'Cortes Especiales de Res',
    animal: 'res',
    icono: Crown,
    orden: 2,
    badgeClase: 'bg-brand-red text-white',
  },
  {
    id: 'cortes-especiales-cerdo',
    nombre: 'Especiales',
    nombreLargo: 'Cortes Especiales de Cerdo',
    animal: 'cerdo',
    icono: Crown,
    orden: 3,
    badgeClase: 'bg-dark-800 text-gold border border-gold/30',
  },
  {
    id: 'cortes-asar-freir-res',
    nombre: 'Asar y Freír',
    nombreLargo: 'Cortes para Asar y Freír',
    animal: 'res',
    icono: Flame,
    orden: 4,
    badgeClase: 'bg-dark-700 text-white border border-white/20',
  },
  {
    id: 'cortes-res',
    nombre: 'Clásicos',
    nombreLargo: 'Cortes de Res',
    animal: 'res',
    icono: Beef,
    orden: 5,
    badgeClase: 'bg-brand-red-dark text-white',
  },
  {
    id: 'combos',
    nombre: 'Combos',
    nombreLargo: 'Combos',
    animal: null,
    icono: Package,
    orden: 6,
    proximamente: true,
    badgeClase: 'bg-dark-900/70 text-white/70 border border-white/10',
  },
];

export interface Animal {
  id: AnimalId;
  nombre: string;
  icono: LucideIcon;
}

export const ANIMALES: Animal[] = [
  { id: 'res', nombre: 'Res', icono: Beef },
  { id: 'cerdo', nombre: 'Cerdo', icono: PiggyBank },
];

/** Lista de ids válidos, en el orden de la taxonomía del Excel */
export const CATEGORIA_IDS = CATEGORIAS.map(c => c.id);

export function getCategoria(id: string): Categoria | undefined {
  return CATEGORIAS.find(c => c.id === id);
}

export function esCategoriaValida(id: string): id is CategoriaId {
  return CATEGORIA_IDS.includes(id as CategoriaId);
}

export function nombreCategoria(id: string, opts?: { largo?: boolean }): string {
  const cat = getCategoria(id);
  if (!cat) return id;
  return opts?.largo ? cat.nombreLargo : cat.nombre;
}

export function badgeClase(id: string): string {
  return getCategoria(id)?.badgeClase ?? 'bg-brand-red text-white';
}

export function categoriasPorAnimal(animal: AnimalId | 'todos'): Categoria[] {
  const lista = animal === 'todos' ? CATEGORIAS : CATEGORIAS.filter(c => c.animal === animal || c.animal === null);
  return [...lista].sort((a, b) => a.orden - b.orden);
}
