# CLAUDE.md

Guía para Claude Code en el repositorio de Carnes & Cortes.

## Comandos de Desarrollo

```bash
# Desarrollo local (http://localhost:4321)
npm run dev

# Build de producción
npm run build

# Preview del build de producción
npm run preview
```

## Arquitectura del Proyecto

### Archivos principales
- `src/layouts/Layout.astro` — Layout base: importa Header/Footer, modal de carrito global y funciones JS del carrito
- `src/pages/index.astro` — Página principal: hero cinematográfico, categorías, productos destacados, banner promo, trust section, testimonios, CTA
- `src/pages/tienda.astro` — Catálogo con filtros tipo pills, ordenamiento, cards con link a página de producto
- `src/pages/producto/[...slug].astro` — Página individual de producto con galería, nutrición, preparación, maridajes, productos relacionados
- `src/content/productos/*.json` — Fuente de verdad de productos (Content Collections)
- `src/content/config.ts` — Schema Zod para validación de productos
- `src/styles/global.css` — Smooth scroll, reveal-on-scroll, parallax
- `tailwind.config.mjs` — Colores (`brand-red`, `dark`, `cream`, `gold`), fuentes (`Inter` + `Playfair Display`), animaciones custom, shadows premium

### Componentes
- `src/components/Header.astro` — Header con glassmorphism, scroll effect (transparente → sólido), mobile drawer
- `src/components/Footer.astro` — Footer 4 columnas con CTA WhatsApp, redes sociales, trust badges
- `src/components/ProductCard.astro` — Card reutilizable con badge categoría, hover effects, botón agregar vía data attributes
- `src/components/Breadcrumb.astro` — Navegación breadcrumb
- `src/components/NutritionTable.astro` — Tabla de información nutricional
- `src/components/TestimonialCard.astro` — Card de testimonio con rating estrellas
- `src/components/ProductImage.astro` — Imágenes responsivas con WebP y fallback JPG

### Sistema de Carrito Global

El carrito es persistente entre páginas usando `localStorage` (key: `'carrito'`).

**Flujo de datos:**
1. `Layout.astro` define funciones globales en `window`: `addToGlobalCart()`, `updateGlobalQuantity()`, `toggleGlobalCart()`, `sendGlobalWhatsAppOrder()`, `updateGlobalCartDisplay()`, `showNotification()`
2. Las páginas usan botones con clase `.add-to-cart-btn` y data attributes — Layout.astro maneja los clicks vía event delegation
3. La página de producto (`[...slug].astro`) tiene su propia función con selector de cantidad
4. El estado vive en `window.globalCart` (sincronizado con localStorage)
5. El modal slide-in desde la derecha se actualiza vía `updateGlobalCartDisplay()`
6. Checkout envía pedido formateado por WhatsApp

**Estructura de item en carrito:** `{id, nombre, precio, imagen, peso, slug, cantidad}`

### Gestión de Productos (Content Collections)

Archivos JSON en `src/content/productos/` validados con Zod:

```typescript
{
  id: number,
  nombre: string,
  descripcion: string,
  precio: number,
  imagen: string,        // URL de imagen (Unsplash placeholders por ahora)
  categoria: "premium" | "tradicional" | "combo" | "especial" | "especialidad",
  peso: string,
  destacado?: boolean,   // default: false
  stock?: boolean,       // default: true
  slug: string,          // URL amigable para páginas individuales
  nutricion?: { calorias, proteinas, grasas, grasas_saturadas?, hierro?, sodio? },
  preparacion?: { metodo, tiempo, temperatura, tips?: string[] },
  maridajes?: string[],
  origen?: string,
  maduracion?: string,
  grado?: string,
}
```

- Se resuelve en **build-time** (cero overhead en runtime)
- Agregar producto: crear JSON en `src/content/productos/nombre-producto.json`
- El `slug` se usa para la ruta `/producto/[slug]`
- Imágenes: Unsplash placeholders actualmente; reemplazar con fotos reales cuando estén disponibles

## Consideraciones de Desarrollo

- **Idioma**: Español para contenido, comentarios y variables de negocio
- **JS**: Vanilla en tags `<script>` de Astro, sin frameworks adicionales
- **Diseño**: Mobile-first con Tailwind, tipografía display Playfair Display + Inter para cuerpo
- **Imágenes**: URLs de Unsplash como placeholders. Lazy-loaded excepto hero
- **Cambios globales** (header, footer, carrito): modificar `Layout.astro`, `Header.astro`, `Footer.astro`
- **WhatsApp**: Número configurado en varios archivos (buscar `5573001234567`)
- **SEO**: Meta tags y Open Graph configurados en `Layout.astro`
- **Animaciones**: Intersection Observer para reveal-on-scroll (configurado en Layout.astro), stagger-children para animaciones escalonadas
- **Filtros de tienda**: Los filtros de categoría aceptan query param `?cat=` para linking directo desde categorías de la home
