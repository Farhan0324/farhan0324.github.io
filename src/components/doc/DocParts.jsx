import { useTranslation } from "../../lib/i18n";

const ICONS = {
  alert: "M12 9v4m0 4h.01M10.3 3.9 2.4 18a2 2 0 0 0 1.7 3h15.8a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z",
  search: "M21 21l-5-5m2-5a7 7 0 1 1-14 0 7 7 0 0 1 14 0Z",
  tag: "M7 7h.01M3 5v6.2a2 2 0 0 0 .6 1.4l8.8 8.8a2 2 0 0 0 2.8 0l6.2-6.2a2 2 0 0 0 0-2.8l-8.8-8.8A2 2 0 0 0 11.2 3H5a2 2 0 0 0-2 2Z",
  gauge: "M12 14l4-4M4.9 19a9 9 0 1 1 14.2 0",
  users:
    "M17 20v-1a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v1m18 0v-1a4 4 0 0 0-3-3.9M14 4.2a4 4 0 0 1 0 7.6M14 8a4 4 0 1 1-8 0 4 4 0 0 1 8 0Z",
  shield: "M12 3l7 3v5.5c0 4.4-3 8-7 9.5-4-1.5-7-5.1-7-9.5V6l7-3Zm-3 9 2 2 4-4",
  evidence:
    "M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h4M14 3l5 5M14 3v5h5M21 21l-2.2-2.2M19 16a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z",
  tool: "M14.7 6.3a4 4 0 0 0-5 5L4 17l3 3 5.7-5.7a4 4 0 0 0 5-5l-2.5 2.5-2.2-.8-.8-2.2 2.5-2.5Z",
  recover: "M3 12a9 9 0 1 0 3-6.7L3 8M3 3v5h5",
  megaphone:
    "M3 11v2a1 1 0 0 0 1 1h3l9 5V5L7 10H4a1 1 0 0 0-1 1Zm16-1a3 3 0 0 1 0 4M8 14.5V19a1 1 0 0 0 1 1h1a1 1 0 0 0 1-1v-3",
  review:
    "M9 4H7a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2h-2M9 4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v1a1 1 0 0 1-1 1h-4a1 1 0 0 1-1-1V4Zm0 9 2 2 4-4",
  branch: "M6 3v12M18 9a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm-12 12a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm12-12a9 9 0 0 1-9 9",
  loop: "M4 12a8 8 0 0 1 13.7-5.7L20 9M20 4v5h-5M20 12a8 8 0 0 1-13.7 5.7L4 15M4 20v-5h5",
  identity: "M16 8a4 4 0 1 1-8 0 4 4 0 0 1 8 0ZM4 21v-1a6 6 0 0 1 9-5.2M16 19l2 2 4-4",
  endpoint: "M4 6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v9H4V6ZM2 19h20",
  cloud: "M7 18a4 4 0 0 1-.9-7.9 6 6 0 0 1 11.7 1A3.5 3.5 0 0 1 17.5 18H7Z",
  monitor: "M3 12h4l3-8 4 16 3-8h4",
  governance: "M3 10 12 4l9 6H3Zm2 0v8m4-8v8m6-8v8m4-8v8M3 21h18",
  clock: "M12 7v5l3 2M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z",
  flag: "M5 21V4m0 1h12l-2 4 2 4H5",
  data: "M12 3c4.4 0 8 1.3 8 3s-3.6 3-8 3-8-1.3-8-3 3.6-3 8-3ZM4 6v12c0 1.7 3.6 3 8 3s8-1.3 8-3V6M4 12c0 1.7 3.6 3 8 3s8-1.3 8-3",
  doc: "M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8l-5-5Zm0 0v5h5M9 13h6M9 17h6",
};

export const DIcon = ({ name, className = "size-4" }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.6"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
  >
    <path d={ICONS[name]} />
  </svg>
);

const TAG_STYLE = "rounded border border-line-strong px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-wider";

export const StatusTag = ({ kind }) => {
  const { t } = useTranslation();
  return <span className={`${TAG_STYLE} text-muted`}>{t(`ui.project.${kind}`)}</span>;
};

export const Section = ({ id, n, title, lead, children }) => (
  <section id={id} aria-labelledby={`${id}-title`} className="scroll-mt-24 border-t border-line py-14 sm:py-16">
    <div className="grid gap-3 lg:grid-cols-[4rem_1fr]">
      <p className="font-mono text-sm text-subtle">{String(n).padStart(2, "0")}</p>
      <div className="max-w-3xl">
        <h2 id={`${id}-title`} className="text-2xl font-semibold tracking-tight sm:text-3xl">
          {title}
        </h2>
        {lead && <p className="mt-3 leading-relaxed text-muted">{lead}</p>}
      </div>
    </div>
    <div className="mt-8">{children}</div>
  </section>
);

/** A numbered figure on the diagram surface, with its status tag, legend and note. */
export const Figure = ({ n, title, status, legend, note, children }) => {
  const { t } = useTranslation();
  return (
    <figure className="rounded-xl border border-line bg-dg-surface">
      <figcaption className="flex flex-wrap items-center justify-between gap-2 border-b border-line px-4 py-3 sm:px-5">
        <span className="text-sm">
          <span className="font-mono text-xs text-subtle">
            {t("ui.project.figure")} {n}
          </span>
          <span className="ml-2 font-medium">{title}</span>
        </span>
        {status && <StatusTag kind={status} />}
      </figcaption>
      <div className="p-3 sm:p-5">{children}</div>
      {(legend || note) && (
        <div className="space-y-2 border-t border-line px-4 py-3 text-xs leading-relaxed text-muted sm:px-5">
          {legend && <Legend items={legend} />}
          {note && <p>{note}</p>}
        </div>
      )}
    </figure>
  );
};

const SWATCH = {
  step: "border border-dg-blue",
  product: "border border-dg-blue",
  decision: "size-2.5! rotate-45 border border-dg-cyan",
  azure: "border border-dg-cyan",
  regulatory: "border border-dashed border-dg-teal",
  process: "border border-dashed border-dg-teal",
  ghost: "border border-dotted border-dg-line",
};

const Legend = ({ items }) => {
  const { t } = useTranslation();
  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
      <span className="font-mono text-[10px] uppercase tracking-wider text-subtle">{t("ui.project.legend")}</span>
      {items.map(({ kind, label }) => (
        <span key={kind} className="inline-flex items-center gap-1.5">
          <span aria-hidden="true" className={`inline-block h-3 w-4 rounded-[3px] ${SWATCH[kind]}`} />
          {label}
        </span>
      ))}
    </div>
  );
};

/** Separates what was actually done from what is conceptual or only an example. */
export const Provenance = ({ title, items }) => (
  <div className="rounded-xl border border-line">
    <p className="border-b border-line px-5 py-3 text-sm font-medium">{title}</p>
    <dl className="divide-y divide-line">
      {items.map((item) => (
        <div key={item.label} className="grid gap-1 px-5 py-4 md:grid-cols-[12rem_1fr] md:gap-6">
          <dt className="text-sm font-medium">{item.label}</dt>
          <dd className="text-sm leading-relaxed text-muted">{item.text}</dd>
        </div>
      ))}
    </dl>
  </div>
);

export const DocList = ({ items }) => (
  <ul className="grid gap-x-8 sm:grid-cols-2">
    {items.map((item) => (
      <li key={item.label ?? item} className="flex gap-3 border-b border-line py-3 text-sm">
        <DIcon name="doc" className="mt-0.5 size-4 shrink-0 text-dg-cyan" />
        <span>
          {item.label ?? item}
          {item.code && <span className="ml-2 font-mono text-xs text-subtle">{item.code}</span>}
        </span>
      </li>
    ))}
  </ul>
);

export const Deliverables = ({ items }) => (
  <ol className="grid gap-px overflow-hidden rounded-xl border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
    {items.map((item, i) => (
      <li key={item.title} className="bg-bg p-5">
        <p className="font-mono text-xs text-subtle">D{i + 1}</p>
        <p className="mt-2 font-medium">{item.title}</p>
        <p className="mt-1.5 text-sm leading-relaxed text-muted">{item.text}</p>
      </li>
    ))}
  </ol>
);
