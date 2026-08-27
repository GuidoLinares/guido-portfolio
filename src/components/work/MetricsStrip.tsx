import type { ProjectMetric } from "@/content/projects";

type MetricsStripProps = {
  metrics: readonly ProjectMetric[];
  className?: string;
};

/**
 * Tira de datos en mono: una fila, sin iconos y sin card por métrica. Los
 * conteos ya vienen calculados en el frontmatter.
 */
export function MetricsStrip({ metrics, className }: MetricsStripProps) {
  if (metrics.length === 0) {
    return null;
  }

  return (
    <dl
      className={[
        "flex flex-wrap gap-x-12 gap-y-6 border-y border-hairline py-6 font-mono",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {metrics.map((metric) => (
        <div key={metric.label} className="flex flex-col gap-1">
          <dt className="text-meta uppercase tracking-wider text-rail">{metric.label}</dt>
          <dd className="text-h3 text-text">{metric.value}</dd>
        </div>
      ))}
    </dl>
  );
}
