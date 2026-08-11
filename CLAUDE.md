# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

Guía para Claude Code en el repositorio de Carnes & Cortes.

## Comandos de Desarrollo

```bash
# Desarrollo local (http://localhost:3000)
npm run dev

# Build de producción
npm run build

# Servir el build de producción
npm start

# Migración/reorganización del catálogo en WooCommerce (dry-run por defecto)
node scripts/migrar-catalogo.mjs
node scripts/migrar-catalogo.mjs --apply
```

No hay suite de tests ni linter configurado en este proyecto.

## Stack Tecnológico

- **Next.js 15** con App Router
- **React 19** — componentes Server y Client
- **Tailwind CSS 3**
- **TypeScript** estricto
- **WooCommerce** (`control.carnesycortes.co`) como backend de productos vía REST API — ver `.env.local` (`WOOCOMMERCE_URL`, `WOOCOMMERCE_CONSUMER_KEY/SECRET`). No hay build estático total: las páginas de producto usan `generateStaticParams` pero dependen de la API de Woo en build time.

## Arquitectura del Proyecto

### Archivos clave
- `src/app/layout.tsx` — Layout raíz: fuentes (Inter + Playfair Display)
- `src/app/page.tsx` — Home actual: página "Sitio en construcción" (NO usa Header/Footer/Carrito, está fuera del route group `(site)`)
- `src/app/_page-home-original.tsx` — Home completa (hero, categorías, carrusel, vitrina, testimonios) archivada y **sin rutear** (prefijo `_`); se mantiene compilando pero no se sirve
- `src/app/(site)/layout.tsx` — Layout de la tienda: CartProvider, Header, Footer, CartModal, ScrollReveal
- `src/app/(site)/tienda/page.tsx` — Catálogo (Server Component, pasa datos a `TiendaClient`)
- `src/app/(site)/producto/[slug]/page.tsx` — Página individual de producto (Server Component con `generateStaticParams`)
- `src/app/globals.css` — Estilos globales con Tailwind directives + animaciones
- `src/lib/productos.ts` — Tipos (`Producto`, `Nutricion`, `Preparacion`) y funciones `getProductos()` / `getProductoBySlug()` / `getProductosByIds()`
- `src/lib/woocommerce.ts` — Cliente REST de WooCommerce y mapeo `WCProduct` → `Producto` (`wcProductoToProducto`)
- `src/lib/categorias.ts` — **Fuente única de verdad de la taxonomía de categorías** (id, nombre, animal, icono, color de badge). Todo componente que muestre categorías debe importar de aquí, no redefinir la lista.
- `src/lib/contacto.ts` — Número de WhatsApp centralizado (`WHATSAPP_NUMERO`, `whatsappLink()`)
- `tailwind.config.mjs` — Colores (`brand-red`, `dark`, `cream`, `gold`), fuentes, animaciones
- `scripts/migrar-catalogo.mjs` — Script idempotente de reorganización de categorías/productos en WooCommerce (dry-run por defecto, `--apply` para escribir)

**Nota histórica:** `src/content/productos/*.json` (16 archivos) fue la fuente de datos de una versión anterior. Ya **no se usa** — nada en `src/` los importa. Los productos reales viven en WooCommerce.

### Componentes

**Server Components (sin 'use client'):**
- `Footer.tsx`, `Breadcrumb.tsx`, `NutritionTable.tsx` (sin uso actual), `TestimonialCard.tsx` (sin uso actual)

**Client Components ('use client'):**
- `Header.tsx` — scroll effect, menú móvil, contador del carrito, publica `--header-h` (altura real del header) como variable CSS para elementos sticky
- `CartModal.tsx` — panel deslizable del carrito
- `CartContext.tsx` — estado global del carrito (React Context + localStorage)
- `ProductCard.tsx` — tarjeta de producto; usa `useCart()`, categorías de `lib/categorias.ts`, `next/image`; si `precio <= 0` muestra "Consultar precio" + botón de WhatsApp en vez de "Agregar"
- `ProductoHero.tsx` — galería + CTA de la página de producto; mismo manejo de precio 0
- `AddToCartBtn.tsx` — botón simple de agregar al carrito
- `ProductoAddToCart.tsx` — selector de cantidad + botón (sin uso actual)
- `TiendaClient.tsx` — filtro de **dos ejes** (Animal: Res/Cerdo + Tipo de corte) y ordenamiento; sincroniza el filtro con `?animal=` y `?cat=` en la URL (lectura y escritura, válido para atrás/adelante del navegador)
- `ScrollReveal.tsx` — Intersection Observer para animaciones reveal-on-scroll

### Sistema de Carrito

Persistente entre páginas usando `localStorage` (key: `'carrito'`). Estado gestionado con React Context.

**CartContext expone:**
- `items` — array de items del carrito
- `isOpen` — estado del modal
- `addItem(item, qty?)` — agregar al carrito
- `updateQuantity(id, change)` — modificar cantidad
- `toggleCart()` — abrir/cerrar modal
- `sendWhatsAppOrder()` — enviar pedido por WhatsApp (usa `WHATSAPP_NUMERO` de `lib/contacto.ts`)
- `showNotification(msg)` — toast de confirmación

**Estructura de item:** `{id, nombre, precio, imagen, peso, slug, cantidad}`

### Gestión de Productos y Categorías

- Los productos se leen de WooCommerce vía `getProductos()` / `getProductoBySlug()` en `src/lib/productos.ts` (server-only, usa `fetchProductos()` de `woocommerce.ts`)
- **Categorías válidas** (definidas en `src/lib/categorias.ts`, deben coincidir 1:1 con los slugs de categoría en WooCommerce):
  - `cortes-premium-res` — Cortes Premium de Res
  - `cortes-especiales-res` — Cortes Especiales de Res
  - `cortes-especiales-cerdo` — Cortes Especiales de Cerdo
  - `cortes-asar-freir-res` — Cortes para Asar y Freír
  - `cortes-res` — Cortes de Res
  - `combos` — Combos (categoría "próximamente", sin productos aún; la tienda la muestra con un estado dedicado en vez del grid)
- El campo `animal` (`'res' | 'cerdo' | null`) de cada categoría se deriva de esta tabla, no de un metadato aparte en WooCommerce
- La categoría de WooCommerce es la autoridad (`mapCategoria()` en `woocommerce.ts`); el campo `cyc_badge` de WooCommerce es solo un sello visual decorativo ("premium", "destacado"), ya no decide la categoría
- Para agregar un producto: crearlo en WooCommerce con una de las categorías de arriba. Productos sin precio (`regular_price: "0"`) se muestran como "Consultar precio" con CTA de WhatsApp en vez de "Agregar al carrito"
- El `slug` de WooCommerce define la ruta `/producto/[slug]`
- Imágenes: Cloudinary (`res.cloudinary.com/dpvmazymp/...`) vía los campos `cyc_imagen_principal` / `cyc_galeria` de WooCommerce — whitelisteado en `next.config.mjs` (`images.remotePatterns`)

## Consideraciones de Desarrollo

- **Idioma**: Español para contenido, comentarios y variables de negocio
- **Diseño**: Mobile-first con Tailwind, tipografía `Playfair Display` (display) + `Inter` (cuerpo) via next/font. Iconografía: `lucide-react` — no usar emojis como iconos de UI
- **Cambios globales** (header, footer, carrito): modificar `Header.tsx`, `Footer.tsx`, `CartContext.tsx`
- **WhatsApp**: Número centralizado en `src/lib/contacto.ts` (`WHATSAPP_NUMERO`) — no hardcodear el número en componentes
- **SEO**: `generateMetadata` en cada página; metadata global en `layout.tsx`
- **Animaciones**: `ScrollReveal.tsx` maneja Intersection Observer; clases `reveal-on-scroll` y `stagger-children`
- **Filtros de tienda**: `TiendaClient.tsx` lee y escribe `?animal=` y `?cat=` en la URL, validando contra `src/lib/categorias.ts`
- **Rutas**: `/`, `/tienda`, `/tienda?animal=res|cerdo&cat=CATEGORIA`, `/producto/[slug]`
- **Redirects**: `next.config.mjs` mantiene 301 de los slugs viejos (con emoji/URL-encoded) hacia los slugs limpios actuales — no borrar sin verificar que no rompan enlaces ya compartidos
