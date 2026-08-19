/**
 * Rail de anotación: columna mono en el margen izquierdo con la metadata real
 * del bloque (stack, escala, año). Es estructural, no decorativa: si no recibe
 * pares con valor, no renderiza nada.
 */

export type RailEntry = {
  label: string;
  value: string;
};

type RailProps = {
  entries?: readonly RailEntry[];
  className?: string;
};

export function Rail({ entries, className }: RailProps) {
  const populated = (entries ?? []).filter(
    (entry) => entry.label.trim().length > 0 && entry.value.trim().length > 0,
  );

  // Sin metadata real no hay rail.
  if (populated.length === 0) {
    return null;
  }

  return (
    <dl
      className={[
        "flex flex-col gap-[var(--space-block)] font-mono text-meta leading-normal",
        "md:sticky md:top-24",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {populated.map((entry) => (
        <div key={entry.label} className="flex flex-col gap-1">
          <dt className="uppercase tracking-wider text-rail">{entry.label}</dt>
          <dd className="text-text-muted">{entry.value}</dd>
        </div>
      ))}
    </dl>
  );
}
