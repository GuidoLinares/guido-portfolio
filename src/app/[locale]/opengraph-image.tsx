import { ImageResponse } from "next/og";

import { DEFAULT_LOCALE, LOCALES, getDictionary, isLocale } from "@/lib/i18n";
import { OG_CONTENT_TYPE, OG_SIZE, OgCard, ogFonts } from "@/lib/og";

export const alt = "Guido Linares";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

/** Prerenderiza una imagen por locale en lugar de generarlas en runtime. */
export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

type ImageParams = {
  params: Promise<{ locale: string }>;
};

export default async function OpengraphImage({ params }: ImageParams) {
  const { locale } = await params;
  const dictionary = getDictionary(isLocale(locale) ? locale : DEFAULT_LOCALE);

  return new ImageResponse(
    <OgCard title={dictionary.hero.name} meta={dictionary.hero.role} />,
    { ...OG_SIZE, fonts: await ogFonts() },
  );
}
