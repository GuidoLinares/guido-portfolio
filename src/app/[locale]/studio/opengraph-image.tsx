import { ImageResponse } from "next/og";

import { COPY } from "@/content/studio";
import { OG_CONTENT_TYPE, OG_SIZE, OgCard, ogFonts } from "@/lib/og";

export const alt = COPY.ogAlt;
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

/**
 * Una sola imagen: la landing existe solo en español y `/en/studio` redirige,
 * así que no hay una variante en inglés que ilustrar.
 */
export function generateStaticParams() {
  return [{ locale: "es" }];
}

export default async function OpengraphImage() {
  return new ImageResponse(<OgCard title={COPY.ogTitulo} meta={COPY.ogMeta} />, {
    ...OG_SIZE,
    fonts: await ogFonts(),
  });
}
