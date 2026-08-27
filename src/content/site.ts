/** Datos de contacto del sitio. Públicos a propósito. */
export const SITE = {
  /** Dominio de producción. Única fuente de verdad: nada de URLs a mano. */
  url: "https://guidolinares.vercel.app",
  email: "guidolinaress@gmail.com",
  github: "https://github.com/GuidoLinares",
  /**
   * Verificado contra el README del perfil de GitHub (github.com/GuidoLinares),
   * que enlaza a esta ruta. La variante `in/guidolinares` no es la real.
   */
  linkedin: "https://www.linkedin.com/in/guido-linares-25859b209",
  /** Todavía no existe el archivo en public/: el link está comentado. */
  cv: "/cv-guido-linares.pdf",
} as const;
