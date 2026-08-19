# CLAUDE.md — Portfolio Guido Linares

Sitio personal. Next.js 16 (App Router) + React 19 + TypeScript strict + Tailwind v4.
Bilingüe ES/EN. Deploy en Vercel. Contenido estático, sin CMS ni base de datos.

---

## Reglas duras

1. **Nunca ejecutar operaciones git de escritura.** Ni `commit`, ni `push`, ni `merge`,
   ni `rebase`, ni `tag`, ni `reset --hard`. Solo lectura (`status`, `diff`, `log`).
   Razón: push a `main` dispara deploy a producción en Vercel.
2. **Nunca inventar colores, tamaños ni fuentes.** Todo valor visual sale del sistema
   de tokens definido más abajo. Si hace falta un token nuevo, proponerlo, no crearlo.
3. **Nunca usar `localStorage`, `sessionStorage` ni ninguna API de storage del browser.**
4. **Contenido: cero información interna.** No puede aparecer en ningún archivo de este
   repo: nombres de tablas, stored procedures, schemas, bases de datos, endpoints
   privados, rutas de red, dominios internos, claves de permiso reales, nombres de
   variables de entorno de credenciales, hallazgos de seguridad, ni nombres de
   colegas. Los case studies hablan de patrones y decisiones, con nombres genéricos.
5. **No agregar dependencias sin preguntar.** El presupuesto de bundle es ajustado.

---

## Tokens

Definidos en `src/app/globals.css` con `@theme` (Tailwind v4 es CSS-first, no hay
`tailwind.config.js`).

```css
@theme {
  /* Color */
  --color-ink:        #04060B;  /* base, casi negro */
  --color-night:      #0B1F3A;  /* azul noche */
  --color-night-lift: #14335F;  /* elevación */
  --color-signal:     #4DA3FF;  /* acento, uso escaso */
  --color-text:       #E8EDF5;
  --color-text-muted: #8A97AD;
  --color-rail:       #6B7C96;  /* mono de anotación */
  --color-hairline:   rgb(255 255 255 / 0.07);

  /* Tipografía */
  --font-display: var(--font-bricolage);  /* Bricolage Grotesque, variable */
  --font-body:    var(--font-public);     /* Public Sans */
  --font-mono:    var(--font-plex);       /* IBM Plex Mono */

  /* Escala */
  --text-hero:  clamp(2.75rem, 7vw, 5.5rem);
  --text-h2:    clamp(1.75rem, 3.5vw, 2.75rem);
  --text-h3:    1.375rem;
  --text-body:  1.0625rem;
  --text-meta:  0.8125rem;   /* siempre en mono */

  /* Ritmo vertical */
  --space-section: clamp(6rem, 14vh, 10rem);
  --space-block:   3rem;
}
```

Reglas de uso:

- `--color-signal` aparece en **un** elemento por viewport como máximo. Es acento, no color de marca.
- Los degradés se interpolan en `oklch()`, nunca en sRGB (evita el paso gris muerto).
- Todo fondo con degradé largo lleva overlay de grano al 3% (evita banding en paneles de 8 bits).
- `--font-mono` es la capa de datos: métricas, stack, etiquetas del rail. Nunca para prosa.
- Display con `letter-spacing: -0.03em` y `text-wrap: balance`.
- Nada de `border-radius` mayor a `6px`. Nada de glassmorphism. Nada de blobs aurora.

---

## Dirección visual

**Elemento firma:** el hero ejecuta una secuencia al cargar —
`write → read back → mismatch → retry → commit` — en mono, una línea por paso.
Es la única animación orquestada del sitio. Todo lo demás es quieto.

**Rail de anotación:** columna mono en el margen izquierdo con metadata real por bloque
(stack, escala, año). Es estructural, no decorativa: si un bloque no tiene metadata real,
no lleva rail.

**Numeración:** solo donde el orden significa algo. Los dos actos de un case study son
una cronología real y van numerados. Las decisiones técnicas no son secuenciales:
no llevan `01 / 02 / 03`.

**Movimientos permitidos** (cuatro, no más):
1. Secuencia del hero al cargar.
2. Reveal por scroll: blur → nítido, `translateY` de 12px máximo.
3. Glow del borde de card siguiendo el puntero.
4. Hairline de progreso de scroll, 1px, en `--color-signal`.

Todo respeta `prefers-reduced-motion: reduce` — con la preferencia activa, los cuatro
se desactivan y el contenido aparece en su estado final.

Preferir CSS scroll-driven animations (`animation-timeline: view()`) donde alcance;
`motion` solo para el hero y el glow del puntero.

---

## Estructura

```
src/
  app/
    [locale]/
      layout.tsx
      page.tsx
      work/[slug]/page.tsx
      opengraph-image.tsx
    globals.css
  content/
    work/<slug>/{es,en}.mdx     # prosa de los case studies
    projects.ts                 # metadata tipada: slug, stack, orden, estado
  dictionaries/
    es.json                     # fuente de verdad de las claves
    en.json
  lib/
    i18n.ts                     # tipo Dictionary derivado de es.json
    mdx.ts
  components/
    hero/  rail/  work/  ui/
middleware.ts                   # detección de Accept-Language + cookie
```

---

## i18n

- `es` es el locale por defecto y la fuente de verdad de las claves.
- El tipo `Dictionary` se deriva de `es.json`, así que una clave faltante en `en.json`
  rompe el typecheck.
- Prosa larga va en MDX por locale, nunca en JSON.
- El toggle preserva la ruta: `/es/work/<slug>` → `/en/work/<slug>`.
- `generateStaticParams` para ambos locales; todo estático en build.
- `alternates.languages` en el metadata de cada página.

---

## Contenido

Tres case studies, todos proyectos internos de Grupo ROISA, cada uno con página propia:

| slug              | stack                                      | estado             |
|-------------------|--------------------------------------------|--------------------|
| `roisa-core`      | NestJS 11 · Prisma 7 · PostgreSQL · Angular 21 | producción     |
| `procesos-masivos`| Next.js 16 · SQL Server · Claude API        | producción         |
| `integracion-erp` | Python 3.12 · FastAPI · XML-RPC             | desarrollo activo  |

Estructura de cada uno: contexto → restricciones → decisiones (con el trade-off
explícito de cada una) → números → stack → aprendizaje.

Los trade-offs se mantienen: son lo que distingue una decisión de una lista de
tecnologías. La deuda técnica no va al sitio.

Sección transversal de Database Engineering: modelado en PostgreSQL y diagnóstico de
performance en SQL Server, contado como patrones.

---

## Calidad mínima

- Responsive hasta 360px.
- Foco de teclado visible en todo control interactivo.
- Contraste AA sobre `--color-ink` y sobre `--color-night` (verificar el texto muted).
- LCP objetivo bajo 1.5s: sin librería de animación en el camino crítico del hero.
- `next/font` con `display: swap` y subset latin.
