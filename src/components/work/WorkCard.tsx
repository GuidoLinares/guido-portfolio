"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef } from "react";
import type { PointerEvent } from "react";

import type { ProjectStatus } from "@/content/projects";

type WorkCardProps = {
  href: string;
  title: string;
  tagline: string;
  stack: readonly string[];
  status: ProjectStatus;
  statusLabel: string;
};

/**
 * Card de case study con el movimiento 3: el glow del borde sigue al puntero.
 *
 * El único trabajo del componente es escribir --glow-x / --glow-y; el anillo lo
 * pinta `.card-glow` como capa de background en border-box (ver globals.css).
 * No hay elemento absoluto extra ni librería de animación.
 */
export function WorkCard({ href, title, tagline, stack, status, statusLabel }: WorkCardProps) {
  const frame = useRef<number | null>(null);
  const reducedMotion = useRef<MediaQueryList | null>(null);

  useEffect(
    () => () => {
      if (frame.current !== null) {
        cancelAnimationFrame(frame.current);
      }
    },
    [],
  );

  const trackPointer = useCallback((event: PointerEvent<HTMLAnchorElement>) => {
    // matchMedia se resuelve en el primer evento: en el módulo rompería el SSR.
    reducedMotion.current ??= window.matchMedia("(prefers-reduced-motion: reduce)");

    if (reducedMotion.current.matches) {
      return;
    }

    // Un solo write por frame: pointermove puede disparar más rápido que el
    // repintado y cada escritura invalida el degradé del borde.
    if (frame.current !== null) {
      return;
    }

    const card = event.currentTarget;
    const { clientX, clientY } = event;

    frame.current = requestAnimationFrame(() => {
      frame.current = null;

      const box = card.getBoundingClientRect();

      card.style.setProperty("--glow-x", `${clientX - box.left}px`);
      card.style.setProperty("--glow-y", `${clientY - box.top}px`);
    });
  }, []);

  return (
    <Link
      href={href}
      onPointerMove={trackPointer}
      className="card-glow block rounded-md p-6 md:p-8"
    >
      <div className="flex items-start justify-between gap-6">
        <h3 className="text-h3 text-text">{title}</h3>
        <span
          className={`shrink-0 rounded-xs border border-hairline px-2 py-0.5 font-mono text-meta uppercase tracking-wider ${
            status === "desarrollo" ? "text-signal" : "text-rail"
          }`}
        >
          {statusLabel}
        </span>
      </div>

      <p className="mt-4 text-text-muted">{tagline}</p>

      {/* Stack como texto separado por puntos medios: es la capa de datos, no
          una fila de chips. */}
      <p className="mt-6 font-mono text-meta text-rail">{stack.join(" · ")}</p>
    </Link>
  );
}
