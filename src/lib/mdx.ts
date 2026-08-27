import { existsSync, readFileSync, readdirSync } from "node:fs";
import path from "node:path";

import type { Locale } from "@/lib/locales";

/**
 * Mecánica de resolución y lectura de los MDX de case studies. Este módulo no
 * conoce el schema del frontmatter: devuelve datos crudos, y tipar es
 * responsabilidad de `@/content/projects`, que es el dueño del contrato.
 *
 * Solo servidor: toca el filesystem y corre en build.
 */

export const WORK_DIR = path.join(process.cwd(), "src", "content", "work");

/** Locale del que se deriva la metadata: `es` es la fuente de verdad. */
export const CONTENT_SOURCE_LOCALE: Locale = "es";

const KEY = /^([A-Za-z_][A-Za-z0-9_]*):[ \t]*(.*)$/;
const LIST_ITEM = /^( +)-[ \t]+(.*)$/;
const NESTED_KEY = /^( +)([A-Za-z_][A-Za-z0-9_]*):[ \t]*(.*)$/;

export class FrontmatterError extends Error {
  constructor(source: string, detail: string) {
    super(`Frontmatter inválido en ${source}:\n${detail}`);
    this.name = "FrontmatterError";
  }
}

/** Devuelve el error para lanzarlo en el call site, así el flujo se estrecha. */
function invalid(source: string, line: number, detail: string): FrontmatterError {
  // +2: la línea 1 del archivo es el `---` de apertura.
  return new FrontmatterError(source, `  - línea ${line + 2}: ${detail}`);
}

export function rel(absolute: string): string {
  return path.relative(process.cwd(), absolute).replaceAll(path.sep, "/");
}

/** Carpetas bajo content/work, en orden alfabético. Una por case study. */
export function workSlugs(): readonly string[] {
  if (!existsSync(WORK_DIR)) {
    throw new Error(`No existe el directorio de contenido: ${rel(WORK_DIR)}`);
  }

  return readdirSync(WORK_DIR, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort();
}

export function workEntryPath(slug: string, locale: Locale): string {
  return path.join(WORK_DIR, slug, `${locale}.mdx`);
}

/** Si un locale todavía no tiene traducción, su ruta no se genera. */
export function hasWorkEntry(slug: string, locale: Locale): boolean {
  return existsSync(workEntryPath(slug, locale));
}

/**
 * Separa el frontmatter del cuerpo. Exige los delimitadores: un archivo sin
 * frontmatter es un error, no un archivo sin metadata.
 */
export function splitFrontmatter(source: string, from: string): { block: string; body: string } {
  const lines = source.replace(/^\uFEFF/, "").split(/\r?\n/);

  if (lines[0].trimEnd() !== "---") {
    throw new FrontmatterError(from, "  - el archivo tiene que empezar con una línea `---`");
  }

  const closing = lines.findIndex((line, index) => index > 0 && line.trimEnd() === "---");

  if (closing === -1) {
    throw new FrontmatterError(from, "  - falta la línea `---` que cierra el frontmatter");
  }

  return {
    block: lines.slice(1, closing).join("\n"),
    body: lines.slice(closing + 1).join("\n"),
  };
}

/**
 * Parser del subconjunto de YAML que usa el frontmatter: escalares (`k: "v"`),
 * secuencias de escalares y secuencias de mapas de un nivel. Todo lo demás es
 * error explícito — sin degradación silenciosa, que es justo lo que el build
 * tiene que atrapar.
 */
export function parseFrontmatterBlock(block: string, from: string): Record<string, unknown> {
  if (block.includes("\t")) {
    throw new FrontmatterError(from, "  - hay tabulaciones: YAML exige espacios");
  }

  const lines = block.split("\n");
  const result: Record<string, unknown> = {};
  let index = 0;

  const skippable = (line: string) => line.trim() === "" || line.trimStart().startsWith("#");

  while (index < lines.length) {
    const line = lines[index];

    if (skippable(line)) {
      index += 1;
      continue;
    }
    if (line.startsWith(" ")) {
      throw invalid(from, index, `indentación inesperada: ${JSON.stringify(line)}`);
    }

    const entry = KEY.exec(line);

    if (!entry) {
      throw invalid(from, index, `no es una clave \`nombre: valor\`: ${JSON.stringify(line)}`);
    }

    const [, key, inline] = entry;

    if (key in result) {
      throw invalid(from, index, `clave repetida: ${key}`);
    }

    if (inline.trim() !== "") {
      result[key] = scalar(inline, from, index);
      index += 1;
      continue;
    }

    // Clave sin valor en la misma línea: abre una secuencia indentada.
    const items: unknown[] = [];
    const opened = index;
    index += 1;

    while (index < lines.length) {
      const raw = lines[index];

      if (skippable(raw)) {
        index += 1;
        continue;
      }
      if (!raw.startsWith(" ")) {
        break;
      }

      const item = LIST_ITEM.exec(raw);

      if (!item) {
        throw invalid(from, index, `se esperaba un elemento de lista (\`- …\`) dentro de ${key}`);
      }

      const [, indent, content] = item;
      const pair = KEY.exec(content);

      if (!pair || pair[2].trim() === "") {
        items.push(scalar(content, from, index));
        index += 1;
        continue;
      }

      // Mapa: la primera clave viaja en la línea del guion, el resto indentado.
      const record: Record<string, unknown> = { [pair[1]]: scalar(pair[2], from, index) };
      index += 1;

      while (index < lines.length) {
        const next = lines[index];
        const nested = NESTED_KEY.exec(next);

        if (skippable(next) || !nested || nested[1].length <= indent.length) {
          break;
        }
        if (nested[2] in record) {
          throw invalid(from, index, `clave repetida en ${key}: ${nested[2]}`);
        }

        record[nested[2]] = scalar(nested[3], from, index);
        index += 1;
      }

      items.push(record);
    }

    if (items.length === 0) {
      throw invalid(from, opened, `${key} no tiene valor ni elementos`);
    }

    result[key] = items;
  }

  return result;
}

function scalar(raw: string, from: string, line: number): string | number {
  const value = raw.trim();

  if (value.startsWith('"')) {
    if (value.length < 2 || !value.endsWith('"')) {
      throw invalid(from, line, "comilla doble sin cerrar");
    }

    const inner = value.slice(1, -1);

    if (inner.includes('"')) {
      throw invalid(from, line, "no se soportan comillas escapadas dentro del valor");
    }

    return inner;
  }

  if (value.startsWith("'")) {
    throw invalid(from, line, "usar comillas dobles");
  }
  if (value === "") {
    throw invalid(from, line, "valor vacío");
  }
  if (/^-?\d+$/.test(value)) {
    return Number(value);
  }

  return value;
}

/** Lee un MDX y devuelve su frontmatter crudo más el cuerpo. */
export function readEntry(
  slug: string,
  locale: Locale,
): { data: Record<string, unknown>; body: string; from: string } {
  const file = workEntryPath(slug, locale);

  if (!existsSync(file)) {
    throw new Error(`No hay contenido para "${slug}" en ${locale}: falta ${rel(file)}`);
  }

  const from = rel(file);
  const { block, body } = splitFrontmatter(readFileSync(file, "utf8"), from);

  return { data: parseFrontmatterBlock(block, from), body, from };
}

/**
 * Resuelve el componente del cuerpo por locale y slug. El import dinámico pasa
 * por @next/mdx: `remark-frontmatter` descarta el bloque YAML y el mapeo de
 * componentes sale de `src/mdx-components.tsx`.
 */
export async function loadWorkBody(slug: string, locale: Locale) {
  if (!hasWorkEntry(slug, locale)) {
    throw new Error(`No hay contenido para "${slug}" en ${locale}: falta ${rel(workEntryPath(slug, locale))}`);
  }

  const mdx = await import(`../content/work/${slug}/${locale}.mdx`);

  return mdx.default;
}
