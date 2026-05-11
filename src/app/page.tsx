import type { Metadata } from 'next';
import Image from 'next/image';

export const metadata: Metadata = {
  title: 'Carnes & Cortes — Pronto disponible',
  description: 'Estamos preparando algo extraordinario. La experiencia premium que mereces, llegando muy pronto.',
};

const sparks = [
  { w: 3,  h: 3,  top: '12%',  left:  '7%',  delay: '0s',    dur: '7s',   op: 0.45 },
  { w: 2,  h: 2,  top: '22%',  left: '91%',  delay: '1.8s',  dur: '9s',   op: 0.30 },
  { w: 4,  h: 4,  top: '58%',  left:  '4%',  delay: '3.1s',  dur: '6.5s', op: 0.25 },
  { w: 2,  h: 2,  top: '73%',  left: '89%',  delay: '0.6s',  dur: '8.5s', op: 0.35 },
  { w: 3,  h: 3,  top: '38%',  left: '96%',  delay: '2.4s',  dur: '7.5s', op: 0.20 },
  { w: 2,  h: 2,  top: '83%',  left: '13%',  delay: '4.2s',  dur: '6s',   op: 0.30 },
  { w: 3,  h: 3,  top:  '8%',  left: '77%',  delay: '1.1s',  dur: '8s',   op: 0.22 },
  { w: 2,  h: 2,  top: '47%',  left:  '2%',  delay: '3.7s',  dur: '7.2s', op: 0.18 },
  { w: 2,  h: 2,  top: '65%',  left: '50%',  delay: '5s',    dur: '10s',  op: 0.12 },
  { w: 3,  h: 3,  top: '30%',  left: '25%',  delay: '2s',    dur: '8s',   op: 0.10 },
];

export default function Page() {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-dark-900">

      {/* ── Ambient glow central ── */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(196,30,58,0.07) 0%, rgba(196,30,58,0.02) 40%, transparent 70%)' }}
      />

      {/* ── Glow dorado superior ── */}
      <div
        className="absolute top-0 left-0 right-0 pointer-events-none"
        style={{ height: '1px', background: 'linear-gradient(90deg, transparent 0%, rgba(212,168,75,0.55) 50%, transparent 100%)' }}
      />

      {/* ── Línea inferior ── */}
      <div
        className="absolute bottom-0 left-0 right-0 pointer-events-none"
        style={{ height: '1px', background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.08) 50%, transparent 100%)' }}
      />

      {/* ── Patrón de grilla sutil ── */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.022]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,248,240,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,248,240,0.6) 1px, transparent 1px)',
          backgroundSize: '72px 72px',
        }}
      />

      {/* ── Partículas flotantes (brasas) ── */}
      {sparks.map((s, i) => (
        <div
          key={i}
          className="absolute rounded-full bg-brand-red pointer-events-none animate-float-up-down"
          style={{
            width: s.w,
            height: s.h,
            top: s.top,
            left: s.left,
            opacity: s.op,
            animationDelay: s.delay,
            animationDuration: s.dur,
          }}
        />
      ))}

      {/* ── Contenido principal ── */}
      <div className="relative z-10 flex flex-col items-center text-center px-6 max-w-2xl mx-auto">

        {/* Chip de estado */}
        <div
          className="inline-flex items-center gap-2.5 rounded-full px-5 py-2 mb-14 animate-fade-in-up"
          style={{
            border: '1px solid rgba(212,168,75,0.25)',
            background: 'rgba(212,168,75,0.05)',
            animationDelay: '0s',
          }}
        >
          <span
            className="w-1.5 h-1.5 rounded-full animate-pulse-dot"
            style={{ background: '#D4A84B' }}
          />
          <span
            className="text-[10px] font-bold uppercase tracking-[0.35em] font-sans"
            style={{ color: 'rgba(212,168,75,0.80)' }}
          >
            Sitio en construcción
          </span>
        </div>

        {/* Logo */}
        <div
          className="mb-10 animate-fade-in-up"
          style={{ animationDelay: '0.15s' }}
        >
          <Image
            src="/Assets/Logo cc.png"
            alt="Carnes & Cortes"
            width={360}
            height={159}
            priority
            style={{ filter: 'drop-shadow(0 0 48px rgba(196,30,58,0.22))' }}
          />
        </div>

        {/* Divisor ornamental */}
        <div
          className="flex items-center gap-3 mb-10 animate-fade-in-up"
          style={{ width: '240px', animationDelay: '0.25s' }}
        >
          <div style={{ flex: 1, height: '1px', background: 'linear-gradient(90deg, transparent, rgba(196,30,58,0.65))' }} />
          <span style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
            <span style={{ width: 4, height: 4, borderRadius: '50%', background: 'rgba(196,30,58,0.45)', display: 'block' }} />
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#C41E3A', display: 'block' }} />
            <span style={{ width: 4, height: 4, borderRadius: '50%', background: 'rgba(196,30,58,0.45)', display: 'block' }} />
          </span>
          <div style={{ flex: 1, height: '1px', background: 'linear-gradient(270deg, transparent, rgba(196,30,58,0.65))' }} />
        </div>

        {/* Titular */}
        <h1
          className="font-display font-bold text-white leading-[1.08] mb-6 animate-fade-in-up"
          style={{ animationDelay: '0.30s' }}
        >
          <span className="block text-4xl sm:text-5xl lg:text-[3.4rem]">
            Algo extraordinario
          </span>
          <span
            className="block text-4xl sm:text-5xl lg:text-[3.4rem] italic mt-1"
            style={{ color: '#C41E3A' }}
          >
            está en camino
          </span>
        </h1>

        {/* Cuerpo */}
        <p
          className="text-base sm:text-lg leading-relaxed mb-3 max-w-lg animate-fade-in-up"
          style={{ color: 'rgba(255,255,255,0.44)', animationDelay: '0.42s' }}
        >
          Estamos digitalizando 15 años de tradición y pasión por los mejores cortes de carne.
          Una experiencia de compra premium, diseñada para quienes exigen lo mejor,
          llegará muy pronto a tu pantalla.
        </p>

        <p
          className="text-sm mb-14 animate-fade-in-up"
          style={{ color: 'rgba(255,255,255,0.22)', animationDelay: '0.50s' }}
        >
          Mientras tanto, puedes contactarnos directamente por WhatsApp para hacer tu pedido.
        </p>

        {/* CTA WhatsApp */}
        <a
          href="https://wa.me/5573001234567"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-3 text-white font-bold text-sm uppercase tracking-wider rounded-full px-10 py-4 transition-all duration-300 hover:-translate-y-0.5 shadow-red-glow animate-fade-in-up"
          style={{
            background: '#C41E3A',
            letterSpacing: '0.08em',
            animationDelay: '0.60s',
          }}
        >
          <svg className="w-5 h-5 shrink-0" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488" />
          </svg>
          Hacer pedido por WhatsApp
        </a>

        {/* Sello de marca */}
        <p
          className="mt-16 text-xs uppercase animate-fade-in-up"
          style={{ color: 'rgba(255,255,255,0.13)', letterSpacing: '0.28em', animationDelay: '0.80s' }}
        >
          Carnes &amp; Cortes · Desde 2009
        </p>
      </div>
    </section>
  );
}
