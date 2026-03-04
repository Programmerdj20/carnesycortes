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
```

No hay suite de tests ni linter configurado en este proyecto.

## Stack Tecnológico

- **Next.js 15** con App Router (SSG estático)
- **React 19** — componentes Server y Client
- **Tailwind CSS 3** — mismo diseño que el proyecto anterior
- **TypeScript** estricto
- Output 100% estático (SSG via `generateStaticParams`)

## Arquitectura del Proyecto

### Archivos clave
- `src/app/layout.tsx` — Layout raíz: CartProvider, Header, Footer, CartModal, ScrollReveal
- `src/app/page.tsx` — Página principal (Server Component)
- `src/app/tienda/page.tsx` — Catálogo (Server Component, pasa datos a TiendaClient)
- `src/app/producto/[slug]/page.tsx` — Página individual (Server Component con generateStaticParams)
- `src/app/globals.css` — Estilos globales con Tailwind directives + animaciones
- `src/lib/productos.ts` — Lee JSONs de `src/content/productos/` en server-side
- `src/content/productos/*.json` — Fuente de verdad de productos (16 productos)
- `tailwind.config.mjs` — Colores (`brand-red`, `dark`, `cream`, `gold`), fuentes, animaciones

### Componentes

**Server Components (sin 'use client'):**
- `Footer.tsx`, `Breadcrumb.tsx`, `NutritionTable.tsx`, `TestimonialCard.tsx`

**Client Components ('use client'):**
- `Header.tsx` — scroll effect, mobile menu, cuenta del carrito
- `CartModal.tsx` — panel deslizable del carrito
- `CartContext.tsx` — estado global del carrito (React Context + localStorage)
- `ProductCard.tsx` — botón "Agregar" usa useCart()
- `AddToCartBtn.tsx` — botón simple de agregar al carrito
- `ProductoAddToCart.tsx` — selector de cantidad + botón en página de producto
- `TiendaClient.tsx` — filtros y ordenamiento en la tienda
- `ScrollReveal.tsx` — Intersection Observer para animaciones reveal-on-scroll

### Sistema de Carrito

Persistente entre páginas usando `localStorage` (key: `'carrito'`). Estado gestionado con React Context.

**CartContext expone:**
- `items` — array de items del carrito
- `isOpen` — estado del modal
- `addItem(item, qty?)` — agregar al carrito
- `updateQuantity(id, change)` — modificar cantidad
- `toggleCart()` — abrir/cerrar modal
- `sendWhatsAppOrder()` — enviar pedido por WhatsApp
- `showNotification(msg)` — toast de confirmación

**Estructura de item:** `{id, nombre, precio, imagen, peso, slug, cantidad}`

### Gestión de Productos

- Archivos JSON en `src/content/productos/` — leídos con `fs.readFileSync` en server-side
- Función `getProductos()` en `src/lib/productos.ts`
- Categorías válidas: `"premium" | "tradicional" | "combo" | "especial" | "especialidad"`
- Para agregar producto: crear `src/content/productos/nombre-producto.json` con `slug` único
- El `slug` define la ruta `/producto/[slug]`
- Imágenes: URLs de Unsplash como placeholders

## Consideraciones de Desarrollo

- **Idioma**: Español para contenido, comentarios y variables de negocio
- **Diseño**: Mobile-first con Tailwind, tipografía `Playfair Display` (display) + `Inter` (cuerpo) via next/font
- **Cambios globales** (header, footer, carrito): modificar `Header.tsx`, `Footer.tsx`, `CartContext.tsx`
- **WhatsApp**: Número `5573001234567` aparece en múltiples archivos — buscar antes de cambiar
- **SEO**: `generateMetadata` en cada página; metadata global en `layout.tsx`
- **Animaciones**: `ScrollReveal.tsx` maneja Intersection Observer; clases `reveal-on-scroll` y `stagger-children`
- **Filtros de tienda**: `TiendaClient.tsx` usa `useSearchParams()` para leer `?cat=` al montar
- **Rutas**: `/`, `/tienda`, `/tienda?cat=CATEGORIA`, `/producto/[slug]`
