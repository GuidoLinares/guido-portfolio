import { Fragment } from "react";

type DotListProps = {
  items: readonly string[];
  className?: string;
};

/**
 * Lista de datos separada por puntos medios. Cada entrada va en un span nowrap:
 * la línea envuelve en los separadores y no parte un nombre al medio —"AWS (ECS
 * Fargate, S3, ECR)", "SQL Server (T-SQL)"— sin meter espacios duros en el
 * diccionario.
 */
export function DotList({ items, className }: DotListProps) {
  return (
    <p className={className}>
      {items.map((item, index) => (
        <Fragment key={item}>
          {index > 0 ? " · " : null}
          <span className="whitespace-nowrap">{item}</span>
        </Fragment>
      ))}
    </p>
  );
}
