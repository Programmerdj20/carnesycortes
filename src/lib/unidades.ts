/**
 * Unidad de venta centralizada. El negocio ya no publica precios en la web
 * (se cotiza por WhatsApp) y todos los cortes se venden por libra, sin
 * importar la presentación registrada en WooCommerce (cyc_peso_presentacion).
 */
export const UNIDAD = 'Lb';
export const UNIDAD_LARGA = 'Se vende por libra (Lb)';
export const UNIDAD_CORTA = 'Por libra (Lb)';
export const PASO_LB = 1;
export const MIN_LB = 1;

export function formatLb(cantidad: number): string {
  return `${cantidad} ${UNIDAD}`;
}
