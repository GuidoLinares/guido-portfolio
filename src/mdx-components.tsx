import type { MDXComponents } from "mdx/types";
import type { ComponentPropsWithoutRef } from "react";

/**
 * Mapeo de los elementos de MDX al sistema de tokens. Es el default global de
 * @next/mdx: lo resuelve por el alias `next-mdx-import-source-file`, así que
 * los .mdx no necesitan recibir `components` a mano.
 *
 * La prosa va en --color-text-muted y el énfasis en --color-text: la jerarquía
 * la marca el contraste, no solo el peso. Los dos pasan AA sobre --color-ink.
 */

/** Fusiona las clases del token con las que traiga el elemento (`language-*`). */
function cx(own: string, incoming?: string): string {
  return incoming ? `${own} ${incoming}` : own;
}

type Props<Tag extends keyof React.JSX.IntrinsicElements> = ComponentPropsWithoutRef<Tag>;

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    // font-display, letter-spacing y text-wrap ya los aplica la capa base a
    // h1/h2/h3: acá solo van escala, color y ritmo.
    h2: ({ className, ...props }: Props<"h2">) => (
      <h2 className={cx("mt-[var(--space-block)] text-h2 text-text first:mt-0", className)} {...props} />
    ),
    h3: ({ className, ...props }: Props<"h3">) => (
      <h3 className={cx("mt-10 text-h3 text-text", className)} {...props} />
    ),
    p: ({ className, ...props }: Props<"p">) => (
      <p className={cx("mt-6 text-text-muted", className)} {...props} />
    ),
    ul: ({ className, ...props }: Props<"ul">) => (
      <ul className={cx("mt-6 list-disc space-y-2 pl-5 marker:text-rail", className)} {...props} />
    ),
    ol: ({ className, ...props }: Props<"ol">) => (
      <ol
        className={cx("mt-6 list-decimal space-y-2 pl-5 marker:font-mono marker:text-rail", className)}
        {...props}
      />
    ),
    li: ({ className, ...props }: Props<"li">) => (
      <li className={cx("pl-1 text-text-muted", className)} {...props} />
    ),
    strong: ({ className, ...props }: Props<"strong">) => (
      <strong className={cx("font-medium text-text", className)} {...props} />
    ),
    em: ({ className, ...props }: Props<"em">) => (
      <em className={cx("italic", className)} {...props} />
    ),

    // Código inline. El mismo mapeo recibe el <code> de adentro de un fence
    // —con su clase `language-*`— y ahí el <pre> neutraliza fondo, padding y
    // radio, así que un fence sin lenguaje declarado se comporta igual.
    code: ({ className, ...props }: Props<"code">) => (
      <code
        className={cx("rounded-xs bg-night px-1.5 py-0.5 font-mono text-meta text-text", className)}
        {...props}
      />
    ),

    // Bloque de código: mono, fondo --color-night, hairline de borde y scroll
    // horizontal en pantallas angostas. Sin resaltado de sintaxis todavía.
    pre: ({ className, ...props }: Props<"pre">) => (
      <pre
        className={cx(
          "mt-6 overflow-x-auto rounded-md border border-hairline bg-night p-4 font-mono text-meta text-text [&>code]:rounded-none [&>code]:bg-transparent [&>code]:p-0 [&>code]:text-inherit",
          className,
        )}
        {...props}
      />
    ),

    ...components,
  };
}
