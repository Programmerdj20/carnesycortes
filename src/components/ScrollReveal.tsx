'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export default function ScrollReveal() {
  const pathname = usePathname();

  useEffect(() => {
    let frameId: number;
    let observer: IntersectionObserver;

    const init = () => {
      const elements = document.querySelectorAll<HTMLElement>('.reveal-on-scroll');

      // Reiniciar estado de animación en cada navegación
      elements.forEach(el => el.classList.remove('revealed'));

      // Revelar inmediatamente los ya visibles en el viewport
      elements.forEach(el => {
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) {
          el.classList.add('revealed');
        }
      });

      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              entry.target.classList.add('revealed');
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.05 }
      );

      elements.forEach(el => {
        if (!el.classList.contains('revealed')) {
          observer.observe(el);
        }
      });
    };

    // Doble RAF para garantizar que el DOM de la nueva página esté pintado
    frameId = requestAnimationFrame(() => {
      frameId = requestAnimationFrame(() => {
        init();
      });
    });

    return () => {
      cancelAnimationFrame(frameId);
      observer?.disconnect();
    };
  }, [pathname]); // Se reinicia en cada cambio de ruta

  return null;
}
