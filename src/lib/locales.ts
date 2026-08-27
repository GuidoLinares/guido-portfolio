/**
 * Primitivas de locale. Sin imports de diccionarios a propósito: este módulo lo
 * consumen el middleware (edge) y componentes de cliente, y ninguno de los dos
 * tiene que arrastrar el JSON de traducciones al bundle.
 * El diccionario y el tipo Dictionary viven en `@/lib/i18n`.
 */

export const LOCALES = ["es", "en"] as const;

export type Locale = (typeof LOCALES)[number];

/** `es` es el locale por defecto y la fuente de verdad de las claves. */
export const DEFAULT_LOCALE: Locale = "es";

/** Persiste la elección de idioma. La escribe el middleware, no el cliente. */
export const LOCALE_COOKIE = "locale";

/** Etiqueta del toggle. Es el código del locale, no prosa traducible. */
export const LOCALE_LABEL: Record<Locale, string> = {
  es: "ES",
  en: "EN",
};

/** Formato que espera Open Graph para el locale. */
export const OG_LOCALE: Record<Locale, string> = {
  es: "es",
  en: "en_US",
};

export function isLocale(value: string | undefined | null): value is Locale {
  return typeof value === "string" && (LOCALES as readonly string[]).includes(value);
}

/**
 * Reescribe el primer segmento de la ruta al locale pedido, preservando el
 * resto: `/es/work/<slug>` -> `/en/work/<slug>`.
 */
export function withLocale(pathname: string, locale: Locale): string {
  const segments = pathname.split("/").filter(Boolean);

  if (isLocale(segments[0])) {
    segments[0] = locale;
  } else {
    segments.unshift(locale);
  }

  return `/${segments.join("/")}`;
}
