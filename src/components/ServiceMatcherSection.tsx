"use client";

import { useState } from "react";
import { ArrowRight, Sparkles } from "lucide-react";

type MatcherIntro = {
  title: string;
  subtitle: string;
};

type MatcherItem = {
  id: string;
  label: string;
  need: string;
  recommendation: string;
  href: string;
  points: readonly string[];
};

type ServiceMatcherSectionProps = {
  intro: MatcherIntro;
  items: readonly MatcherItem[];
};

export function ServiceMatcherSection({ intro, items }: ServiceMatcherSectionProps) {
  const [activeId, setActiveId] = useState(items[0]?.id ?? "");
  const activeItem = items.find((item) => item.id === activeId) ?? items[0];

  if (!activeItem) {
    return null;
  }

  return (
    <section className="relative z-10 mx-5 mt-7 rounded-[24px] border border-cyan-200/18 bg-white/[0.055] p-4 shadow-[0_20px_70px_rgba(0,0,0,0.34),inset_0_1px_0_rgba(255,255,255,0.11)] backdrop-blur-md">
      <div className="flex items-start gap-3">
        <span className="grid size-10 shrink-0 place-items-center rounded-[18px] border border-cyan-200/24 bg-cyan-300/12 text-cyan-100">
          <Sparkles size={19} strokeWidth={2.1} />
        </span>
        <div>
          <p className="text-[11px] font-black uppercase tracking-[0.18em] text-cyan-200/70">
            AI MATCH
          </p>
          <h2 className="mt-1 text-xl font-black tracking-tight text-white">{intro.title}</h2>
          <p className="mt-1 text-xs leading-5 text-slate-300/72">{intro.subtitle}</p>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2">
        {items.map((item) => (
          <button
            key={item.id}
            type="button"
            className={`min-h-11 rounded-2xl border px-3 text-left text-xs font-bold transition active:scale-[0.98] ${
              item.id === activeItem.id
                ? "border-cyan-200/38 bg-cyan-300/14 text-cyan-50"
                : "border-white/10 bg-slate-950/30 text-slate-300/72"
            }`}
            onClick={() => setActiveId(item.id)}
          >
            {item.label}
          </button>
        ))}
      </div>

      <div className="mt-4 rounded-[18px] border border-white/10 bg-slate-950/38 p-4">
        <p className="text-xs font-semibold leading-5 text-slate-300/74">{activeItem.need}</p>
        <h3 className="mt-3 text-lg font-black text-white">{activeItem.recommendation}</h3>
        <ul className="mt-3 grid gap-2">
          {activeItem.points.map((point) => (
            <li key={point} className="flex gap-2 text-xs leading-5 text-slate-300/78">
              <span className="mt-2 size-1.5 shrink-0 rounded-full bg-cyan-200/80" />
              <span>{point}</span>
            </li>
          ))}
        </ul>
        <a
          href={activeItem.href}
          className="mt-4 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-2xl border border-cyan-200/24 bg-cyan-300/12 px-4 text-sm font-bold text-cyan-50 transition active:scale-[0.98]"
        >
          查看对应业务
          <ArrowRight size={16} strokeWidth={2.2} />
        </a>
      </div>
    </section>
  );
}
