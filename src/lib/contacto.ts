/**
 * Datos de contacto centralizados. Antes el número de WhatsApp estaba
 * hardcodeado y desincronizado en 3 archivos (CartContext.tsx usaba
 * 5573001234567, producto/[slug]/page.tsx también, mientras que el Footer y
 * la home mostraban el número real: 573128362050).
 */
export const WHATSAPP_NUMERO = '573128362050';

export function whatsappLink(mensaje?: string): string {
  const base = `https://wa.me/${WHATSAPP_NUMERO}`;
  return mensaje ? `${base}?text=${encodeURIComponent(mensaje)}` : base;
}
