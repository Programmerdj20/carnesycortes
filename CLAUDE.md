# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Comandos de Desarrollo

```bash
# Desarrollo local (http://localhost:4321)
npm run dev

# Build de producción
npm run build

# Preview del build de producción
npm run preview

# Comandos CLI de Astro
npm run astro
```

## Stack Tecnológico

- **Framework:** Astro 5.13.2
- **Estilos:** Tailwind CSS 3.4.17 con configuración personalizada extensa
- **Tipado:** TypeScript con configuración estricta
- **Fuentes:** Google Fonts (Inter)

## Arquitectura del Proyecto

### Estructura Principal
- `src/layouts/Layout.astro` - Layout base con header global, footer y sistema de carrito compartido
- `src/pages/index.astro` - Página principal con hero, productos destacados y modales
- `src/pages/tienda.astro` - Catálogo completo con filtros y carrito lateral
- `src/styles/global.css` - Estilos globales mínimos
- `Assets/` - Imágenes y recursos del sitio

### Sistema de Carrito Global
El carrito de compras es **global y persistente** usando localStorage:
- Funciones globales disponibles en todas las páginas: `agregarAlCarrito()`, `eliminarDelCarrito()`, `actualizarContadorCarrito()`
- Estado compartido entre `index.astro` y `tienda.astro`
- Integración con WhatsApp para envío de pedidos
- Modal de carrito accesible desde header global

### Configuración de Tailwind
El proyecto usa una configuración muy extensa de Tailwind (`tailwind.config.mjs`) con:
- Colores de marca personalizados (`brand-red`, `dark`)
- Animaciones custom (`gradient-flow`, `float-up-down`, `slide-in-left/right`, etc.)
- Keyframes personalizados para efectos visuales
- Fuente Inter como tipografía principal

### Gestión de Productos
- Productos **hardcodeados** en frontmatter de cada página
- Categorías: `premium`, `tradicional`, `combo`, `especial`, `especialidad`
- Estructura completa: nombre, descripción, precio, peso, imagen, categoría

### Patrones de Código
- **Español** para contenido, comentarios y variables de negocio
- **JavaScript vanilla** para interactividad (no frameworks adicionales)
- **Mobile-first** approach con diseño completamente responsivo
- **Componentes en Astro** siguiendo las convenciones del framework

### Scripts y Funcionalidad
- Navegación responsiva con menú hamburguesa
- Smooth scrolling para enlaces internos
- Animaciones CSS complejas definidas en configuración Tailwind
- Sistema de filtros por categoría en página de tienda
- Estados de hover y transiciones fluidas

### Consideraciones de Desarrollo
- Layout.astro contiene toda la estructura base y debe modificarse para cambios globales
- El carrito usa eventos DOM para comunicación entre páginas
- Imágenes en carpeta `Assets/` con naming descriptivo
- SEO configurado con meta tags y Open Graph en Layout.astro