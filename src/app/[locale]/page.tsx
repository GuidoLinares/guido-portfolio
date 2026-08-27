import { Hero } from "@/components/hero/Hero";
import { AboutSection } from "@/components/sections/AboutSection";
import { AcademicSection } from "@/components/sections/AcademicSection";
import { ContactSection } from "@/components/sections/ContactSection";
import { DatabaseSection } from "@/components/sections/DatabaseSection";
import { ProjectsSection } from "@/components/sections/ProjectsSection";
import { StackSection } from "@/components/sections/StackSection";
import { WorkCard } from "@/components/work/WorkCard";
import { PROJECTS } from "@/content/projects";
import { DEFAULT_LOCALE, getDictionary, isLocale } from "@/lib/i18n";

type PageProps = {
  params: Promise<{ locale: string }>;
};

export default async function HomePage({ params }: PageProps) {
  const { locale } = await params;
  const resolved = isLocale(locale) ? locale : DEFAULT_LOCALE;
  const dictionary = getDictionary(resolved);

  return (
    <div className="mx-auto w-full max-w-6xl px-6">
      <Hero hero={dictionary.hero} />

      <AboutSection content={dictionary.about} />

      <section id="work" className="border-t border-hairline py-[var(--space-section)]">
        <h2 className="text-h2 text-text">{dictionary.nav.work}</h2>

        <ul className="mt-[var(--space-block)] flex max-w-3xl flex-col gap-6">
          {PROJECTS.map((project) => (
            <li key={project.slug} className="reveal">
              <WorkCard
                href={`/${resolved}/work/${project.slug}`}
                title={project.title}
                tagline={project.tagline}
                stack={project.stack}
                status={project.status}
                statusLabel={dictionary.work.status[project.status]}
              />
            </li>
          ))}
        </ul>
      </section>

      <ProjectsSection content={dictionary.projects} />

      <AcademicSection content={dictionary.academic} />

      <DatabaseSection content={dictionary.database} />

      <StackSection content={dictionary.stack} />

      <ContactSection content={dictionary.contact} />
    </div>
  );
}
