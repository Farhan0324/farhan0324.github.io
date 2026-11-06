import { useMemo } from "react";
import SectionHeader from "./SectionHeader";
import { Icon } from "./Icons";
import { useExperienceYears } from "../lib/experience";
import { useTranslation } from "../lib/i18n";
import { spotlight, useClock, useCountUp, useReveal } from "../lib/hooks";
import { TIMEZONE } from "../lib/site";
import profile from "../data/profile.json";

const Tile = ({ className = "", delay = 0, children }) => {
  const reveal = useReveal();
  return (
    <div
      ref={reveal}
      onPointerMove={spotlight}
      style={{ "--delay": `${delay}ms` }}
      className={`card spotlight overflow-hidden p-6 sm:p-8 ${className}`}
    >
      {children}
    </div>
  );
};

const Stat = ({ value, label }) => {
  const [ref, current] = useCountUp(value);
  return (
    <div ref={ref} className="flex flex-col justify-between gap-6 p-6 sm:p-7">
      <span className="text-5xl font-semibold tracking-tighter tabular-nums sm:text-6xl">
        {current}
        <span className="text-accent">+</span>
      </span>
      <span className="text-sm text-muted">{label}</span>
    </div>
  );
};

const About = () => {
  const { t, lang } = useTranslation();
  const years = useExperienceYears();
  const time = useClock(TIMEZONE, lang === "de" ? "de-DE" : "en-GB");
  const current = useMemo(() => (t("workExperience.entries") || [])[0], [t]);

  return (
    <section id="about" className="section" aria-labelledby="about-title">
      <div className="container-x">
        <SectionHeader
          id="about-title"
          eyebrow={t("ui.about.eyebrow")}
          before={t("ui.about.heading_a")}
          em={t("ui.about.heading_em")}
        />

        <div className="grid gap-4 lg:grid-cols-6">
          {/* Intro */}
          <Tile className="lg:col-span-4">
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-subtle">
              {t("skills.headings.experience_snapshot")}
            </p>
            <p className="mt-5 text-xl leading-relaxed tracking-tight sm:text-2xl">
              {t("skills.intro.paragraph1", { years })}
            </p>
            <p className="mt-5 leading-relaxed text-muted">{t("skills.intro.paragraph2")}</p>
          </Tile>

          {/* Location + clock */}
          <Tile className="flex flex-col justify-between gap-10 lg:col-span-2" delay={80}>
            <div className="flex items-start justify-between">
              <div>
                <p className="font-mono text-xs uppercase tracking-[0.2em] text-subtle">{t("ui.about.location")}</p>
                <p className="mt-3 text-3xl font-semibold tracking-tight">{profile.location.city}</p>
                <p className="mt-1 text-sm text-muted">{profile.location.region}</p>
              </div>
              <Icon name="globe" className="size-10 text-accent/70" strokeWidth={1.2} />
            </div>
            <div className="flex items-end justify-between border-t border-line pt-5">
              <span className="text-sm text-muted">{t("ui.about.local_time")}</span>
              <span className="font-mono text-2xl tabular-nums">{time}</span>
            </div>
          </Tile>

          {/* Stats: hidden until profile.stats has real numbers */}
          {profile.stats.length > 0 && (
            <div className="grid grid-cols-2 gap-4 lg:col-span-6 lg:grid-cols-4">
              {profile.stats.map((s, i) => (
                <Tile key={i} className="p-0! sm:p-0!" delay={i * 60}>
                  <Stat value={s.value} label={s.label[lang] || s.label.en} />
                </Tile>
              ))}
            </div>
          )}

          {/* Skills */}
          <Tile className="lg:col-span-4">
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-subtle">{t("ui.about.skills")}</p>
            <ul className="mt-6 flex flex-wrap gap-2">
              {profile.skills.map((skill) => (
                <li key={skill} className="rounded-full border border-line bg-fg/3 px-4 py-2 text-sm font-medium">
                  {skill}
                </li>
              ))}
            </ul>
          </Tile>

          {/* Current role */}
          {current && (
            <Tile delay={80} className="flex flex-col justify-between gap-10 lg:col-span-2">
              <div>
                <p className="flex items-center gap-2 font-mono text-xs uppercase tracking-[0.2em] text-subtle">
                  <span className="relative flex size-1.5">
                    <span className="absolute inline-flex size-full animate-ping-slow rounded-full bg-ok opacity-60" />
                    <span className="relative inline-flex size-1.5 rounded-full bg-ok" />
                  </span>
                  {t("ui.hero.now")}
                </p>
                <p className="mt-5 text-2xl font-semibold tracking-tight">{current.company}</p>
                <p className="mt-1 text-sm text-muted">{current.role}</p>
                <p className="mt-5 text-sm leading-relaxed text-muted">{current.summary}</p>
              </div>
              <a href="#experience" className="group inline-flex items-center gap-2 text-sm font-medium">
                {t("hero.buttons.experience")}
                <Icon name="arrowRight" className="size-4 transition-transform group-hover:translate-x-0.5" />
              </a>
            </Tile>
          )}

          {/* Mission */}
          <Tile delay={60} className="bg-linear-to-br from-accent/10 via-transparent to-accent-2/10 lg:col-span-6">
            <div className="grid gap-6 lg:grid-cols-[12rem_1fr] lg:gap-10">
              <p className="font-mono text-xs uppercase tracking-[0.2em] text-subtle">{t("ui.about.mission")}</p>
              <p className="font-serif text-2xl italic leading-snug sm:text-3xl lg:text-[2.1rem]">
                “{t("skills.mission")}”
              </p>
            </div>
          </Tile>
        </div>
      </div>
    </section>
  );
};

export default About;
