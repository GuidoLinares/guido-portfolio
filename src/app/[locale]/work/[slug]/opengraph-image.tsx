import { ImageResponse } from "next/og";

import { PROJECTS, getProject } from "@/content/projects";
import { LOCALES } from "@/lib/i18n";
import { OG_CONTENT_TYPE, OG_SIZE, OgCard, ogFonts } from "@/lib/og";
import { hasWorkEntry } from "@/lib/mdx";

export const alt = "Case study";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

/** Los mismos pares locale/slug que emite la página: sin traducción no hay imagen. */
export function generateStaticParams() {
  return LOCALES.flatMap((locale) =>
    PROJECTS.filter((project) => hasWorkEntry(project.slug, locale)).map((project) => ({
      locale,
      slug: project.slug,
    })),
  );
}

type ImageParams = {
  params: Promise<{ locale: string; slug: string }>;
};

export default async function OpengraphImage({ params }: ImageParams) {
  const { slug } = await params;
  const project = getProject(slug);

  if (!project) {
    throw new Error(`No hay case study para el slug "${slug}"`);
  }

  return new ImageResponse(
    <OgCard
      title={project.title}
      meta={[project.company, project.scope, project.period].join(" · ")}
    />,
    { ...OG_SIZE, fonts: await ogFonts() },
  );
}
