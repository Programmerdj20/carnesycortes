import type { Nutricion } from '@/lib/productos';

export default function NutritionTable({ nutricion }: { nutricion: Nutricion }) {
  const items = [
    { label: 'Calorías', value: `${nutricion.calorias} kcal`, icon: '🔥' },
    { label: 'Proteínas', value: `${nutricion.proteinas}g`, icon: '💪' },
    { label: 'Grasas', value: `${nutricion.grasas}g`, icon: '🫧' },
    ...(nutricion.grasas_saturadas != null ? [{ label: 'Grasas Sat.', value: `${nutricion.grasas_saturadas}g`, icon: '⚡' }] : []),
    ...(nutricion.hierro != null ? [{ label: 'Hierro', value: `${nutricion.hierro}mg`, icon: '🩸' }] : []),
    ...(nutricion.sodio != null ? [{ label: 'Sodio', value: `${nutricion.sodio}mg`, icon: '🧂' }] : []),
  ];

  return (
    <div className="bg-white rounded-2xl p-6 shadow-premium-sm">
      <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
        <svg className="w-5 h-5 text-brand-red" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
        Información Nutricional
        <span className="text-gray-400 text-sm font-normal">(por 100g)</span>
      </h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {items.map(item => (
          <div key={item.label} className="bg-gray-50 rounded-xl p-3 text-center border border-gray-100">
            <span className="text-xl">{item.icon}</span>
            <p className="font-bold text-gray-900 text-sm mt-1">{item.value}</p>
            <p className="text-gray-500 text-xs">{item.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
