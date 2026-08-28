import { DEFAULT_LOCALE, getDictionary, isLocale } from "@/lib/i18n";

/**
 * Topologías del Acto I y el Acto II de roisa-core.
 *
 * Los dos diagramas se leen como una comparación, así que geometría, tipografía
 * y peso de línea salen de las constantes de este archivo y de ningún otro lado.
 * Mismo ancho de viewBox en los dos: eso fija la escala. Lo único que cambia es
 * el alto, porque el Acto II tiene una capa menos — que es el punto del par.
 *
 * SVG inline: hereda los tokens por clases (stroke-rail, fill-text, text-meta) y
 * escala sin pérdida. Tres colores y nada más.
 *
 * Las etiquetas —incluida la descripción accesible— salen del diccionario: el
 * MDX que renderiza el par pasa su locale como prop.
 */

/** Ancho del viewBox. Fija la escala de los dos diagramas. */
const W = 360;
const BOX_H = 34;
const STROKE = 1;
const CENTER = W / 2;
/** Media altura del corte de línea donde vive la etiqueta de una conexión. */
const LABEL_GAP = 9;

const LABEL = "font-mono text-meta";
const FRAME = "mt-6 w-full max-w-[420px]";

/** El locale lo pasa el MDX que renderiza el diagrama. */
type Diagrama = { locale: string };

/**
 * Etiquetas en el locale del MDX. Se valida en runtime porque un .mdx no lo
 * hace en compilación: un valor inesperado cae al default en vez de romper.
 */
function etiquetas(locale: string) {
  return getDictionary(isLocale(locale) ? locale : DEFAULT_LOCALE).diagrams.topology;
}

function Box({
  x,
  y,
  w,
  label,
  h = BOX_H,
  tone = "rail",
}: {
  x: number;
  y: number;
  w: number;
  label: string;
  h?: number;
  tone?: "rail" | "signal";
}) {
  const signal = tone === "signal";

  return (
    <>
      <rect
        x={x}
        y={y}
        width={w}
        height={h}
        rx={4}
        fill="none"
        strokeWidth={STROKE}
        className={signal ? "stroke-signal" : "stroke-rail"}
      />
      <text
        x={x + w / 2}
        y={y + h / 2}
        textAnchor="middle"
        dominantBaseline="central"
        className={`${LABEL} ${signal ? "fill-signal" : "fill-text"}`}
      >
        {label}
      </text>
    </>
  );
}

function Arrow({ x, y }: { x: number; y: number }) {
  return (
    <polyline
      points={`${x - 4},${y - 5} ${x},${y} ${x + 4},${y - 5}`}
      fill="none"
      strokeWidth={STROKE}
      className="stroke-rail"
    />
  );
}

/** Conexión vertical. Con etiqueta, la línea se corta y el texto va en el corte. */
function Link({
  from,
  to,
  x = CENTER,
  label,
  arrow = true,
}: {
  from: number;
  to: number;
  x?: number;
  label?: string;
  arrow?: boolean;
}) {
  const mid = (from + to) / 2;

  return (
    <>
      <line
        x1={x}
        y1={from}
        x2={x}
        y2={label ? mid - LABEL_GAP : to}
        strokeWidth={STROKE}
        className="stroke-rail"
      />
      {label ? (
        <>
          <line
            x1={x}
            y1={mid + LABEL_GAP}
            x2={x}
            y2={to}
            strokeWidth={STROKE}
            className="stroke-rail"
          />
          <text
            x={x}
            y={mid}
            textAnchor="middle"
            dominantBaseline="central"
            className={`${LABEL} fill-text`}
          >
            {label}
          </text>
        </>
      ) : null}
      {arrow ? <Arrow x={x} y={to} /> : null}
    </>
  );
}

function Bus({ y, from, to }: { y: number; from: number; to: number }) {
  return <line x1={from} y1={y} x2={to} y2={y} strokeWidth={STROKE} className="stroke-rail" />;
}

const ROLES = ["A", "B", "C"] as const;

/** Cliente → capa intermedia → tres servicios → base de datos y caché. */
export function ActoI({ locale }: Diagrama) {
  const t = etiquetas(locale);
  const columnas = [60, CENTER, 300];
  const servicioW = 104;
  const busServicios = 170;
  const serviciosY = 196;
  const busStores = 252;
  const storesY = 274;

  return (
    <svg
      viewBox={`0 0 ${W} 310`}
      role="img"
      aria-label={t.actIAlt}
      className={FRAME}
    >
      <Box x={110} y={0} w={140} label={t.client} />
      <Link from={BOX_H} to={82} label="REST" />

      {/* La capa intermedia es la pieza que desaparece en el Acto II. */}
      <Box x={90} y={82} w={180} label={t.intermediateLayer} tone="signal" />

      <Link from={116} to={busServicios} label={t.internalProtocol} arrow={false} />
      <Bus y={busServicios} from={columnas[0]} to={columnas[2]} />

      {columnas.map((x, index) => (
        <g key={x}>
          <Link from={busServicios} to={serviciosY} x={x} />
          <Box
            x={x - servicioW / 2}
            y={serviciosY}
            w={servicioW}
            label={`${t.service} ${ROLES[index]}`}
          />
          <Link from={serviciosY + BOX_H} to={busStores} x={x} arrow={false} />
        </g>
      ))}

      <Bus y={busStores} from={columnas[0]} to={columnas[2]} />

      <Link from={busStores} to={storesY} x={110} />
      <Box x={40} y={storesY} w={140} label={t.database} />

      <Link from={busStores} to={storesY} x={250} />
      <Box x={195} y={storesY} w={110} label={t.cache} />
    </svg>
  );
}

/** Cliente → una sola aplicación modular → base de datos. Sin capa intermedia. */
export function ActoII({ locale }: Diagrama) {
  const t = etiquetas(locale);
  const appX = 20;
  const appW = 320;
  const appY = 92;
  const appH = 68;
  const divisoria = appY + 26;
  const celda = appW / 3;
  const dbY = 196;

  return (
    <svg
      viewBox={`0 0 ${W} 232`}
      role="img"
      aria-label={t.actIIAlt}
      className={FRAME}
    >
      <Box x={110} y={0} w={140} label={t.client} />
      <Link from={BOX_H} to={appY} label="REST" />

      {/* Una sola caja: los módulos son límites lógicos, no procesos, así que van
          como divisiones internas y no como cajas separadas. */}
      <rect
        x={appX}
        y={appY}
        width={appW}
        height={appH}
        rx={4}
        fill="none"
        strokeWidth={STROKE}
        className="stroke-rail"
      />
      <text
        x={CENTER}
        y={appY + 13}
        textAnchor="middle"
        dominantBaseline="central"
        className={`${LABEL} fill-text`}
      >
        {t.modularApp}
      </text>

      <Bus y={divisoria} from={appX} to={appX + appW} />

      {ROLES.map((rol, index) => (
        <g key={rol}>
          {index > 0 ? (
            <line
              x1={appX + celda * index}
              y1={divisoria}
              x2={appX + celda * index}
              y2={appY + appH}
              strokeWidth={STROKE}
              className="stroke-rail"
            />
          ) : null}
          <text
            x={appX + celda * index + celda / 2}
            y={divisoria + (appH - 26) / 2}
            textAnchor="middle"
            dominantBaseline="central"
            className={`${LABEL} fill-text`}
          >
            {`${t.module} ${rol}`}
          </text>
        </g>
      ))}

      <Link from={appY + appH} to={dbY} />
      <Box x={110} y={dbY} w={140} label={t.database} />
    </svg>
  );
}
