import createMDX from "@next/mdx";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // El frontmatter también se lee con fs para derivar la metadata tipada. El
  // tracing no puede inferir esas rutas (se arman por slug y locale), así que
  // los MDX se incluyen explícitamente en la salida.
  outputFileTracingIncludes: {
    "/**": ["./src/content/work/**/*.mdx"],
  },
};

const withMDX = createMDX({
  options: {
    // Reconoce el bloque YAML y lo deja fuera del render. La metadata la parsea
    // y valida @/content/projects: acá solo importa que MDX no se atore.
    //
    // Va por nombre, no por función importada: Turbopack exige que las opciones
    // del loader sean serializables y @next/mdx resuelve el string por su lado.
    remarkPlugins: ["remark-frontmatter"],
  },
});

export default withMDX(nextConfig);
