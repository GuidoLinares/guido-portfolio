import { Hero } from "@/components/hero/Hero";
import { Rail } from "@/components/rail/Rail";
import { projectsInOrder } from "@/content/projects";
import { DEFAULT_LOCALE, getDictionary, isLocale } from "@/lib/i18n";

type PageProps = {
  params: Promise<{ locale: string }>;
};

/**
 * Andamio temporal. El hero, las cards y las páginas de case study todavía no
 * están: acá solo se verifica que el shell tipográfico, el rail y el hairline
 * de progreso funcionen contra metadata real.
 */
export default async function HomePage({ params }: PageProps) {
  const { locale } = await params;
  const resolved = isLocale(locale) ? locale : DEFAULT_LOCALE;
  const dictionary = getDictionary(resolved);

  return (
    <div className="mx-auto w-full max-w-6xl px-6">
      <Hero hero={dictionary.hero} />

      {projectsInOrder().map((project) => (
        <section
          key={project.slug}
          className="reveal grid gap-[var(--space-block)] border-t border-hairline py-[var(--space-section)] md:grid-cols-[10rem_1fr]"
        >
          <Rail
            entries={[
              { label: "stack", value: project.stack.join(" · ") },
              { label: "estado", value: project.status },
            ]}
          />
          <p className="font-mono text-meta text-rail">{project.slug}</p>
        </section>
      ))}
    </div>
  );
}
