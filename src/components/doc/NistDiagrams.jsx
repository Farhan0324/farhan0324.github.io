import { useState } from "react";
import { useTranslation } from "../../lib/i18n";
import { DIcon } from "./DocParts";

const FN_ICONS = { GV: "governance", ID: "search", PR: "shield", DE: "monitor", RS: "alert", RC: "recover" };

/** Figure: Govern sits over the other five functions, which run left to right. */
export const CsfFunctions = ({ c }) => {
  const [active, setActive] = useState("GV");
  const fn = c.functions.find((f) => f.code === active);
  const [govern, ...rest] = c.functions;

  const tab = (f, className) => (
    <button
      key={f.code}
      type="button"
      aria-pressed={active === f.code}
      onMouseEnter={() => setActive(f.code)}
      onFocus={() => setActive(f.code)}
      onClick={() => setActive(f.code)}
      className={`flex items-center gap-2 border px-3 py-2.5 text-left text-sm font-medium transition-colors ${
        active === f.code ? "border-dg-cyan bg-dg-band" : "border-line-strong bg-dg-panel hover:border-dg-blue"
      } ${className}`}
    >
      <DIcon name={FN_ICONS[f.code]} className="size-4 shrink-0 text-dg-cyan" />
      <span className="truncate">{f.name}</span>
      <span className="ml-auto font-mono text-[11px] text-muted">{f.code}</span>
    </button>
  );

  return (
    <div>
      {tab(govern, "w-full rounded-t-lg")}
      <div className="mt-1 grid grid-cols-2 gap-1 sm:grid-cols-3 xl:grid-cols-5">
        {rest.map((f, i) => (
          <div key={f.code} className="relative">
            {tab(f, "w-full rounded")}
            {i < rest.length - 1 && (
              <span
                aria-hidden="true"
                className="absolute -right-1.5 top-1/2 z-10 hidden size-0 -translate-y-1/2 border-y-[6px] border-l-[7px] border-y-transparent border-l-dg-line xl:block"
              />
            )}
          </div>
        ))}
      </div>

      <div aria-live="polite" className="mt-4 rounded-lg border border-line bg-dg-panel p-4 sm:p-5">
        <p className="text-sm leading-relaxed">{fn.summary}</p>
        <div className="mt-4 grid gap-5 md:grid-cols-3">
          {[
            [c.labels.activities, fn.activities],
            [c.labels.tools, fn.tools],
            [c.labels.evidence, fn.evidence],
          ].map(([label, list]) => (
            <div key={label}>
              <p className="font-mono text-[11px] uppercase tracking-wider text-muted">{label}</p>
              <ul className="mt-2 space-y-1.5 text-sm leading-snug">
                {list.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const CODES = ["GV", "ID", "PR", "DE", "RS", "RC"];
const X0 = 104;
const CW = 168;
const colX = (i) => X0 + i * CW;
const TILE_W = 158;
const TILE_H = 84;
const TILE_ROWS = [100, 218, 336];
const ICON_BY_TILE = {
  purview: "data",
  compliance: "review",
  defender: "search",
  intune: "endpoint",
  entra: "identity",
  mde: "endpoint",
  xdr: "monitor",
  sentinel: "monitor",
  backup: "cloud",
  asr: "cloud",
};
// [tile, first column, columns spanned, row]
const LAYOUT = [
  ["purview", 0, 1, 0],
  ["compliance", 0, 1, 1],
  ["defender", 1, 1, 0],
  ["entra", 2, 1, 0],
  ["intune", 1, 2, 1],
  ["mde", 2, 1, 2],
  ["xdr", 3, 2, 0],
  ["sentinel", 3, 2, 1],
  ["backup", 5, 1, 0],
  ["asr", 5, 1, 1],
];
const fnsOf = (col, span) => CODES.slice(col, col + span);

/** Figure: conceptual mapping of the six functions to Microsoft products, Azure services and processes. */
export const Architecture = ({ c }) => {
  const [tile, setTile] = useState("sentinel");
  const [fn, setFn] = useState(null);
  const detail = c.tiles[tile];
  const processes = c.functions;

  const select = (id) => ({
    onMouseEnter: () => {
      setTile(id);
      setFn(null);
    },
    onFocus: () => {
      setTile(id);
      setFn(null);
    },
    onClick: () => setTile(id),
  });

  return (
    <>
      <div className="hidden xl:block">
        <svg
          viewBox="0 0 1120 600"
          className="h-auto w-full"
          role="group"
          aria-label={c.title}
          onMouseLeave={() => setFn(null)}
        >
          <defs>
            <marker
              id="dg-head-a"
              viewBox="0 0 8 8"
              refX="7"
              refY="4"
              markerWidth="7"
              markerHeight="7"
              orient="auto-start-reverse"
            >
              <path d="M0 0 8 4 0 8Z" className="dg-arrow" />
            </marker>
          </defs>

          <rect x="8" y="84" width="1104" height="348" rx="10" fill="var(--dg-band)" opacity="0.45" />
          <rect x="8" y="444" width="1104" height="144" rx="10" fill="var(--dg-band)" opacity="0.45" />
          <foreignObject x="14" y="96" width="88" height="80">
            <p className="text-[11px] font-medium leading-snug text-muted">{c.lanes.tech}</p>
          </foreignObject>
          <foreignObject x="14" y="456" width="88" height="80">
            <p className="text-[11px] font-medium leading-snug text-muted">{c.lanes.process}</p>
          </foreignObject>

          {/* Each function connects down into its column */}
          {CODES.map((code, i) => (
            <path
              key={code}
              d={`M${colX(i) + TILE_W / 2} 64V${TILE_ROWS[0]}`}
              className="dg-edge"
              opacity={fn && fn !== code ? 0.25 : 1}
              markerEnd="url(#dg-head-a)"
            />
          ))}

          {/* Signals feed the SIEM; XDR and Sentinel work together */}
          <path
            d={`M${colX(2) + TILE_W} ${TILE_ROWS[2] + TILE_H / 2}H${colX(3) + 158}V${TILE_ROWS[1] + TILE_H + 2}`}
            className="dg-edge"
            markerEnd="url(#dg-head-a)"
          />
          <text x={colX(2) + TILE_W + 12} y={TILE_ROWS[2] + TILE_H / 2 + 18} className="dg-text">
            {c.flowLabel}
          </text>
          <path
            d={`M${colX(3) + 158} ${TILE_ROWS[0] + TILE_H + 2}V${TILE_ROWS[1] - 2}`}
            className="dg-edge"
            markerStart="url(#dg-head-a)"
            markerEnd="url(#dg-head-a)"
          />

          {CODES.map((code, i) => {
            const x = colX(i);
            const f = c.functionNames[i];
            return (
              <g
                key={code}
                role="button"
                tabIndex={0}
                className="dg-node"
                data-active={fn === code || undefined}
                onMouseEnter={() => setFn(code)}
                onFocus={() => setFn(code)}
                onClick={() => setFn(code)}
              >
                <rect x={x} y="16" width={TILE_W} height="48" rx="7" />
                <foreignObject x={x} y="16" width={TILE_W} height="48">
                  <div className="flex h-full items-center gap-2 px-3 text-fg">
                    <DIcon name={FN_ICONS[code]} className="size-4 shrink-0 text-dg-cyan" />
                    <span className="truncate text-[12.5px] font-semibold">{f}</span>
                    <span className="ml-auto font-mono text-[10px] text-muted">{code}</span>
                  </div>
                </foreignObject>
              </g>
            );
          })}

          {LAYOUT.map(([id, col, span, row]) => {
            const x = colX(col);
            const y = TILE_ROWS[row];
            const w = TILE_W + (span - 1) * CW;
            const t = c.tiles[id];
            return (
              <g
                key={id}
                role="button"
                tabIndex={0}
                className={`dg-node ${t.kind === "azure" ? "is-azure" : ""}`}
                data-active={tile === id && !fn ? true : undefined}
                data-dim={fn && !fnsOf(col, span).includes(fn) ? true : undefined}
                {...select(id)}
              >
                <rect x={x} y={y} width={w} height={TILE_H} rx="7" />
                <foreignObject x={x} y={y} width={w} height={TILE_H}>
                  <div className="flex h-full flex-col justify-center gap-1 px-3 text-fg">
                    <span className="flex items-center gap-1.5">
                      <DIcon name={ICON_BY_TILE[id]} className="size-3.5 shrink-0 text-dg-cyan" />
                      <span className="text-[12.5px] font-medium leading-tight">{t.name}</span>
                    </span>
                    {t.sub && <span className="text-[11px] leading-tight text-muted">{t.sub}</span>}
                  </div>
                </foreignObject>
              </g>
            );
          })}

          {processes.map((list, i) => {
            const code = CODES[i];
            return (
              <g key={code} className="dg-node is-process" data-dim={fn && fn !== code ? true : undefined}>
                <rect x={colX(i)} y="456" width={TILE_W} height="120" rx="7" />
                <foreignObject x={colX(i)} y="456" width={TILE_W} height="120">
                  <ul className="flex h-full flex-col justify-center gap-1.5 px-3 text-[11.5px] leading-tight text-fg">
                    {list.process.map((p) => (
                      <li key={p}>{p}</li>
                    ))}
                  </ul>
                </foreignObject>
              </g>
            );
          })}
        </svg>
        <p aria-live="polite" className="mt-3 min-h-11 rounded-lg border border-line bg-dg-panel px-4 py-2.5 text-sm">
          <span className="font-medium">{detail.name}.</span> <span className="text-muted">{detail.text}</span>
        </p>
      </div>

      <div className="space-y-3 xl:hidden">
        {CODES.map((code, i) => (
          <section key={code} className="rounded-lg border border-line bg-dg-panel p-3">
            <h4 className="flex items-center gap-2 text-sm font-semibold">
              <DIcon name={FN_ICONS[code]} className="size-4 text-dg-cyan" />
              {c.functionNames[i]}
              <span className="ml-auto font-mono text-[11px] font-normal text-muted">{code}</span>
            </h4>
            <ul className="mt-2 space-y-2">
              {LAYOUT.filter(([, col, span]) => fnsOf(col, span).includes(code)).map(([id]) => (
                <li
                  key={id}
                  className={`rounded border-l-2 pl-2.5 text-sm ${
                    c.tiles[id].kind === "azure" ? "border-dg-cyan" : "border-dg-blue"
                  }`}
                >
                  <span className="font-medium">{c.tiles[id].name}</span>
                  <span className="block text-muted">{c.tiles[id].text}</span>
                </li>
              ))}
              {c.functions[i].process.map((p) => (
                <li key={p} className="border-l-2 border-dashed border-dg-teal pl-2.5 text-sm text-muted">
                  {p}
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </>
  );
};

const LEVEL = { low: 1, medium: 2, high: 3 };
const LevelChip = ({ value, label }) => (
  <span
    style={{ background: `var(--sev-${LEVEL[value]})`, color: `var(--sev-${LEVEL[value]}-ink)` }}
    className="inline-block rounded px-1.5 py-0.5 text-xs font-medium"
  >
    {label}
  </span>
);

/** Example risk register: a table on wide screens, stacked records on small ones. */
export const RiskRegister = ({ c }) => (
  <>
    <div className="hidden overflow-x-auto xl:block">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-line-strong">
            {c.columns.map((col) => (
              <th
                key={col}
                scope="col"
                className="whitespace-nowrap px-2 py-2 font-mono text-[11px] font-normal text-muted"
              >
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {c.rows.map((r) => (
            <tr key={r.id} className="border-b border-line align-top transition-colors hover:bg-dg-band">
              <th scope="row" className="whitespace-nowrap px-2 py-2.5 font-mono text-xs font-normal">
                {r.id}
              </th>
              <td className="px-2 py-2.5">{r.asset}</td>
              <td className="px-2 py-2.5 text-muted">{r.risk}</td>
              <td className="px-2 py-2.5">{c.levels[r.likelihood]}</td>
              <td className="px-2 py-2.5">{c.levels[r.impact]}</td>
              <td className="px-2 py-2.5">
                <LevelChip value={r.level} label={c.levels[r.level]} />
              </td>
              <td className="px-2 py-2.5 text-muted">{r.mitigation}</td>
              <td className="px-2 py-2.5">{r.owner}</td>
              <td className="whitespace-nowrap px-2 py-2.5">{r.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    <ul className="space-y-3 xl:hidden">
      {c.rows.map((r) => (
        <li key={r.id} className="rounded-lg border border-line bg-dg-panel p-3 text-sm">
          <p className="flex items-center justify-between gap-2">
            <span className="font-medium">
              <span className="mr-2 font-mono text-xs text-muted">{r.id}</span>
              {r.asset}
            </span>
            <LevelChip value={r.level} label={c.levels[r.level]} />
          </p>
          <p className="mt-1.5 text-muted">{r.risk}</p>
          <dl className="mt-2 grid grid-cols-[auto_1fr] gap-x-3 gap-y-0.5 text-xs">
            <dt className="text-muted">{c.columns[3]}</dt>
            <dd>{c.levels[r.likelihood]}</dd>
            <dt className="text-muted">{c.columns[4]}</dt>
            <dd>{c.levels[r.impact]}</dd>
            <dt className="text-muted">{c.columns[6]}</dt>
            <dd>{r.mitigation}</dd>
            <dt className="text-muted">{c.columns[7]}</dt>
            <dd>{r.owner}</dd>
            <dt className="text-muted">{c.columns[8]}</dt>
            <dd>{r.status}</dd>
          </dl>
        </li>
      ))}
    </ul>
  </>
);

const TIERS = 4;
const pos = (tier) => `${((tier - 1) / (TIERS - 1)) * 100}%`;

/** Dumbbell chart: current and target tier per domain on one shared scale. */
export const GapChart = ({ c }) => {
  const { t } = useTranslation();
  const [hover, setHover] = useState(null);
  return (
    <div>
      <div className="mb-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted">
        <span className="inline-flex items-center gap-1.5">
          <span className="size-2.5 rounded-full border-2 border-dg-blue bg-dg-surface" />
          {t("ui.project.current")}
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="size-2.5 rounded-full bg-dg-blue" />
          {t("ui.project.target")}
        </span>
      </div>
      <div className="grid grid-cols-[1fr] items-center gap-x-6 md:grid-cols-[13rem_1fr_6rem]">
        <span className="hidden md:block" />
        <div className="relative mx-2 hidden h-8 md:block" aria-hidden="true">
          {c.tiers.map((tier, i) => (
            <span
              key={tier}
              style={{ left: pos(i + 1) }}
              className="absolute -translate-x-1/2 whitespace-nowrap font-mono text-[10px] text-muted first:translate-x-0 last:-translate-x-full"
            >
              {i + 1} {tier}
            </span>
          ))}
        </div>
        <span className="hidden font-mono text-[11px] text-muted md:block">{t("ui.project.priority")}</span>

        {c.rows.map((row) => (
          <div
            key={row.name}
            className={`contents`}
            onMouseEnter={() => setHover(row.name)}
            onMouseLeave={() => setHover(null)}
          >
            <span className="pt-3 text-sm font-medium md:py-2.5 md:pt-2.5">{row.name}</span>
            <div
              className="relative mx-2 h-7"
              role="img"
              aria-label={`${row.name}: ${t("ui.project.current")} ${row.current}, ${t("ui.project.target")} ${row.target}`}
            >
              <span className="absolute inset-x-0 top-1/2 h-px bg-line" />
              {[1, 2, 3, 4].map((tick) => (
                <span
                  key={tick}
                  style={{ left: pos(tick) }}
                  className="absolute top-1/2 h-2 w-px -translate-y-1/2 bg-line-strong"
                />
              ))}
              <span
                style={{ left: pos(row.current), width: `calc(${pos(row.target)} - ${pos(row.current)})` }}
                className="absolute top-1/2 h-0.5 -translate-y-1/2 bg-dg-blue"
              />
              <span
                style={{ left: pos(row.current) }}
                className="absolute top-1/2 size-3 -translate-1/2 rounded-full border-2 border-dg-blue bg-dg-surface"
              />
              <span
                style={{ left: pos(row.target) }}
                className="absolute top-1/2 size-3 -translate-1/2 rounded-full bg-dg-blue ring-2 ring-dg-surface"
              />
              {hover === row.name && (
                <span
                  style={{ left: pos((row.current + row.target) / 2) }}
                  className="absolute bottom-full z-10 mb-1 -translate-x-1/2 whitespace-nowrap rounded border border-line-strong bg-dg-panel px-2 py-1 text-xs shadow"
                >
                  {t("ui.project.tier")} {row.current} → {row.target}
                </span>
              )}
            </div>
            <span className="pb-2 text-xs md:pb-0">
              <span className="text-muted md:hidden">{t("ui.project.priority")}: </span>
              {row.priority}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

/** Six phases, left to right on wide screens and stacked on small ones. */
export const Roadmap = ({ c }) => (
  <ol className="grid gap-2 md:grid-cols-2 xl:grid-cols-6">
    {c.phases.map((phase, i) => (
      <li key={phase.title} className="relative rounded-lg border border-line bg-dg-panel p-3.5">
        {i < c.phases.length - 1 && (
          <span
            aria-hidden="true"
            className="absolute -right-2 top-7 z-10 hidden size-0 -translate-y-1/2 border-y-[6px] border-l-[7px] border-y-transparent border-l-dg-cyan xl:block"
          />
        )}
        <p className="font-mono text-[11px] text-muted">
          {c.phaseLabel} {i + 1}
        </p>
        <p className="mt-1 text-sm font-semibold leading-snug">{phase.title}</p>
        <p className="mt-2 text-sm leading-snug text-muted">{phase.text}</p>
        <p className="mt-3 font-mono text-[11px] text-dg-cyan">{phase.fns}</p>
      </li>
    ))}
  </ol>
);
