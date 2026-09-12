import type { ReactNode } from "react";

import { LocaleToggle } from "@/components/ui/LocaleToggle";
import { ScrollHairline } from "@/components/ui/ScrollHairline";
import { DEFAULT_LOCALE, getDictionary, isLocale } from "@/lib/i18n";

/**
 * Chrome del portfolio técnico: marca, toggle de idioma y hairline de scroll.
 *
 * Vive en un route group y no en el layout de `[locale]` porque la landing
 * comercial de `/studio` cuelga del mismo locale y no puede heredar nada de
 * esto: son dos públicos distintos. El group no aparece en la URL, así que
 * `/es` y `/es/work/<slug>` siguen resolviendo igual que antes.
 */

type PortfolioParams = {
  params: Promise<{ locale: string }>;
};

export default async function PortfolioLayout({
  children,
  params,
}: PortfolioParams & { children: ReactNode }) {
  const { locale } = await params;
  const resolved = isLocale(locale) ? locale : DEFAULT_LOCALE;
  const dictionary = getDictionary(resolved);

  return (
    <>
      <ScrollHairline />

      <header className="border-b border-hairline">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-6 py-5">
          <span className="font-mono text-meta text-text">{dictionary.nav.brand}</span>
          <LocaleToggle current={resolved} label={dictionary.nav.languageLabel} />
        </div>
      </header>

      {/* tabIndex -1: sin esto el foco no aterriza acá al usar el skip link. */}
      <main id="content" tabIndex={-1}>
        {children}
      </main>
    </>
  );
}
