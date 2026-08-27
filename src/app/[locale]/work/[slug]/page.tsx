import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { Rail } from "@/components/rail/Rail";
import { MetricsStrip } from "@/components/work/MetricsStrip";
import { PROJECTS, getProject } from "@/content/projects";
import type { Project } from "@/content/projects";
import { DEFAULT_LOCALE, LOCALES, getDictionary, isLocale } from "@/lib/i18n";
import type { Locale } from "@/lib/i18n";
import { OG_LOCALE } from "@/lib/locales";
import { hasWorkEntry, loadWorkBody } from "@/lib/mdx";

type WorkParams = {
  params: Promise<{ locale: string; slug: string }>;
};

/** Solo los pares locale/slug que tienen archivo. Sin traducción no hay ruta. */
export function generateStaticParams() {
  return LOCALES.flatMap((locale) =>
    PROJECTS.filter((project) => hasWorkEntry(project.slug, locale)).map((project) => ({
      locale,
      slug: project.slug,
    })),
  );
}

export const dynamicParams = false;

export async function generateMetadata({ params }: WorkParams): Promise<Metadata> {
  const { locale, slug } = await params;
  const project = getProject(slug);

  if (!project || !isLocale(locale)) {
    return {};
  }

  // Solo los locales con archivo: apuntar un hreflang a una ruta que no existe
  // es peor que no declararlo.
  const traducidos = LOCALES.filter((item) => hasWorkEntry(slug, item));
  const url = `/${locale}/work/${slug}`;

  return {
    title: project.title,
    description: project.tagline,
    alternates: {
      canonical: url,
      languages: Object.fromEntries(
        traducidos.map((item) => [item, `/${item}/work/${slug}`]),
      ),
    },
    openGraph: {
      type: "article",
      url,
      title: project.title,
      description: project.tagline,
      locale: OG_LOCALE[locale],
    },
    twitter: {
      card: "summary_large_image",
      title: project.title,
      description: project.tagline,
    },
  };
}

/** Vecinos por el orden declarado en el frontmatter. No hay wrap-around. */
function neighbours(slug: string): { previous?: Project; next?: Project } {
  const position = PROJECTS.findIndex((project) => project.slug === slug);

  return {
    previous: position > 0 ? PROJECTS[position - 1] : undefined,
    next: position < PROJECTS.length - 1 ? PROJECTS[position + 1] : undefined,
  };
}

function NeighbourLink({
  project,
  locale,
  label,
  align,
}: {
  project: Project;
  locale: Locale;
  label: string;
  align: "start" | "end";
}) {
  return (
    <Link
      href={`/${locale}/work/${project.slug}`}
      className={`flex flex-col gap-2 ${align === "end" ? "items-end text-right" : "items-start"}`}
    >
      <span className="font-mono text-meta uppercase tracking-wider text-rail">{label}</span>
      <span className="text-h3 text-text-muted hover:text-text">{project.title}</span>
    </Link>
  );
}

export default async function WorkPage({ params }: WorkParams) {
  const { locale, slug } = await params;

  if (!isLocale(locale)) {
    notFound();
  }

  const project = getProject(slug);

  if (!project) {
    notFound();
  }

  const dictionary = getDictionary(isLocale(locale) ? locale : DEFAULT_LOCALE);
  const Body = await loadWorkBody(slug, locale);
  const { previous, next } = neighbours(slug);

  return (
    <article className="mx-auto w-full max-w-6xl px-6 py-[var(--space-section)]">
      {/* El encabezado no lleva reveal: es el LCP y arranca en su estado final. */}
      <header>
        <h1 className="text-hero text-text">{project.title}</h1>

        <p className="mt-6 max-w-2xl text-text-muted">{project.tagline}</p>

        <p className="mt-6 font-mono text-meta text-rail">
          {[project.company, project.scope, project.period].join(" · ")}
        </p>
      </header>

      <MetricsStrip metrics={project.metrics} className="reveal mt-[var(--space-block)]" />

      <div className="mt-[var(--space-section)] grid gap-[var(--space-block)] md:grid-cols-[10rem_1fr]">
        <Rail
          entries={[
            { label: dictionary.work.role, value: project.role },
            { label: dictionary.work.stack, value: project.stack.join(" · ") },
          ]}
        />

        {/* min-w-0: un grid item no baja de su min-content, y el bloque de código
            se lo llevaba a 674px desbordando la página hasta los ~1000px de
            viewport. Con esto el pre vuelve a scrollear adentro, como se diseñó.
            Medida legible: la columna corta en ~68 caracteres, no en el grid.
            reveal-blocks anima cada bloque de nivel superior del MDX por
            separado, con su propia view() timeline. */}
        <div className="reveal-blocks max-w-[68ch] min-w-0">
          <Body />
        </div>
      </div>

      {(previous || next) && (
        <nav
          aria-label={dictionary.work.pagination}
          className="reveal mt-[var(--space-section)] flex items-start justify-between gap-6 border-t border-hairline pt-[var(--space-block)]"
        >
          {previous ? (
            <NeighbourLink
              project={previous}
              locale={locale}
              label={dictionary.work.previous}
              align="start"
            />
          ) : (
            <span />
          )}

          {next ? (
            <NeighbourLink
              project={next}
              locale={locale}
              label={dictionary.work.next}
              align="end"
            />
          ) : (
            <span />
          )}
        </nav>
      )}
    </article>
  );
}
