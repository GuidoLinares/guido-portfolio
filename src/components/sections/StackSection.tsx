import type { Dictionary } from "@/lib/i18n";

type StackSectionProps = {
  content: Dictionary["stack"];
};

/**
 * Stack en tres niveles. Los niveles son la información: sin logos, sin chips,
 * sin barras ni porcentajes. Las tecnologías reciben el mismo tratamiento que el
 * stack de las cards — mono, separadas por puntos medios.
 */
export function StackSection({ content }: StackSectionProps) {
  return (
    <section id="stack" className="border-t border-hairline py-[var(--space-section)]">
      <h2 className="text-h2 text-text">{content.title}</h2>

      <div className="mt-[var(--space-block)] flex max-w-3xl flex-col">
        {content.levels.map((level) => (
          <div key={level.label} className="border-t border-hairline py-6">
            <h3 className="font-mono text-meta uppercase tracking-wider text-rail">
              {level.label}
            </h3>
            <p className="mt-3 font-mono text-meta text-rail">{level.items.join(" · ")}</p>
          </div>
        ))}
      </div>

      <p className="mt-[var(--space-block)] max-w-2xl text-text-muted">{content.note}</p>
    </section>
  );
}
