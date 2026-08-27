import type { Dictionary } from "@/lib/i18n";

type AboutSectionProps = {
  content: Dictionary["about"];
};

/**
 * Una columna a 68ch y prosa. Sin foto, sin timeline y sin cards de
 * certificaciones. Debajo, los datos duros en mono entre hairlines.
 */
export function AboutSection({ content }: AboutSectionProps) {
  return (
    <section id="about" className="border-t border-hairline py-[var(--space-section)]">
      <h2 className="text-h2 text-text">{content.title}</h2>

      <div className="mt-[var(--space-block)] max-w-[68ch]">
        {content.paragraphs.map((paragraph) => (
          <p key={paragraph} className="mt-6 text-text-muted first:mt-0">
            {paragraph}
          </p>
        ))}
      </div>

      {/* La tira no hereda el 68ch: esa medida es para la prosa, y a 68ch los
          cuatro datos no entran en una fila. */}
      <ul className="mt-[var(--space-block)] flex max-w-3xl flex-wrap gap-x-2 gap-y-1 border-y border-hairline py-4 font-mono text-meta text-rail">
        {content.facts.map((fact, index) => (
          <li key={fact} className="flex gap-2">
            {index > 0 ? <span aria-hidden="true">·</span> : null}
            {fact}
          </li>
        ))}
      </ul>
    </section>
  );
}
