import { SITE } from "@/content/site";
import type { Dictionary } from "@/lib/i18n";

import { CopyEmailButton } from "./CopyEmailButton";

type ContactSectionProps = {
  content: Dictionary["contact"];
};

const LINK_CLASS = "text-rail hover:text-text";

export function ContactSection({ content }: ContactSectionProps) {
  return (
    <section id="contact" className="border-t border-hairline py-[var(--space-section)]">
      <h2 className="text-h2 text-text">{content.title}</h2>

      <p className="mt-6 max-w-2xl text-text-muted">{content.lead}</p>

      <div className="mt-[var(--space-block)] flex flex-wrap items-center gap-x-6 gap-y-4">
        {/* select-all: un clic selecciona el email entero si el copiado falla.
            break-words evita que desborde a 360px, donde --text-h2 son 28px. */}
        <span className="font-display text-h2 leading-none break-words text-text select-all">
          {SITE.email}
        </span>

        <CopyEmailButton
          email={SITE.email}
          label={content.copy}
          copiedLabel={content.copied}
          hint={content.copyHint}
        />
      </div>

      <ul className="mt-[var(--space-block)] flex flex-wrap gap-x-2 gap-y-1 font-mono text-meta">
        <li>
          <a
            href={SITE.github}
            target="_blank"
            rel="noopener noreferrer"
            className={LINK_CLASS}
          >
            {content.github}
          </a>
        </li>

        <li className="flex gap-2">
          <span aria-hidden="true" className="text-rail">
            ·
          </span>
          <a
            href={SITE.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className={LINK_CLASS}
          >
            {content.linkedin}
          </a>
        </li>

        {/*
          Falta public/cv-guido-linares.pdf. Con el archivo en su lugar, esto
          entra tal cual:

          <li className="flex gap-2">
            <span aria-hidden="true" className="text-rail">·</span>
            <a href={SITE.cv} download className={LINK_CLASS}>
              {content.cv}
            </a>
          </li>
        */}
      </ul>
    </section>
  );
}
