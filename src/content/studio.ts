import { SITE } from "@/content/site";

/**
 * Contenido de la landing comercial (`/es/studio`).
 *
 * No va a los diccionarios a propósito: `Dictionary` se deriva de `es.json`, así
 * que toda clave nueva ahí obliga a espejarla en `en.json` o se cae el
 * typecheck. La landing apunta a clientes argentinos y no se traduce, de modo
 * que vive acá, tipada y en un solo idioma, sin tocar el contrato de i18n.
 *
 * A diferencia de `projects.ts`, esto no sale de MDX ni necesita validación en
 * runtime: está escrito a mano y el tipado ya lo cubre.
 */

/**
 * La landing es española por decisión de producto, no porque `es` sea el locale
 * por defecto: si algún día el default cambiara, esto se queda igual. No se
 * deriva de DEFAULT_LOCALE a propósito.
 */
export const STUDIO_LOCALE = "es";

/** Única ruta canónica de la landing. La consumen la página y el sitemap. */
export const STUDIO_PATH = `/${STUDIO_LOCALE}/studio`;

export type StudioService = {
  readonly nombre: string;
  readonly detalle: string;
};

export type StudioProject = {
  /** Primera parte del nombre, en peso ligero. */
  readonly nombre: string;
  /** Segunda parte, en peso alto. Opcional: no todo nombre se parte en dos. */
  readonly enfasis?: string;
  readonly estado: string;
  readonly detalle: string;
  /** Lista, no string pre-unido: lo arma `DotList` como en el resto del sitio. */
  readonly stack: readonly string[];
  readonly href?: string;
  readonly hrefTexto?: string;
};

export type StudioStep = {
  readonly titulo: string;
  readonly detalle: string;
};

export type StudioMetric = {
  readonly label: string;
  readonly value: string;
};

export const STUDIO = {
  marca: "GL Studio",
  /** Title absoluto: no pasa por el template del layout del portfolio. */
  titulo: "GL Studio — Desarrollo de software a medida",
  descripcion:
    "Apps, sitios y sistemas hechos a medida para negocios que necesitan algo que no viene hecho. Buenos Aires.",
  /** Formato internacional que espera wa.me: sin +, sin espacios, con el 9. */
  whatsapp: "5491161986776",
  saludo: "Hola Guido, te escribo por GL Studio.",
  instagram: "https://instagram.com/gl.software",
  instagramHandle: "@gl.software",
  /** El mismo address del portfolio. Única fuente de verdad: site.ts. */
  email: SITE.email,
  /** La otra cara del sitio. Ruta real prerenderizada, no depende del middleware. */
  perfil: "/es",
} as const;

/** Se arma una sola vez: lo usan el header, el hero y la sección de contacto. */
export const WHATSAPP_HREF = `https://wa.me/${STUDIO.whatsapp}?text=${encodeURIComponent(
  STUDIO.saludo,
)}`;

/**
 * Prosa de la página. Va acá y no en el componente para que la landing no tenga
 * contenido inline: el `.tsx` queda con estructura y nada más.
 */
export const COPY = {
  headerCta: "Escribime",

  /** El par de pesos del hero: ligero arriba, alto abajo. */
  heroLigero: "Hago software",
  heroEnfasis: "a medida",
  heroLead:
    "Apps, sitios y sistemas para negocios que necesitan algo que no viene hecho. Los desarrollo yo, de principio a fin, desde Buenos Aires.",
  heroCta: "Contame qué necesitás",

  serviciosTitulo: "Qué puedo construir",
  proyectosTitulo: "Cosas que ya están andando",
  pasosTitulo: "Cómo trabajamos",

  contactoTitulo: "Escribime",
  contactoLead:
    "Contame qué necesitás, aunque todavía no lo tengas del todo claro. Si no es algo que pueda resolver, te lo digo y te oriento a dónde ir.",
  contactoCta: "Escribime por WhatsApp",

  perfilTexto: "Perfil técnico",

  /** Tarjeta OG. El alt describe la imagen, no repite el title de la página. */
  ogTitulo: "Hago software a medida",
  ogMeta: "GL Studio · Buenos Aires",
  ogAlt: "GL Studio — desarrollo de software a medida",
} as const;

export const METRICAS: readonly StudioMetric[] = [
  { label: "En producción hoy", value: "2 productos" },
  { label: "Respuesta", value: "Menos de 24 h" },
  { label: "Primera charla", value: "Sin costo" },
];

export const SERVICIOS: readonly StudioService[] = [
  {
    nombre: "Aplicaciones",
    detalle:
      "Se instalan desde el navegador, andan rápido en cualquier celular y funcionan sin señal. Sin pasar por App Store ni Google Play.",
  },
  {
    nombre: "Sitios y tiendas online",
    detalle:
      "Con un panel donde vos cargás los productos, cambiás precios y ves los pedidos. Los cobros entran por Mercado Pago.",
  },
  {
    nombre: "Sistemas internos",
    detalle:
      "Para el trabajo que hoy resolvés con planillas, mensajes y memoria. Un solo lugar, con el circuito que ya usás.",
  },
];

export const PROYECTOS: readonly StudioProject[] = [
  {
    nombre: "Amelia",
    enfasis: "Complementos",
    estado: "En producción",
    detalle:
      "Tienda de bijouterie. La dueña carga los productos desde el celular, el cliente compra y paga online, y los pedidos llegan ordenados.",
    stack: ["Next.js", "TypeScript", "Payload CMS", "PostgreSQL"],
    href: "https://ameliacomplementos.com",
    hrefTexto: "ameliacomplementos.com",
  },
  {
    nombre: "Sofitness",
    estado: "En producción",
    detalle:
      "App de entrenamiento que se abre todos los días. Rutinas armadas, seguimiento de cargas y recetas generadas según el objetivo de cada persona.",
    stack: ["React", "Firebase", "Gemini"],
  },
];

/** Los cuatro pasos van numerados: son una secuencia real, no una lista. */
export const PASOS: readonly StudioStep[] = [
  {
    titulo: "Charlamos",
    detalle:
      "Media hora para entender qué necesitás y qué hacés hoy para resolverlo. Sin costo y sin compromiso.",
  },
  {
    titulo: "Te paso una propuesta",
    detalle:
      "Qué incluye, qué no incluye, cuánto sale y en cuánto tiempo. Un precio cerrado, no una estimación por hora.",
  },
  {
    titulo: "Lo desarrollo por partes",
    detalle:
      "Vas viendo avances reales y funcionando. Si algo no era lo que imaginabas, lo corregimos ahí y no al final.",
  },
  {
    titulo: "Queda andando",
    detalle:
      "Te lo entrego publicado y te enseño a usarlo. Después queda un mes de ajustes incluido.",
  },
];
