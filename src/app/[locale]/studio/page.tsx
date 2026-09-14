import type { Metadata } from "next";
import Image from "next/image";
import { redirect } from "next/navigation";
import type { ReactNode } from "react";

import { DotList } from "@/components/ui/DotList";
import { MetricsStrip } from "@/components/work/MetricsStrip";
import {
  COPY,
  METRICAS,
  PASOS,
  PROYECTOS,
  SERVICIOS,
  STUDIO,
  STUDIO_LOCALE,
  STUDIO_PATH,
  WHATSAPP_HREF,
} from "@/content/studio";
import { OG_LOCALE } from "@/lib/locales";

/**
 * Landing comercial. Le habla a dueños de pymes y emprendedores, no a
 * reclutadores: por eso no hereda el chrome del portfolio (vive fuera del route
 * group `(portfolio)`) y no monta el toggle de idioma.
 *
 * Español únicamente, a propósito: el público es argentino. `/en/studio` se
 * prerenderiza igual —el locale sale del layout— y redirige acá, así ninguna URL
 * escrita a mano queda muerta.
 */

type PageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;

  // La variante que redirige no aporta metadata propia.
  if (locale !== STUDIO_LOCALE) {
    return {};
  }

  return {
    // `absolute`: sin esto el template del layout lo volvería
    // "GL Studio — Guido Linares" y mezclaría las dos marcas.
    title: { absolute: STUDIO.titulo },
    description: STUDIO.descripcion,
    alternates: {
      canonical: STUDIO_PATH,
      // Un solo locale: declararlo así es más honesto que omitirlo.
      languages: { es: STUDIO_PATH, "x-default": STUDIO_PATH },
    },
    openGraph: {
      type: "website",
      siteName: STUDIO.marca,
      locale: OG_LOCALE[STUDIO_LOCALE],
      url: STUDIO_PATH,
      title: STUDIO.titulo,
      description: STUDIO.descripcion,
    },
    twitter: {
      card: "summary_large_image",
      title: STUDIO.titulo,
      description: STUDIO.descripcion,
    },
  };
}

/* ------------------------------------------------------------------ */

const LINK_CLASS =
  "text-text-muted underline-offset-4 transition-colors hover:text-text hover:underline";

function Seccion({ titulo, children }: { titulo: string; children: ReactNode }) {
  return (
    <section className="border-t border-hairline py-[var(--space-section)]">
      <h2 className="text-h2 text-text">{titulo}</h2>
      <div className="mt-[var(--space-block)]">{children}</div>
    </section>
  );
}

/**
 * Único elemento en --color-signal por viewport (CLAUDE.md). Los dos CTA están a
 * secciones de distancia y nunca coinciden en pantalla. El texto va en
 * --color-ink: E8EDF5 sobre el azul daría 2.2:1 y no pasa AA.
 */
function BotonWhatsApp({ children }: { children: ReactNode }) {
  return (
    <a
      href={WHATSAPP_HREF}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center rounded-md bg-signal px-6 py-3.5 font-semibold text-ink transition-colors hover:bg-text"
    >
      {children}
    </a>
  );
}

/* ------------------------------------------------------------------ */

export default async function StudioPage({ params }: PageProps) {
  const { locale } = await params;

  if (locale !== STUDIO_LOCALE) {
    redirect(STUDIO_PATH);
  }

  return (
    <main id="content" tabIndex={-1} className="mx-auto w-full max-w-5xl px-4 sm:px-10">
      {/* Gutter vertical: es el recurso estructural propio de la landing. El
          portfolio separa siempre con border-t horizontales. El padding se
          achica en mobile porque acá hay dos niveles de margen y a 360px el
          display del hero se queda sin ancho. */}
      <div className="border-x border-hairline px-4 sm:px-12">
        <header className="flex items-center justify-between gap-4 py-5">
          <span className="font-mono text-meta text-text">{STUDIO.marca}</span>
          <a href={WHATSAPP_HREF} target="_blank" rel="noopener noreferrer" className={LINK_CLASS}>
            {COPY.headerCta}
          </a>
        </header>

        <section className="py-[var(--space-section)]">
          {/* leading-[0.95]: el 1.15 de @layer base es corrección de prosa y deja
              el par de pesos demasiado separado en dos líneas de display. */}
          <h1 className="max-w-3xl text-hero leading-[0.95] text-text">
            <span className="block font-light">{COPY.heroLigero}</span>
            <span className="block font-extrabold">{COPY.heroEnfasis}</span>
          </h1>

          <p className="mt-8 max-w-xl text-text-muted">{COPY.heroLead}</p>

          <div className="mt-[var(--space-block)]">
            <BotonWhatsApp>{COPY.heroCta}</BotonWhatsApp>
          </div>

          <MetricsStrip metrics={METRICAS} className="mt-[var(--space-block)]" />
        </section>

        <Seccion titulo={COPY.serviciosTitulo}>
          <ul className="max-w-2xl">
            {SERVICIOS.map((servicio, index) => (
              <li
                key={servicio.nombre}
                className={index > 0 ? "mt-8 border-t border-hairline pt-8" : undefined}
              >
                <h3 className="text-h3 text-text">{servicio.nombre}</h3>
                <p className="mt-3 text-text-muted">{servicio.detalle}</p>
              </li>
            ))}
          </ul>
        </Seccion>

        <Seccion titulo={COPY.proyectosTitulo}>
          <ul>
            {PROYECTOS.map((proyecto, index) => (
              <li
                key={proyecto.nombre}
                className={
                  index > 0
                    ? "mt-[var(--space-block)] border-t border-hairline pt-[var(--space-block)]"
                    : undefined
                }
              >
                <p className="flex items-center gap-2.5 font-mono text-meta text-rail">
                  <span aria-hidden="true" className="inline-block size-1.5 rounded-full bg-rail" />
                  {proyecto.estado}
                </p>

                <h3 className="mt-4 text-h2 text-text">
                  <span className="font-light">{proyecto.nombre}</span>
                  {proyecto.enfasis ? (
                    <>
                      {" "}
                      <span className="font-extrabold">{proyecto.enfasis}</span>
                    </>
                  ) : null}
                </h3>

                <p className="mt-4 max-w-2xl text-text-muted">{proyecto.detalle}</p>

                <DotList items={proyecto.stack} className="mt-6 font-mono text-meta text-rail" />

                {proyecto.href ? (
                  <a
                    href={proyecto.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`mt-3 inline-block font-mono text-meta ${LINK_CLASS}`}
                  >
                    {proyecto.hrefTexto ?? proyecto.href}
                  </a>
                ) : null}

                {/* Capturas del producto andando. La orientación sale del propio
                    archivo: las de escritorio ocupan el ancho completo, las de
                    celular quedan chicas y de a dos, para que ninguna se estire
                    más allá de su tamaño real. */}
                {proyecto.imagenes?.length ? (
                  <ul className="mt-[var(--space-block)] flex flex-wrap items-start gap-4">
                    {proyecto.imagenes.map((imagen) => {
                      const vertical = imagen.alto > imagen.ancho;

                      return (
                        <li
                          key={imagen.src}
                          className={
                            vertical
                              ? "w-full max-w-[260px] sm:w-[calc(50%-0.5rem)]"
                              : "w-full"
                          }
                        >
                          <Image
                            src={imagen.src}
                            alt={imagen.alt}
                            width={imagen.ancho}
                            height={imagen.alto}
                            sizes={vertical ? "260px" : "(min-width: 1024px) 768px, 100vw"}
                            className="h-auto w-full rounded-md border border-hairline"
                          />
                        </li>
                      );
                    })}
                  </ul>
                ) : null}
              </li>
            ))}
          </ul>
        </Seccion>

        <Seccion titulo={COPY.pasosTitulo}>
          {/* Numerados porque el orden es real: charla -> propuesta -> desarrollo
              -> entrega. */}
          <ol className="flex max-w-2xl flex-col gap-10">
            {PASOS.map((paso, index) => (
              <li key={paso.titulo} className="flex gap-6">
                <span aria-hidden="true" className="mt-1 shrink-0 font-mono text-meta text-rail">
                  {index + 1}
                </span>
                <div>
                  <h3 className="text-h3 text-text">{paso.titulo}</h3>
                  <p className="mt-2 text-text-muted">{paso.detalle}</p>
                </div>
              </li>
            ))}
          </ol>
        </Seccion>

        <Seccion titulo={COPY.contactoTitulo}>
          <p className="max-w-xl text-text-muted">{COPY.contactoLead}</p>

          <div className="mt-[var(--space-block)] flex flex-wrap items-center gap-x-8 gap-y-4">
            <BotonWhatsApp>{COPY.contactoCta}</BotonWhatsApp>
            <a href={`mailto:${STUDIO.email}`} className={`font-mono text-meta ${LINK_CLASS}`}>
              {STUDIO.email}
            </a>
          </div>
        </Seccion>

        <footer className="flex flex-wrap items-center justify-between gap-x-6 gap-y-4 border-t border-hairline py-10 font-mono text-meta">
          <span className="text-text">{STUDIO.marca}</span>
          <div className="flex flex-wrap gap-x-6 gap-y-2">
            <a
              href={STUDIO.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className={LINK_CLASS}
            >
              {STUDIO.instagramHandle}
            </a>
            <a href={STUDIO.perfil} className={LINK_CLASS}>
              {COPY.perfilTexto}
            </a>
          </div>
        </footer>
      </div>
    </main>
  );
}
