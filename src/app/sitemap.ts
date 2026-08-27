import { statSync } from "node:fs";

import type { MetadataRoute } from "next";

import { PROJECTS } from "@/content/projects";
import { SITE } from "@/content/site";
import { LOCALES, type Locale } from "@/lib/locales";
import { hasWorkEntry, workEntryPath } from "@/lib/mdx";

/**
 * Derivado de lo que realmente existe: los case studies salen de los MDX y se
 * filtran con el mismo `hasWorkEntry` que usa generateStaticParams, así que las
 * rutas sin traducción —hoy todas las /en/work/<slug>— no se listan.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const url = (...segments: string[]) => `${SITE.url}/${segments.join("/")}`;

  const localesOf = (slug: string) => LOCALES.filter((locale) => hasWorkEntry(slug, locale));

  const home = LOCALES.map((locale) => ({
    url: url(locale),
    changeFrequency: "monthly" as const,
    priority: 1,
    alternates: {
      languages: Object.fromEntries(LOCALES.map((item) => [item, url(item)])),
    },
  }));

  const work = PROJECTS.flatMap((project) =>
    localesOf(project.slug).map((locale: Locale) => ({
      url: url(locale, "work", project.slug),
      // Fecha real del archivo, no la del build.
      lastModified: statSync(workEntryPath(project.slug, locale)).mtime,
      changeFrequency: "monthly" as const,
      priority: 0.8,
      alternates: {
        languages: Object.fromEntries(
          localesOf(project.slug).map((item) => [item, url(item, "work", project.slug)]),
        ),
      },
    })),
  );

  return [...home, ...work];
}
