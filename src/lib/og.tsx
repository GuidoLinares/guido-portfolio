import { readFile } from "node:fs/promises";
import path from "node:path";

/**
 * Diseño compartido de las OG images. Vive acá y no duplicado en cada ruta, para
 * que la home y los case studies no se separen visualmente.
 *
 * Los colores van en literal: ImageResponse renderiza con satori y no resuelve
 * custom properties, así que este bloque es un espejo manual de @theme. Si un
 * token cambia en globals.css, hay que cambiarlo también acá.
 */
const INK = "#04060B";
const TEXT = "#E8EDF5";
const RAIL = "#6B7C96";
const SIGNAL = "#4DA3FF";

const DISPLAY = "Bricolage Grotesque";
const MONO = "IBM Plex Mono";

export const OG_SIZE = { width: 1200, height: 630 };
export const OG_CONTENT_TYPE = "image/png";

const FONT_DIR = path.join(process.cwd(), "src", "assets", "fonts");

/**
 * ImageResponse no hereda next/font: las fuentes se cargan del disco y se pasan
 * por la opción `fonts`. Tienen que ser TTF, WOFF u OTF — satori no lee WOFF2,
 * que es lo único que deja next/font en .next.
 *
 * La display es una instancia estática (opsz 40, wght 600), no el archivo
 * variable: satori no parsea la Bricolage variable y tira
 * "Cannot read properties of undefined (reading '256')".
 */
export async function ogFonts() {
  const [display, mono] = await Promise.all([
    readFile(path.join(FONT_DIR, "BricolageGrotesque-SemiBold.woff")),
    readFile(path.join(FONT_DIR, "IBMPlexMono-Regular.ttf")),
  ]);

  return [
    { name: DISPLAY, data: display, weight: 600 as const, style: "normal" as const },
    { name: MONO, data: mono, weight: 400 as const, style: "normal" as const },
  ];
}

/**
 * Título en display, una línea de metadata en mono, y el hairline de 3px en
 * --color-signal pegado al borde inferior.
 */
export function OgCard({ title, meta }: { title: string; meta: string }) {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        backgroundColor: INK,
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", padding: "84px 80px 0" }}>
        <div
          style={{
            display: "flex",
            fontFamily: DISPLAY,
            fontSize: 76,
            lineHeight: 1.1,
            letterSpacing: "-0.03em",
            color: TEXT,
          }}
        >
          {title}
        </div>

        <div
          style={{
            display: "flex",
            fontFamily: MONO,
            fontSize: 26,
            marginTop: 36,
            color: RAIL,
          }}
        >
          {meta}
        </div>
      </div>

      <div style={{ width: "100%", height: 3, backgroundColor: SIGNAL }} />
    </div>
  );
}
