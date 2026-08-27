import type { Metadata } from "next";
import { Bricolage_Grotesque, IBM_Plex_Mono, Public_Sans } from "next/font/google";
import type { ReactNode } from "react";

import { LocaleToggle } from "@/components/ui/LocaleToggle";
import { ScrollHairline } from "@/components/ui/ScrollHairline";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";

import { SITE } from "@/content/site";
import { DEFAULT_LOCALE, LOCALES, getDictionary, isLocale } from "@/lib/i18n";
import { OG_LOCALE } from "@/lib/locales";

import "../globals.css";

const display = Bricolage_Grotesque({
  variable: "--font-bricolage",
  subsets: ["latin"],
  display: "swap",
});

const body = Public_Sans({
  variable: "--font-public",
  subsets: ["latin"],
  display: "swap",
});

const mono = IBM_Plex_Mono({
  variable: "--font-plex",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500"],
});

type LocaleParams = {
  params: Promise<{ locale: string }>;
};

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

/** Todo estático en build: cualquier locale fuera de la lista es 404. */
export const dynamicParams = false;

export async function generateMetadata({ params }: LocaleParams): Promise<Metadata> {
  const { locale } = await params;
  const resolved = isLocale(locale) ? locale : DEFAULT_LOCALE;
  const dictionary = getDictionary(resolved);

  const title = `${dictionary.nav.brand} — ${dictionary.hero.role}`;

  return {
    // Única fuente de verdad del dominio: SITE.url. Con esto, todas las URLs
    // relativas de metadata se resuelven absolutas.
    metadataBase: new URL(SITE.url),
    title: {
      // El default no recibe el template: es el title de la home.
      default: title,
      template: `%s — ${dictionary.nav.brand}`,
    },
    description: dictionary.hero.positioning,
    alternates: {
      canonical: `/${resolved}`,
      languages: Object.fromEntries([
        ...LOCALES.map((item) => [item, `/${item}`]),
        ["x-default", `/${DEFAULT_LOCALE}`],
      ]),
    },
    openGraph: {
      type: "website",
      siteName: dictionary.nav.brand,
      locale: OG_LOCALE[resolved],
      url: `/${resolved}`,
      title,
      description: dictionary.hero.positioning,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: dictionary.hero.positioning,
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: LocaleParams & { children: ReactNode }) {
  const { locale } = await params;
  const resolved = isLocale(locale) ? locale : DEFAULT_LOCALE;
  const dictionary = getDictionary(resolved);

  return (
    <html
      lang={resolved}
      className={`${display.variable} ${body.variable} ${mono.variable}`}
    >
      <body className="min-h-dvh antialiased">
        <a
          href="#content"
          className="sr-only font-mono text-meta focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:bg-night focus:px-3 focus:py-2 focus:text-text"
        >
          {dictionary.nav.skipToContent}
        </a>

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

        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
