import type { Dictionary } from "@/lib/i18n";

type DatabaseSectionProps = {
  content: Dictionary["database"];
};

/**
 * Sección de capacidad, no de proyecto: sin card, sin página propia y sin badge
 * de estado. Dos columnas separadas por un hairline vertical que desaparece al
 * colapsar a una sola columna.
 */
export function DatabaseSection({ content }: DatabaseSectionProps) {
  return (
    <section id="database" className="border-t border-hairline py-[var(--space-section)]">
      <h2 className="text-h2 text-text">{content.title}</h2>

      <p className="mt-6 max-w-2xl text-text-muted">{content.lead}</p>

      <div className="mt-[var(--space-block)] grid gap-[var(--space-block)] md:grid-cols-2 md:gap-0">
        {content.columns.map((column, index) => (
          <div
            key={column.title}
            className={
              index === 0
                ? "md:pr-[var(--space-block)]"
                : "md:border-l md:border-hairline md:pl-[var(--space-block)]"
            }
          >
            <h3 className="font-mono text-meta text-rail">{column.title}</h3>

            {/* Sin viñeta: el separador es el hairline de cada ítem. */}
            <ul className="mt-4">
              {column.items.map((item) => (
                <li key={item} className="border-t border-hairline py-4 text-text-muted">
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
