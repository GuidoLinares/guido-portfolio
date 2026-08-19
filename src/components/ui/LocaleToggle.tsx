"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { LOCALES, LOCALE_LABEL, type Locale, withLocale } from "@/lib/locales";

type LocaleToggleProps = {
  current: Locale;
  /** Etiqueta accesible del grupo, ya traducida. */
  label: string;
};

/**
 * Toggle de idioma. Preserva la ruta actual: /es/work/<slug> -> /en/work/<slug>.
 * Son links reales: la persistencia de la elección la hace el middleware al ver
 * el locale de la URL, así que no se escribe ninguna cookie desde el cliente.
 */
export function LocaleToggle({ current, label }: LocaleToggleProps) {
  const pathname = usePathname();

  return (
    <nav aria-label={label}>
      <ul className="flex items-center gap-2 font-mono text-meta">
        {LOCALES.map((locale, index) => (
          <li key={locale} className="flex items-center gap-2">
            {index > 0 ? (
              <span aria-hidden="true" className="text-rail">
                /
              </span>
            ) : null}
            {locale === current ? (
              <span aria-current="true" className="text-text">
                {LOCALE_LABEL[locale]}
              </span>
            ) : (
              <Link
                href={withLocale(pathname, locale)}
                hrefLang={locale}
                className="text-rail hover:text-text"
              >
                {LOCALE_LABEL[locale]}
              </Link>
            )}
          </li>
        ))}
      </ul>
    </nav>
  );
}
