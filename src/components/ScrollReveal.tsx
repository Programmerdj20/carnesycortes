'use client';

import { useEffect } from 'react';

export default function ScrollReveal() {
  useEffect(() => {
    let frameId: number;

    const init = () => {
      const elements = document.querySelectorAll<HTMLElement>('.reveal-on-scroll');
      if (elements.length === 0) return;

      // Marcar inmediatamente los elementos ya visibles en el viewport
      elements.forEach(el => {
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) {
          el.classList.add('revealed');
        }
      });

      const observer = new IntersectionObserver(
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

      return () => observer.disconnect();
    };

    // Doble requestAnimationFrame para garantizar que el layout esté completamente calculado
    frameId = requestAnimationFrame(() => {
      frameId = requestAnimationFrame(() => {
        init();
      });
    });

    return () => cancelAnimationFrame(frameId);
  }, []);

  return null;
}
