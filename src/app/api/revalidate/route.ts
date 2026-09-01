import { NextRequest, NextResponse } from 'next/server';
import { revalidateTag } from 'next/cache';

// Invalidación inmediata del caché de productos, llamada por un webhook de
// WooCommerce (Ajustes > Avanzado > Webhooks) al crear/editar/eliminar un
// producto. Sin esto hay que esperar hasta 60s (revalidate de wcFetch) para
// que un cambio de estado (publicado <-> borrador) se refleje en la tienda.
// Token por query string (?token=...): la URL de entrega de un webhook de
// WooCommerce no permite configurar headers personalizados desde su UI nativa,
// así que va en la URL en vez de un header.
export async function POST(request: NextRequest) {
  const token = request.nextUrl.searchParams.get('token');

  if (!process.env.REVALIDATE_TOKEN || token !== process.env.REVALIDATE_TOKEN) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  revalidateTag('productos');
  return NextResponse.json({ revalidated: true, ahora: Date.now() });
}
