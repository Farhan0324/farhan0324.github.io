import { useState } from "react";
import { DIcon } from "./DocParts";

const STEP_ICONS = [
  "alert",
  "search",
  "tag",
  "gauge",
  "users",
  "shield",
  "evidence",
  "tool",
  "recover",
  "megaphone",
  "review",
  "branch",
  "loop",
];

const W = 170;
const H = 72;
const COLS = [44, 248, 452, 656, 860];
const ROWS = { a: 62, b: 208, c: 354, d: 500 };
const POSITIONS = [
  [COLS[0], ROWS.a],
  [COLS[1], ROWS.a],
  [COLS[2], ROWS.a],
  [COLS[3], ROWS.a],
  [COLS[4], ROWS.b],
  [COLS[3], ROWS.b],
  [COLS[2], ROWS.b],
  [COLS[1], ROWS.b],
  [COLS[0], ROWS.b],
  [COLS[0], ROWS.c],
  [COLS[1], ROWS.c],
  [COLS[2], ROWS.c],
  [COLS[3], ROWS.c],
];
const LANE_X = [COLS[4], COLS[3], COLS[2], COLS[1], COLS[0]];

const Box = ({ x, y, kind = "", label, icon, n, active, onSelect, w = W, h = H }) => (
  <g
    role="button"
    tabIndex={0}
    className={`dg-node ${kind}`}
    data-active={active || undefined}
    onMouseEnter={onSelect}
    onFocus={onSelect}
    onClick={onSelect}
  >
    <rect x={x} y={y} width={w} height={h} rx="7" />
    <foreignObject x={x} y={y} width={w} height={h}>
      <div className="flex h-full flex-col justify-center gap-0.5 px-3 text-fg">
        <span className="flex items-center gap-1.5 text-dg-cyan">
          {icon && <DIcon name={icon} className="size-3.5" />}
          {n && <span className="font-mono text-[11px] text-muted">{n}</span>}
        </span>
        <span className="text-[12.5px] font-medium leading-[1.2]">{label}</span>
      </div>
    </foreignObject>
  </g>
);

const Arrowheads = () => (
  <defs>
    <marker id="dg-head" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="7" markerHeight="7" orient="auto">
      <path d="M0 0 8 4 0 8Z" className="dg-arrow" />
    </marker>
    <marker id="dg-head-reg" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="7" markerHeight="7" orient="auto">
      <path d="M0 0 8 4 0 8Z" className="dg-arrow is-regulatory" />
    </marker>
  </defs>
);

const Edge = ({ d, regulatory }) => (
  <path
    d={d}
    className={`dg-edge ${regulatory ? "is-regulatory" : ""}`}
    markerEnd={`url(#${regulatory ? "dg-head-reg" : "dg-head"})`}
  />
);

const Band = ({ x, y, w, h, label, labelX = x + 12 }) => (
  <g aria-hidden="true">
    <rect x={x} y={y} width={w} height={h} rx="10" fill="var(--dg-band)" opacity="0.45" />
    <text x={labelX} y={y + 16} className="dg-text">
      {label}
    </text>
  </g>
);

const right = (i) => POSITIONS[i][0] + W;
const left = (i) => POSITIONS[i][0];
const midY = (i) => POSITIONS[i][1] + H / 2;

/** Figure: the 13-step lifecycle with the significance decision and the regulatory track. */
export const Lifecycle = ({ c }) => {
  const [active, setActive] = useState("s0");
  const lane = c.track;
  const detail = active.startsWith("s")
    ? c.steps[+active.slice(1)]
    : active === "decision"
      ? c.decision
      : active === "loop"
        ? c.loop
        : lane[+active.slice(1)];
  const cx = COLS[4] + W / 2;
  const dY = ROWS.a + H / 2;

  return (
    <>
      <div className="hidden xl:block">
        <svg viewBox="0 0 1120 590" className="h-auto w-full" role="group" aria-label={c.title}>
          <Arrowheads />
          <Band x={28} y={36} w={814} h={110} label={c.phases[0]} />
          <Band x={436} y={182} w={610} h={110} label={c.phases[1]} />
          <Band x={28} y={182} w={400} h={110} label={c.phases[2]} />
          <Band x={28} y={328} w={1018} h={110} label={c.phases[3]} labelX={146} />
          <Band x={28} y={474} w={1018} h={110} label={c.phases[4]} labelX={146} />

          {[0, 1, 2].map((i) => (
            <Edge key={i} d={`M${right(i)} ${midY(i)}H${left(i + 1) - 2}`} />
          ))}
          <Edge d={`M${right(3)} ${midY(3)}H${cx - 92}`} />
          <Edge d={`M${cx} ${dY + 56}V${ROWS.b - 2}`} />
          {[4, 5, 6, 7].map((i) => (
            <Edge key={i} d={`M${left(i)} ${midY(i)}H${right(i + 1) + 2}`} />
          ))}
          <Edge d={`M${COLS[0] + W / 2} ${ROWS.b + H}V${ROWS.c - 2}`} />
          {[9, 10, 11].map((i) => (
            <Edge key={i} d={`M${right(i)} ${midY(i)}H${left(i + 1) - 2}`} />
          ))}
          <Edge d={`M${right(12)} ${midY(12)}H${COLS[4] - 2}`} />

          <Edge regulatory d={`M${cx + 92} ${dY}H1092V${ROWS.d + H / 2}H${COLS[4] + W + 2}`} />
          {[0, 1, 2, 3].map((i) => (
            <Edge key={i} regulatory d={`M${LANE_X[i]} ${ROWS.d + H / 2}H${LANE_X[i + 1] + W + 2}`} />
          ))}
          <Edge regulatory d={`M${COLS[0] + W / 2} ${ROWS.d}V${ROWS.c + H + 2}`} />

          <text x={cx + 100} y={dY - 8} className="dg-text">
            {c.yes}
          </text>
          <text x={cx - 8} y={dY + 76} textAnchor="end" className="dg-text">
            {c.no}
          </text>

          {c.steps.map((s, i) => (
            <Box
              key={i}
              x={POSITIONS[i][0]}
              y={POSITIONS[i][1]}
              label={s.title}
              icon={STEP_ICONS[i]}
              n={String(i + 1).padStart(2, "0")}
              active={active === `s${i}`}
              onSelect={() => setActive(`s${i}`)}
            />
          ))}

          <g
            role="button"
            tabIndex={0}
            className="dg-node is-decision"
            data-active={active === "decision" || undefined}
            onMouseEnter={() => setActive("decision")}
            onFocus={() => setActive("decision")}
            onClick={() => setActive("decision")}
          >
            <polygon points={`${cx},${dY - 56} ${cx + 92},${dY} ${cx},${dY + 56} ${cx - 92},${dY}`} />
            <foreignObject x={cx - 62} y={dY - 30} width="124" height="60">
              <div className="flex h-full items-center justify-center text-center text-[12px] font-medium leading-[1.2] text-fg">
                {c.decision.title}
              </div>
            </foreignObject>
          </g>

          <Box
            x={COLS[4]}
            y={ROWS.c}
            kind="is-ghost"
            label={c.loop.title}
            icon="loop"
            active={active === "loop"}
            onSelect={() => setActive("loop")}
          />

          {lane.map((item, i) => (
            <Box
              key={i}
              x={LANE_X[i]}
              y={ROWS.d}
              kind="is-regulatory"
              label={item.title}
              icon={i === 0 ? "flag" : "clock"}
              active={active === `r${i}`}
              onSelect={() => setActive(`r${i}`)}
            />
          ))}
        </svg>
        <p aria-live="polite" className="mt-3 min-h-11 rounded-lg border border-line bg-dg-panel px-4 py-2.5 text-sm">
          <span className="font-medium">{detail.title}.</span> <span className="text-muted">{detail.text}</span>
        </p>
      </div>

      {/* Small screens: the same content as a vertical flow that stays readable without zooming */}
      <div className="xl:hidden">
        <ol>
          {c.steps.map((s, i) => (
            <li key={i}>
              <div className="flex gap-3 rounded-lg border border-dg-blue bg-dg-panel p-3">
                <DIcon name={STEP_ICONS[i]} className="mt-0.5 size-4 shrink-0 text-dg-cyan" />
                <div>
                  <p className="text-sm font-medium">
                    <span className="mr-1.5 font-mono text-xs text-muted">{String(i + 1).padStart(2, "0")}</span>
                    {s.title}
                  </p>
                  <p className="mt-1 text-sm leading-relaxed text-muted">{s.text}</p>
                </div>
              </div>
              {i === 3 ? (
                <div className="my-2 border-l-2 border-dg-cyan bg-dg-panel p-3 text-sm">
                  <p className="font-medium">{c.decision.title}</p>
                  <p className="mt-1 leading-relaxed text-muted">{c.decision.text}</p>
                  <p className="mt-2 font-mono text-xs text-muted">{c.yes}</p>
                  <ol className="mt-1 space-y-1.5 border-l border-dashed border-dg-teal pl-3">
                    {lane.map((item) => (
                      <li key={item.title}>
                        {item.title} <span className="text-muted">{item.text}</span>
                      </li>
                    ))}
                  </ol>
                  <p className="mt-2 font-mono text-xs text-muted">{c.no}</p>
                </div>
              ) : (
                i < c.steps.length - 1 && <span aria-hidden="true" className="mx-5 block h-4 w-px bg-dg-line" />
              )}
            </li>
          ))}
        </ol>
        <p className="mt-3 border-l-2 border-dotted border-dg-line pl-3 text-sm text-muted">
          <span className="font-medium text-fg">{c.loop.title}.</span> {c.loop.text}
        </p>
      </div>
    </>
  );
};

// Rows are impact (highest first), columns urgency (low to high). Values index c.levels.
const MATRIX = [
  [2, 3, 3],
  [1, 2, 3],
  [1, 1, 2],
  [0, 0, 1],
];
const sevStyle = (level) => ({
  background: `var(--sev-${level + 1})`,
  color: `var(--sev-${level + 1}-ink)`,
});

/** Figure: impact and urgency give a severity level. */
export const SeverityMatrix = ({ c }) => {
  const [level, setLevel] = useState(3);
  const selected = c.levels[level];
  return (
    <div className="grid gap-5 lg:grid-cols-[1fr_20rem]">
      <div>
        <div className="grid grid-cols-[4.5rem_repeat(3,1fr)] gap-1 sm:grid-cols-[7rem_repeat(3,1fr)]">
          <span className="self-end pb-1 font-mono text-[11px] text-muted">
            {c.impactLabel} ↓ / {c.urgencyLabel} →
          </span>
          {c.urgency.map((u) => (
            <span key={u} className="pb-1 text-center text-xs font-medium">
              {u}
            </span>
          ))}
          {MATRIX.map((row, r) => (
            <div key={r} className="contents">
              <span className="flex items-center text-xs font-medium">{c.impact[r]}</span>
              {row.map((value, col) => (
                <button
                  key={col}
                  type="button"
                  aria-pressed={level === value}
                  aria-label={`${c.impact[r]}, ${c.urgency[col]}: ${c.levels[value].name}`}
                  onMouseEnter={() => setLevel(value)}
                  onFocus={() => setLevel(value)}
                  onClick={() => setLevel(value)}
                  style={sevStyle(value)}
                  className={`h-14 rounded text-xs font-medium transition-[outline] sm:text-sm ${
                    level === value ? "outline-2 outline-offset-1 outline-dg-cyan" : ""
                  }`}
                >
                  {c.levels[value].name}
                </button>
              ))}
            </div>
          ))}
        </div>
      </div>
      <div className="rounded-lg border border-line bg-dg-panel p-4" aria-live="polite">
        <span style={sevStyle(level)} className="inline-block rounded px-2 py-0.5 text-xs font-medium">
          {selected.name}
        </span>
        <p className="mt-3 text-sm leading-relaxed">{selected.text}</p>
        <p className="mt-3 text-sm leading-relaxed text-muted">{selected.handling}</p>
      </div>
    </div>
  );
};

/** Figure: how far each level travels up the escalation path. */
export const EscalationPath = ({ c }) => {
  const count = c.roles.length;
  return (
    <>
      <div className="hidden pr-3 md:block">
        <div className="grid gap-1" style={{ gridTemplateColumns: `9rem repeat(${count}, 1fr)` }}>
          <span />
          {c.roles.map((role) => (
            <span key={role} className="px-1 pb-2 text-xs font-medium leading-snug">
              {role}
            </span>
          ))}
          {c.paths.map((path) => (
            <div key={path.name} className="contents">
              <span className="flex items-center text-sm font-medium">{path.name}</span>
              <div
                className={`relative my-1 flex h-9 items-center rounded-l ${
                  path.regulatory ? "border border-dashed border-dg-teal" : "bg-dg-band"
                }`}
                style={{ gridColumn: `2 / span ${path.reach}` }}
              >
                <span className="truncate px-3 text-xs text-muted">{path.note}</span>
                <span
                  aria-hidden="true"
                  className={`absolute -right-px top-1/2 size-0 -translate-y-1/2 translate-x-full border-y-[9px] border-l-[9px] border-y-transparent ${
                    path.regulatory ? "border-l-dg-teal" : "border-l-dg-line"
                  }`}
                />
              </div>
              {path.reach < count && <span style={{ gridColumn: `span ${count - path.reach}` }} />}
            </div>
          ))}
        </div>
      </div>
      <ul className="space-y-3 md:hidden">
        {c.paths.map((path) => (
          <li key={path.name} className="rounded-lg border border-line bg-dg-panel p-3 text-sm">
            <p className="font-medium">{path.name}</p>
            <p className="mt-1 text-muted">{c.roles.slice(0, path.reach).join(" → ")}</p>
            <p className="mt-1 text-xs text-muted">{path.note}</p>
          </li>
        ))}
      </ul>
    </>
  );
};

/** Figure: the NIS2 reporting stages, not drawn to scale. */
export const ReportingTimeline = ({ c }) => (
  <ol className="relative grid gap-0 xl:grid-cols-5">
    {c.stages.map((stage, i) => (
      <li key={stage.title} className="relative pb-6 pl-8 xl:pb-0 xl:pl-0 xl:pr-5 xl:pt-9">
        {/* Rail: vertical on small screens, horizontal with an arrow on wide ones */}
        <span
          aria-hidden="true"
          className={`absolute bg-dg-line ${i === c.stages.length - 1 ? "hidden xl:block" : ""} bottom-0 left-2.25 top-1 w-px xl:inset-x-0 xl:bottom-auto xl:top-3 xl:h-px xl:w-auto`}
        />
        {i === c.stages.length - 1 && (
          <span
            aria-hidden="true"
            className="absolute right-0 top-3 hidden size-0 -translate-y-1/2 border-y-[6px] border-l-[8px] border-y-transparent border-l-dg-line xl:block"
          />
        )}
        <span
          aria-hidden="true"
          className={`absolute left-0.5 top-1 size-4 rounded-full border-2 bg-dg-surface xl:left-0 xl:top-1 ${
            stage.optional ? "border-dashed border-dg-teal" : "border-dg-cyan"
          }`}
        />
        <p className="font-mono text-lg font-medium tracking-tight">{stage.when}</p>
        <p className="mt-1 text-sm font-medium">{stage.title}</p>
        <p className="mt-1 text-sm leading-relaxed text-muted">{stage.text}</p>
      </li>
    ))}
  </ol>
);

export const RolesTable = ({ c }) => (
  <div className="overflow-hidden rounded-xl border border-line">
    <table className="w-full text-left text-sm">
      <thead className="hidden bg-dg-surface sm:table-header-group">
        <tr>
          <th scope="col" className="w-64 px-4 py-2.5 font-mono text-[11px] font-normal uppercase text-muted">
            {c.roleHead}
          </th>
          <th scope="col" className="px-4 py-2.5 font-mono text-[11px] font-normal uppercase text-muted">
            {c.dutyHead}
          </th>
        </tr>
      </thead>
      <tbody className="divide-y divide-line">
        {c.roles.map((role) => (
          <tr key={role.name} className="block sm:table-row">
            <th scope="row" className="block px-4 pt-3 font-medium sm:table-cell sm:py-3 sm:align-top">
              {role.name}
            </th>
            <td className="block px-4 pb-3 pt-1 leading-relaxed text-muted sm:table-cell sm:py-3">{role.duty}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);
