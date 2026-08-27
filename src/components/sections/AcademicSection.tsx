import type { Dictionary } from "@/lib/i18n";

type AcademicSectionProps = {
  content: Dictionary["academic"];
};

/**
 * Trabajos de la carrera. Tratamiento deliberadamente compacto: no son cards,
 * es una lista en mono de una línea por entrada separada por hairlines. La
 * bajada es la que hace el encuadre —son trabajos de cursada, no proyectos
 * profesionales— y esa distinción es la razón de que la sección esté separada de
 * Proyectos propios.
 */
export function AcademicSection({ content }: AcademicSectionProps) {
  return (
    <section id="academic" className="border-t border-hairline py-[var(--space-section)]">
      <h2 className="text-h2 text-text">{content.title}</h2>

      <p className="mt-6 max-w-2xl text-text-muted">{content.lead}</p>

      <ul className="mt-[var(--space-block)] max-w-3xl">
        {content.items.map((item) => (
          <li
            key={item.name}
            className="flex flex-wrap items-baseline gap-x-2 gap-y-1 border-t border-hairline py-4 font-mono text-meta"
          >
            <span className="text-text">{item.name}</span>

            <span aria-hidden="true" className="text-rail">
              ·
            </span>
            <span className="text-text-muted">{item.description}</span>

            <span aria-hidden="true" className="text-rail">
              ·
            </span>
            <span className="text-rail">{item.tech}</span>

            {item.link ? (
              <>
                <span aria-hidden="true" className="text-rail">
                  ·
                </span>
                <a
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-rail hover:text-text"
                >
                  {content.linkLabel}
                </a>
              </>
            ) : null}
          </li>
        ))}
      </ul>
    </section>
  );
}
