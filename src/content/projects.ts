import { CONTENT_SOURCE_LOCALE, FrontmatterError, readEntry, workSlugs } from "@/lib/mdx";

/**
 * Contrato del frontmatter de los case studies y la lista derivada de él.
 *
 * La metadata no se mantiene a mano: sale de `content/work/<slug>/es.mdx`, se
 * valida al cargar este módulo y cualquier campo faltante o mal tipado corta el
 * build. Solo servidor — lee el filesystem.
 */

export const PROJECT_STATUSES = ["produccion", "desarrollo"] as const;

export type ProjectStatus = (typeof PROJECT_STATUSES)[number];

export type ProjectMetric = {
  readonly label: string;
  readonly value: string;
};

export type ProjectFrontmatter = {
  readonly slug: string;
  readonly title: string;
  readonly tagline: string;
  readonly company: string;
  readonly scope: string;
  readonly role: string;
  readonly period: string;
  readonly status: ProjectStatus;
  readonly stack: readonly string[];
  readonly metrics: readonly ProjectMetric[];
  readonly order: number;
};

/** Un case study ya validado. */
export type Project = ProjectFrontmatter;

const TEXT_FIELDS = ["slug", "title", "tagline", "company", "scope", "role", "period"] as const;

const KNOWN_FIELDS: readonly string[] = [...TEXT_FIELDS, "status", "stack", "metrics", "order"];

/**
 * Acumula todos los problemas antes de fallar: un frontmatter roto se arregla
 * de una vez, no de a un error por build.
 */
function validate(data: Record<string, unknown>, from: string): Project {
  const problems: string[] = [];

  const text = (field: string): string => {
    const value = data[field];

    if (typeof value !== "string" || value.trim() === "") {
      problems.push(`${field}: falta, está vacío o no es texto`);
      return "";
    }

    return value;
  };

  const status = ((): ProjectStatus => {
    const value = data.status;

    if (typeof value !== "string" || !(PROJECT_STATUSES as readonly string[]).includes(value)) {
      problems.push(
        `status: tiene que ser ${PROJECT_STATUSES.map((item) => `"${item}"`).join(" o ")}, llegó ${JSON.stringify(value)}`,
      );
      return "desarrollo";
    }

    return value as ProjectStatus;
  })();

  const stack = ((): readonly string[] => {
    const value = data.stack;

    if (!Array.isArray(value) || value.length === 0) {
      problems.push("stack: falta o no es una lista con al menos un elemento");
      return [];
    }

    const items = value.filter((item): item is string => typeof item === "string" && item.trim() !== "");

    if (items.length !== value.length) {
      problems.push("stack: todos los elementos tienen que ser texto no vacío");
    }

    return items;
  })();

  const metrics = ((): readonly ProjectMetric[] => {
    const value = data.metrics;

    if (!Array.isArray(value) || value.length === 0) {
      problems.push("metrics: falta o no es una lista con al menos un elemento");
      return [];
    }

    return value.flatMap((item, position): ProjectMetric[] => {
      const at = `metrics[${position}]`;

      if (typeof item !== "object" || item === null || Array.isArray(item)) {
        problems.push(`${at}: tiene que ser un mapa con label y value`);
        return [];
      }

      const record = item as Record<string, unknown>;
      const extra = Object.keys(record).filter((key) => key !== "label" && key !== "value");

      if (extra.length > 0) {
        problems.push(`${at}: claves no reconocidas: ${extra.join(", ")}`);
      }

      const ok = (key: "label" | "value"): string => {
        const field = record[key];

        if (typeof field !== "string" || field.trim() === "") {
          problems.push(`${at}.${key}: falta, está vacío o no es texto`);
          return "";
        }

        return field;
      };

      return [{ label: ok("label"), value: ok("value") }];
    });
  })();

  const order = ((): number => {
    const value = data.order;

    if (typeof value !== "number" || !Number.isInteger(value)) {
      problems.push(`order: tiene que ser un entero, llegó ${JSON.stringify(value)}`);
      return 0;
    }

    return value;
  })();

  const unknownFields = Object.keys(data).filter((key) => !KNOWN_FIELDS.includes(key));

  if (unknownFields.length > 0) {
    problems.push(`claves no reconocidas: ${unknownFields.join(", ")}`);
  }

  const texts = Object.fromEntries(TEXT_FIELDS.map((field) => [field, text(field)])) as Record<
    (typeof TEXT_FIELDS)[number],
    string
  >;

  if (problems.length > 0) {
    throw new FrontmatterError(from, problems.map((problem) => `  - ${problem}`).join("\n"));
  }

  return { ...texts, status, stack, metrics, order };
}

function loadProjects(): readonly Project[] {
  const slugs = workSlugs();

  if (slugs.length === 0) {
    throw new Error("No hay case studies en src/content/work");
  }

  const projects = slugs.map((dir) => {
    const { data, from } = readEntry(dir, CONTENT_SOURCE_LOCALE);
    const project = validate(data, from);

    if (project.slug !== dir) {
      throw new FrontmatterError(
        from,
        `  - slug: "${project.slug}" no coincide con la carpeta "${dir}"`,
      );
    }

    return project;
  });

  const orders = new Set(projects.map((project) => project.order));

  if (orders.size !== projects.length) {
    throw new Error(
      `Hay valores de order repetidos en src/content/work: ${projects
        .map((project) => `${project.slug}=${project.order}`)
        .join(", ")}`,
    );
  }

  return projects.toSorted((a, b) => a.order - b.order);
}

/** Los case studies, en el orden declarado por su frontmatter. */
export const PROJECTS: readonly Project[] = loadProjects();

export const PROJECT_SLUGS: readonly string[] = PROJECTS.map((project) => project.slug);

export function getProject(slug: string): Project | undefined {
  return PROJECTS.find((project) => project.slug === slug);
}

export function isProjectSlug(value: string): boolean {
  return PROJECT_SLUGS.includes(value);
}
