/**
 * Movimiento 4: hairline de progreso de scroll, 1px, en --color-signal.
 * Scroll-driven en CSS puro — sin JS, sin listeners, fuera del camino crítico.
 * `.scroll-hairline` solo se muestra si el browser soporta animation-timeline,
 * y se retira con prefers-reduced-motion (ver globals.css).
 */
export function ScrollHairline() {
  return (
    <div
      aria-hidden="true"
      className="scroll-hairline fixed inset-x-0 top-0 z-50 h-px bg-signal"
    />
  );
}
