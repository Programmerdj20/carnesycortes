'use client';

import { useEffect, useRef, useState } from 'react';

interface Props {
  marmoleo: number;    // 1–5
  terneza: number;     // 1–5
  intensidad: number;  // 1–5
}

const BARS = [
  { key: 'marmoleo',  label: 'Marmoleo',           gradient: 'from-amber-600 to-gold' },
  { key: 'terneza',   label: 'Terneza',             gradient: 'from-brand-red to-rose-400' },
  { key: 'intensidad',label: 'Intensidad de sabor', gradient: 'from-orange-600 to-amber-400' },
] as const;

export default function CorteProfileBars({ marmoleo, terneza, intensidad }: Props) {
  const [visible, setVisible] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  // Activar animación cuando la sección entra al viewport
  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const values: Record<typeof BARS[number]['key'], number> = {
    marmoleo,
    terneza,
    intensidad,
  };

  return (
    <div ref={rootRef} className="space-y-5">
      {BARS.map(({ key, label, gradient }) => {
        const val = values[key];
        const pct = (val / 5) * 100;
        return (
          <div key={key}>
            <div className="flex items-center justify-between mb-2.5">
              <span className="text-white/55 text-sm tracking-wide">{label}</span>
              <div className="flex items-center gap-3">
                {/* Puntos indicadores */}
                <div className="flex items-center gap-1" role="img" aria-label={`${val} de 5`}>
                  {Array.from({ length: 5 }, (_, i) => (
                    <span
                      key={i}
                      className={[
                        'w-1.5 h-1.5 rounded-full transition-colors duration-300',
                        i < val ? 'bg-gold' : 'bg-white/10',
                      ].join(' ')}
                    />
                  ))}
                </div>
                <span className="text-gold text-xs font-semibold tabular-nums w-6 text-right">{val}/5</span>
              </div>
            </div>
            {/* Barra */}
            <div className="h-1 bg-white/8 rounded-full overflow-hidden">
              <div
                className={`h-full bg-gradient-to-r ${gradient} rounded-full transition-all duration-1000 ease-out`}
                style={{ width: visible ? `${pct}%` : '0%' }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
