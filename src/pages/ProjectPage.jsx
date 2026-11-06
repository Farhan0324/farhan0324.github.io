import { useEffect } from "react";
import { Backdrop } from "../App";
import Footer from "../components/Footer";
import Nav from "../components/Nav";
import Toaster from "../components/Toaster";
import { Icon } from "../components/Icons";
import { Deliverables, DocList, Figure, Provenance, Section } from "../components/doc/DocParts";
import {
  EscalationPath,
  Lifecycle,
  ReportingTimeline,
  RolesTable,
  SeverityMatrix,
} from "../components/doc/Nis2Diagrams";
import { Architecture, CsfFunctions, GapChart, RiskRegister, Roadmap } from "../components/doc/NistDiagrams";
import nis2 from "../data/projects/nis2.json";
import nist from "../data/projects/nist.json";
import { useTranslation } from "../lib/i18n";

const NIS2_LEGEND = (c) => [
  { kind: "step", label: c.legend.step },
  { kind: "decision", label: c.legend.decision },
  { kind: "regulatory", label: c.legend.regulatory },
  { kind: "ghost", label: c.legend.loop },
];

const Nis2Body = ({ c, t }) => (
  <>
    <Section id="overview" n={1} title={c.sections.overview} lead={c.overview.text}>
      <Provenance title={c.overview.provenanceTitle} items={c.overview.provenance} />
    </Section>
    <Section id="lifecycle" n={2} title={c.sections.lifecycle} lead={c.lifecycle.lead}>
      <Figure n={1} title={c.lifecycle.title} status="conceptual" legend={NIS2_LEGEND(c)} note={t("ui.project.hover")}>
        <Lifecycle c={c.lifecycle} />
      </Figure>
    </Section>
    <Section id="classification" n={3} title={c.sections.classification} lead={c.matrix.lead}>
      <div className="space-y-5">
        <Figure n={2} title={c.matrix.title} status="illustrative" note={c.matrix.note}>
          <SeverityMatrix c={c.matrix} />
        </Figure>
        <Figure n={3} title={c.escalation.title} status="illustrative" note={c.escalation.note}>
          <EscalationPath c={c.escalation} />
        </Figure>
      </div>
    </Section>
    <Section id="roles" n={4} title={c.sections.roles} lead={c.rolesTable.lead}>
      <RolesTable c={c.rolesTable} />
    </Section>
    <Section id="reporting" n={5} title={c.sections.reporting} lead={c.timeline.lead}>
      <Figure n={4} title={c.timeline.title} note={c.timeline.note}>
        <ReportingTimeline c={c.timeline} />
      </Figure>
    </Section>
    <Section id="documentation" n={6} title={c.sections.documentation} lead={c.documentation.lead}>
      <DocList items={c.documentation.items} />
    </Section>
    <Section id="deliverables" n={7} title={c.sections.deliverables}>
      <Deliverables items={c.deliverables} />
    </Section>
  </>
);

const NIST_LEGEND = (c) => [
  { kind: "product", label: c.legend.product },
  { kind: "azure", label: c.legend.azure },
  { kind: "process", label: c.legend.process },
];

const NistBody = ({ c, t }) => (
  <>
    <Section id="overview" n={1} title={c.sections.overview} lead={c.overview.text}>
      <Provenance title={c.overview.provenanceTitle} items={c.overview.provenance} />
    </Section>
    <Section id="functions" n={2} title={c.sections.functions} lead={c.functions.lead}>
      <Figure n={1} title={c.functions.title} status="illustrative" note={t("ui.project.hover")}>
        <CsfFunctions c={c.functions} />
      </Figure>
    </Section>
    <Section id="architecture" n={3} title={c.sections.architecture} lead={c.architecture.lead}>
      <Figure n={2} title={c.architecture.title} status="conceptual" legend={NIST_LEGEND(c)} note={c.architecture.note}>
        <Architecture c={c.architecture} />
      </Figure>
    </Section>
    <Section id="risk" n={4} title={c.sections.risk} lead={c.register.lead}>
      <Figure n={3} title={c.register.title} status="fictional">
        <RiskRegister c={c.register} />
      </Figure>
    </Section>
    <Section id="gap" n={5} title={c.sections.gap} lead={c.gap.lead}>
      <Figure n={4} title={c.gap.title} status="illustrative" note={c.gap.note}>
        <GapChart c={c.gap} />
      </Figure>
    </Section>
    <Section id="roadmap" n={6} title={c.sections.roadmap} lead={c.roadmap.lead}>
      <Figure n={5} title={c.roadmap.title} status="conceptual">
        <Roadmap c={c.roadmap} />
      </Figure>
    </Section>
    <Section id="evidence" n={7} title={c.sections.evidence} lead={c.evidence.lead}>
      <DocList items={c.evidence.items} />
    </Section>
    <Section id="deliverables" n={8} title={c.sections.deliverables}>
      <Deliverables items={c.deliverables} />
    </Section>
  </>
);

const PAGES = {
  "nist-csf-microsoft": { content: nist, Body: NistBody, next: "nis2-incident-response" },
  "nis2-incident-response": { content: nis2, Body: Nis2Body, next: "nist-csf-microsoft" },
};

const ProjectPage = ({ slug }) => {
  const { t, lang } = useTranslation();
  const { content, Body, next } = PAGES[slug];
  const c = content[lang] ?? content.en;
  const nextPage = PAGES[next].content[lang] ?? PAGES[next].content.en;

  useEffect(() => {
    document.title = `${c.title} | Farhan Amjad`;
    document.querySelector('meta[name="description"]')?.setAttribute("content", c.description);
  }, [c]);

  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-100 focus:rounded-full focus:bg-fg focus:px-4 focus:py-2 focus:text-sm focus:text-bg"
      >
        {t("ui.skip")}
      </a>
      <Backdrop />
      <Nav base="/" />
      <main id="main">
        <div id="top" className="container-x pb-10 pt-28 sm:pt-32">
          <a href="/#projects" className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-fg">
            <Icon name="arrowRight" className="size-3.5 rotate-180" />
            {t("ui.project.back")}
          </a>
          <p className="mt-8 font-mono text-xs text-muted">{c.categories}</p>
          <h1 className="mt-3 max-w-4xl text-3xl font-semibold leading-[1.1] tracking-tight sm:text-5xl">{c.title}</h1>
          <p className="mt-5 max-w-3xl text-base leading-relaxed text-muted sm:text-lg">{c.description}</p>

          <nav aria-label={t("ui.project.contents")} className="mt-8">
            <ul className="flex flex-wrap gap-x-5 gap-y-1.5 text-sm">
              {Object.entries(c.sections).map(([id, title]) => (
                <li key={id}>
                  <a href={`#${id}`} className="text-muted underline-offset-4 hover:text-fg hover:underline">
                    {title}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="container-x">
          <Body c={c} t={t} />

          <section className="border-t border-line py-10">
            <h2 className="font-mono text-xs uppercase tracking-wider text-muted">{t("ui.project.skills")}</h2>
            <ul className="mt-4 flex flex-wrap gap-1.5">
              {c.skills.map((skill) => (
                <li key={skill} className="chip">
                  {skill}
                </li>
              ))}
            </ul>
          </section>

          <a
            href={`/projects/${next}/`}
            className="group mb-16 flex items-center justify-between gap-6 border-t border-line py-8"
          >
            <span>
              <span className="block font-mono text-xs uppercase tracking-wider text-muted">
                {t("ui.project.next")}
              </span>
              <span className="mt-2 block text-lg font-medium">{nextPage.title}</span>
            </span>
            <Icon name="arrowRight" className="size-5 shrink-0 transition-transform group-hover:translate-x-1" />
          </a>
        </div>
      </main>
      <Footer base="/" />
      <Toaster />
    </>
  );
};

export default ProjectPage;
