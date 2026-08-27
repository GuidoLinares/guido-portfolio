import { DotList } from "@/components/ui/DotList";
import type { Dictionary } from "@/lib/i18n";

type ProjectsSectionProps = {
  content: Dictionary["projects"];
};

/**
 * Proyectos propios. Cards más chicas que las de Trabajo: sin página propia, sin
 * badge de estado y sin reveal individual.
 *
 * Las entradas sin link no son un <a> ni tienen nada clickeable: no hay cursor de
 * mano sobre algo que no navega. El link, cuando existe, es la etiqueta al pie y
 * no la card entera.
 */
export function ProjectsSection({ content }: ProjectsSectionProps) {
  return (
    <section id="projects" className="border-t border-hairline py-[var(--space-section)]">
      <h2 className="text-h2 text-text">{content.title}</h2>

      <p className="mt-6 max-w-2xl text-text-muted">{content.lead}</p>

      <ul className="mt-[var(--space-block)] grid gap-6 md:grid-cols-3">
        {content.items.map((item) => (
          <li
            key={item.name}
            className="flex flex-col rounded-md border border-hairline p-5"
          >
            <h3 className="text-h3 text-text">{item.name}</h3>

            <p className="mt-3 text-text-muted">{item.text}</p>

            {/* mt-auto alinea el stack al pie: los textos tienen largos distintos
                y así las tres cards coinciden en la línea de datos. */}
            <DotList items={item.stack} className="mt-auto pt-5 font-mono text-meta text-rail" />

            {item.link ? (
              <a
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 font-mono text-meta text-rail hover:text-text"
              >
                {item.linkLabel}
              </a>
            ) : null}
          </li>
        ))}
      </ul>
    </section>
  );
}
