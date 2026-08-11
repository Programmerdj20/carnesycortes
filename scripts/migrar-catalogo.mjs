#!/usr/bin/env node
/**
 * Migración del catálogo de WooCommerce a la taxonomía del Excel
 * "PRODUCTOS PAGINA WEB.xlsx" (6 categorías, animal derivado de la categoría).
 *
 * Uso:
 *   node scripts/migrar-catalogo.mjs            # dry-run (no escribe nada)
 *   node scripts/migrar-catalogo.mjs --apply     # ejecuta los cambios de verdad
 *
 * Lee las credenciales de .env.local, igual que src/lib/woocommerce.ts.
 */

import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

// ─── Cargar .env.local (sin dependencias) ──────────────────────────────────
function loadEnvLocal() {
  const envPath = path.join(ROOT, '.env.local');
  const raw = readFileSync(envPath, 'utf8');
  const env = {};
  for (const line of raw.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eq = trimmed.indexOf('=');
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    let value = trimmed.slice(eq + 1).trim();
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    env[key] = value;
  }
  return env;
}

const env = loadEnvLocal();
const WOOCOMMERCE_URL = env.WOOCOMMERCE_URL;
const AUTH = Buffer.from(`${env.WOOCOMMERCE_CONSUMER_KEY}:${env.WOOCOMMERCE_CONSUMER_SECRET}`).toString('base64');

if (!WOOCOMMERCE_URL || !env.WOOCOMMERCE_CONSUMER_KEY || !env.WOOCOMMERCE_CONSUMER_SECRET) {
  console.error('Faltan variables de entorno WooCommerce en .env.local');
  process.exit(1);
}

const APPLY = process.argv.includes('--apply');

async function wc(method, endpoint, body) {
  const url = `${WOOCOMMERCE_URL}/wp-json/wc/v3/${endpoint}`;
  if (!APPLY && method !== 'GET') {
    console.log(`  [DRY-RUN] ${method} ${endpoint}`);
    if (body) console.log('    body:', JSON.stringify(body));
    return { id: -1, __dryRun: true };
  }
  const res = await fetch(url, {
    method,
    headers: {
      Authorization: `Basic ${AUTH}`,
      'Content-Type': 'application/json',
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(`${method} ${endpoint} -> ${res.status}: ${JSON.stringify(data)}`);
  }
  return data;
}

// ─── 1. Categorías nuevas ───────────────────────────────────────────────────
const CATEGORIAS_NUEVAS = [
  { slug: 'cortes-premium-res', name: 'Cortes Premium de Res' },
  { slug: 'cortes-especiales-res', name: 'Cortes Especiales de Res' },
  { slug: 'cortes-especiales-cerdo', name: 'Cortes Especiales de Cerdo' },
  { slug: 'cortes-asar-freir-res', name: 'Cortes para Asar y Freír' },
  { slug: 'cortes-res', name: 'Cortes de Res' },
  { slug: 'combos', name: 'Combos' },
];

// Categorías viejas a eliminar una vez migrados los productos (id: slug)
const CATEGORIAS_VIEJAS = [
  { id: 24, slug: 'cortes-premium' },
  { id: 25, slug: 'tradicional' },
  { id: 26, slug: 'especialidades' },
  { id: 27, slug: 'especial' },
  // 23 = sin-categorizar, se conserva (es la categoría default de WooCommerce)
];

// ─── 2. Productos existentes que se conservan (id -> nueva data) ──────────
// nombre: sin emoji · slug: limpio · categoriaSlug: nueva categoría
const PRODUCTOS_EXISTENTES = [
  // Cortes Premium de Res
  { id: 17, nombre: 'Chata', slug: 'chata', categoriaSlug: 'cortes-premium-res' },
  { id: 32, nombre: 'Lomo de Aguja', slug: 'lomo-de-aguja', categoriaSlug: 'cortes-premium-res' },
  { id: 26, nombre: 'Cola de Cuadril', slug: 'cola-de-cuadril', categoriaSlug: 'cortes-premium-res' },
  // Cortes Especiales de Res
  { id: 53, nombre: 'Tomahawk', slug: 'tomahawk', categoriaSlug: 'cortes-especiales-res' },
  { id: 45, nombre: 'Rib Eye', slug: 'rib-eye', categoriaSlug: 'cortes-especiales-res' },
  { id: 37, nombre: 'Osobuco', slug: 'osobuco', categoriaSlug: 'cortes-especiales-res' },
  // Cortes Especiales de Cerdo
  { id: 43, nombre: 'Punta de Anca de Cerdo', slug: 'punta-de-anca-de-cerdo', categoriaSlug: 'cortes-especiales-cerdo' },
  { id: 52, nombre: 'Tomahawk de Cerdo', slug: 'tomahawk-de-cerdo', categoriaSlug: 'cortes-especiales-cerdo' },
  { id: 23, nombre: 'Chuleta de Cerdo', slug: 'chuleta-de-cerdo', categoriaSlug: 'cortes-especiales-cerdo' },
  { id: 47, nombre: 'Solomito de Cerdo', slug: 'solomito-de-cerdo', categoriaSlug: 'cortes-especiales-cerdo' },
  // Cortes para Asar y Freír
  { id: 48, nombre: 'Solomo Extranjero', slug: 'solomo-extranjero', categoriaSlug: 'cortes-asar-freir-res' },
  { id: 49, nombre: 'Tabla', slug: 'tabla', categoriaSlug: 'cortes-asar-freir-res' },
  { id: 30, nombre: 'Huevo de Aldana', slug: 'huevo-de-aldana', categoriaSlug: 'cortes-asar-freir-res' },
  { id: 38, nombre: 'Paletero', slug: 'paletero', categoriaSlug: 'cortes-asar-freir-res' },
  { id: 31, nombre: 'Huevo de Solomo', slug: 'huevo-de-solomo', categoriaSlug: 'cortes-asar-freir-res' },
  // Cortes de Res
  { id: 42, nombre: 'Posta', slug: 'posta', categoriaSlug: 'cortes-res' },
  { id: 36, nombre: 'Muchacho', slug: 'muchacho', categoriaSlug: 'cortes-res' },
  { id: 46, nombre: 'Sobrebarriga', slug: 'sobrebarriga', categoriaSlug: 'cortes-res' },
  { id: 28, nombre: 'Copete', slug: 'copete', categoriaSlug: 'cortes-res' },
  { id: 35, nombre: 'Morrillo', slug: 'morrillo', categoriaSlug: 'cortes-res' },
  { id: 54, nombre: 'Tres Telas', slug: 'tres-telas', categoriaSlug: 'cortes-res' },
];

// ─── 3. Productos nuevos (sin precio -> "Consultar precio") ───────────────
const PRODUCTOS_NUEVOS = [
  // Cortes Premium de Res
  { nombre: 'Solomito', slug: 'solomito', categoriaSlug: 'cortes-premium-res', badge: 'premium' },
  { nombre: 'Punta de Anca', slug: 'punta-de-anca', categoriaSlug: 'cortes-premium-res', badge: 'premium' },
  { nombre: 'Solomo Redondo', slug: 'solomo-redondo', categoriaSlug: 'cortes-premium-res', badge: 'premium' },
  { nombre: 'Entraña', slug: 'entrana', categoriaSlug: 'cortes-premium-res', badge: 'premium' },
  // Cortes Especiales de Res
  { nombre: 'T-Bone', slug: 't-bone', categoriaSlug: 'cortes-especiales-res', badge: 'especial' },
  { nombre: 'Asado de Tira', slug: 'asado-de-tira', categoriaSlug: 'cortes-especiales-res', badge: 'especial' },
  { nombre: 'Caracú', slug: 'caracu', categoriaSlug: 'cortes-especiales-res', badge: 'especial' },
  { nombre: 'Picaña', slug: 'picana', categoriaSlug: 'cortes-especiales-res', badge: 'especial' },
  // Cortes Especiales de Cerdo
  { nombre: 'Costichi', slug: 'costichi', categoriaSlug: 'cortes-especiales-cerdo', badge: 'especial' },
  { nombre: 'Costilla San Luis', slug: 'costilla-san-luis', categoriaSlug: 'cortes-especiales-cerdo', badge: 'especial' },
  { nombre: 'Bondiola', slug: 'bondiola', categoriaSlug: 'cortes-especiales-cerdo', badge: 'especial' },
  { nombre: 'Churrasco', slug: 'churrasco', categoriaSlug: 'cortes-especiales-cerdo', badge: 'especial' },
  // Cortes para Asar y Freír
  { nombre: 'Entretabla', slug: 'entretabla', categoriaSlug: 'cortes-asar-freir-res', badge: 'tradicional' },
  { nombre: 'Cáscara', slug: 'cascara', categoriaSlug: 'cortes-asar-freir-res', badge: 'tradicional' },
  // Cortes de Res
  { nombre: 'Entrepecho', slug: 'entrepecho', categoriaSlug: 'cortes-res', badge: 'tradicional' },
  { nombre: 'Pecho', slug: 'pecho', categoriaSlug: 'cortes-res', badge: 'tradicional' },
  { nombre: 'Costilla', slug: 'costilla', categoriaSlug: 'cortes-res', badge: 'tradicional' },
];

// ─── 4. Productos a mover a papelera (ya no están en el Excel) ────────────
const PRODUCTOS_PAPELERA = [
  { id: 51, nombre: 'Tocino' },
  { id: 50, nombre: 'Tableado' },
  { id: 44, nombre: 'Punta de Espaldilla' },
  { id: 41, nombre: 'Pierna de Cerdo' },
  { id: 39, nombre: 'Papada de Cerdo' },
  { id: 34, nombre: 'Carne Molida' },
  { id: 33, nombre: 'Matambre' },
  { id: 29, nombre: 'Hueso Carnudo' },
  { id: 18, nombre: 'Cañón de Cerdo' },
];

// ─── Ejecución ──────────────────────────────────────────────────────────────
async function main() {
  console.log(`\n=== Migración de catálogo Carnes & Cortes ===`);
  console.log(APPLY ? '>>> MODO APPLY: se escribirá en WooCommerce <<<' : '>>> DRY-RUN: no se escribe nada, solo se muestra el plan <<<');
  console.log(`Total: ${CATEGORIAS_NUEVAS.length} categorías nuevas, ${PRODUCTOS_EXISTENTES.length} productos reasignados, ${PRODUCTOS_NUEVOS.length} productos nuevos, ${PRODUCTOS_PAPELERA.length} a papelera, ${CATEGORIAS_VIEJAS.length} categorías viejas a borrar.\n`);

  // 1. Crear categorías nuevas
  console.log('--- 1. Creando categorías ---');
  const catMap = {}; // slug -> id
  for (const cat of CATEGORIAS_NUEVAS) {
    const created = await wc('POST', 'products/categories', { name: cat.name, slug: cat.slug });
    catMap[cat.slug] = created.id;
    console.log(`  ✓ ${cat.name} (${cat.slug}) -> id=${created.id}`);
  }

  // 2. Actualizar productos existentes
  console.log('\n--- 2. Reasignando productos existentes ---');
  for (const p of PRODUCTOS_EXISTENTES) {
    const catId = catMap[p.categoriaSlug];
    await wc('PUT', `products/${p.id}`, {
      name: p.nombre,
      slug: p.slug,
      categories: [{ id: catId ?? -1 }],
    });
    console.log(`  ✓ [${p.id}] ${p.nombre} -> ${p.categoriaSlug}`);
  }

  // 3. Crear productos nuevos
  console.log('\n--- 3. Creando productos nuevos (precio 0 = "Consultar precio") ---');
  for (const p of PRODUCTOS_NUEVOS) {
    const catId = catMap[p.categoriaSlug];
    const created = await wc('POST', 'products', {
      name: p.nombre,
      slug: p.slug,
      type: 'simple',
      status: 'publish',
      regular_price: '0',
      categories: [{ id: catId ?? -1 }],
      meta_data: [
        { key: 'cyc_badge', value: p.badge },
        { key: 'cyc_en_stock', value: 'disponible' },
      ],
    });
    console.log(`  ✓ ${p.nombre} -> ${p.categoriaSlug} (id=${created.id})`);
  }

  // 4. Mover sobrantes a papelera
  console.log('\n--- 4. Moviendo productos sobrantes a papelera (reversible) ---');
  for (const p of PRODUCTOS_PAPELERA) {
    await wc('DELETE', `products/${p.id}`);
    console.log(`  ✓ [${p.id}] ${p.nombre} -> papelera`);
  }

  // 5. Borrar categorías viejas (deben quedar vacías)
  console.log('\n--- 5. Borrando categorías viejas ---');
  for (const cat of CATEGORIAS_VIEJAS) {
    await wc('DELETE', `products/categories/${cat.id}?force=true`);
    console.log(`  ✓ [${cat.id}] ${cat.slug} eliminada`);
  }

  console.log(`\n=== ${APPLY ? 'Migración aplicada' : 'Dry-run completo'} ===`);
  if (!APPLY) console.log('Ejecuta con --apply para aplicar estos cambios de verdad.\n');
}

main().catch(err => {
  console.error('\n✗ ERROR:', err.message);
  process.exit(1);
});
