/**
 * Metadata tipada de los case studies. Solo metadata: la prosa vive en
 * `src/content/work/<slug>/{es,en}.mdx`.
 */

export const PROJECT_SLUGS = ["roisa-core", "procesos-masivos", "integracion-erp"] as const;

export type ProjectSlug = (typeof PROJECT_SLUGS)[number];

/** Valor de máquina. La etiqueta traducida sale del diccionario, no de acá. */
export type ProjectStatus = "production" | "active-development";

export type Project = {
  slug: ProjectSlug;
  /** Orden de aparición en el índice. */
  order: number;
  status: ProjectStatus;
  stack: readonly string[];
  /**
   * Metadata del rail de anotación. Quedan sin definir hasta tener valores
   * reales: si un bloque no tiene metadata real, no lleva rail.
   */
  year?: number;
  scale?: string;
};

export const PROJECTS: readonly Project[] = [
  {
    slug: "roisa-core",
    order: 1,
    status: "production",
    stack: ["NestJS 11", "Prisma 7", "PostgreSQL", "Angular 21"],
  },
  {
    slug: "procesos-masivos",
    order: 2,
    status: "production",
    stack: ["Next.js 16", "SQL Server", "Claude API"],
  },
  {
    slug: "integracion-erp",
    order: 3,
    status: "active-development",
    stack: ["Python 3.12", "FastAPI", "XML-RPC"],
  },
];

export function isProjectSlug(value: string): value is ProjectSlug {
  return (PROJECT_SLUGS as readonly string[]).includes(value);
}

export function getProject(slug: string): Project | undefined {
  return PROJECTS.find((project) => project.slug === slug);
}

export function projectsInOrder(): readonly Project[] {
  return [...PROJECTS].sort((a, b) => a.order - b.order);
}
