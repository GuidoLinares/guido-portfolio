"use client";

import { useEffect, useRef, useState } from "react";

type CopyEmailButtonProps = {
  email: string;
  label: string;
  copiedLabel: string;
  hint: string;
};

/**
 * Copia el email y cambia el label por dos segundos. Es un <button>, así que
 * funciona con teclado sin ayuda; el cambio de estado se anuncia por una región
 * live aparte, para no depender de que el lector renombre el botón.
 *
 * Si el portapapeles no está disponible —contexto no seguro, permiso denegado—
 * falla en silencio: el email de al lado sigue siendo seleccionable a mano.
 */
export function CopyEmailButton({ email, label, copiedLabel, hint }: CopyEmailButtonProps) {
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (timer.current !== null) {
        clearTimeout(timer.current);
      }
    },
    [],
  );

  async function copy() {
    try {
      await navigator.clipboard.writeText(email);
    } catch {
      return;
    }

    setCopied(true);

    if (timer.current !== null) {
      clearTimeout(timer.current);
    }

    timer.current = setTimeout(() => setCopied(false), 2000);
  }

  return (
    <>
      <button
        type="button"
        onClick={copy}
        aria-describedby="copy-email-hint"
        className="shrink-0 rounded-xs border border-hairline px-3 py-1.5 font-mono text-meta text-rail hover:text-text"
      >
        {copied ? copiedLabel : label}
      </button>

      <span id="copy-email-hint" className="sr-only">
        {hint}
      </span>

      <span role="status" aria-live="polite" className="sr-only">
        {copied ? copiedLabel : ""}
      </span>
    </>
  );
}
