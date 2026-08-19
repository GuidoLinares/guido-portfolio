import type { CSSProperties } from "react";

import type { Dictionary } from "@/lib/i18n";

type HeroProps = {
  hero: Dictionary["hero"];
};

/**
 * Elemento firma. La secuencia write -> read back -> mismatch -> retry -> commit
 * corre una vez al cargar y se detiene en commit; el paso activo va en
 * --color-signal y los anteriores en --color-rail.
 *
 * Server Component a propósito: la orquestación es CSS puro (ver globals.css,
 * movimiento 1), así que el hero no manda JS al cliente y el nombre en display
 * —el LCP— pinta en el primer frame sin esperar hidratación.
 */
export function Hero({ hero }: HeroProps) {
  // Orden explícito: la secuencia es una cronología, no las claves de un objeto.
  const steps = [
    hero.sequence.write,
    hero.sequence.readBack,
    hero.sequence.mismatch,
    hero.sequence.retry,
    hero.sequence.commit,
  ];

  return (
    <section data-motion="hero" className="py-[var(--space-section)]">
      <h1 className="text-hero leading-none">{hero.name}</h1>

      <p className="mt-6 max-w-xl text-text-muted">{hero.positioning}</p>

      {/* <ol> porque el orden de los pasos es la información. Sin numerales
          visibles: la cronología ya la da la secuencia. */}
      <ol className="mt-[var(--space-block)] flex flex-col gap-1 font-mono text-meta">
        {steps.map((step, index) => (
          <li
            key={index}
            className={index === steps.length - 1 ? "hero-step hero-step--last" : "hero-step"}
            style={{ "--hero-step-index": String(index) } as CSSProperties}
          >
            {step}
          </li>
        ))}
      </ol>
    </section>
  );
}
