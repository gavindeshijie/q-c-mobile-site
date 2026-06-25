"use client";

import { useState } from "react";
import { ChevronDown, CircleHelp, ShieldCheck } from "lucide-react";

type TrustSignal = {
  value: string;
  label: string;
  description: string;
};

type FAQItem = {
  question: string;
  answer: string;
};

type TrustFAQSectionProps = {
  faqs: readonly FAQItem[];
  trustSignals: readonly TrustSignal[];
};

export function TrustFAQSection({ faqs, trustSignals }: TrustFAQSectionProps) {
  const [openQuestion, setOpenQuestion] = useState(faqs[0]?.question ?? "");

  return (
    <section className="relative z-10 mx-5 mt-7 space-y-4">
      <div className="grid grid-cols-3 gap-2">
        {trustSignals.map((item) => (
          <div
            key={item.label}
            className="min-h-[112px] rounded-[18px] border border-white/10 bg-white/[0.052] p-3 shadow-[0_18px_50px_rgba(0,0,0,0.26),inset_0_1px_0_rgba(255,255,255,0.1)] backdrop-blur-md"
          >
            <div className="flex items-center justify-between gap-2">
              <strong className="text-xl font-black text-white">{item.value}</strong>
              <ShieldCheck size={15} strokeWidth={2.1} className="text-cyan-200/78" />
            </div>
            <p className="mt-2 text-[11px] font-black text-cyan-100/90">{item.label}</p>
            <p className="mt-1 text-[10px] leading-4 text-slate-300/62">{item.description}</p>
          </div>
        ))}
      </div>

      <div className="rounded-[24px] border border-cyan-200/18 bg-white/[0.055] p-4 shadow-[0_20px_70px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.11)] backdrop-blur-md">
        <div className="flex items-center gap-3">
          <span className="grid size-10 place-items-center rounded-[18px] border border-cyan-200/24 bg-cyan-300/12 text-cyan-100">
            <CircleHelp size={19} strokeWidth={2.1} />
          </span>
          <div>
            <p className="text-[11px] font-black uppercase tracking-[0.18em] text-cyan-200/70">
              FAQ
            </p>
            <h2 className="mt-1 text-xl font-black tracking-tight text-white">常见问题</h2>
          </div>
        </div>

        <div className="mt-4 grid gap-2">
          {faqs.map((item) => {
            const isOpen = openQuestion === item.question;

            return (
              <button
                key={item.question}
                type="button"
                className="rounded-[18px] border border-white/10 bg-slate-950/34 p-3 text-left transition active:scale-[0.99]"
                aria-expanded={isOpen}
                onClick={() => setOpenQuestion(isOpen ? "" : item.question)}
              >
                <span className="flex items-center justify-between gap-3 text-sm font-black text-white">
                  {item.question}
                  <ChevronDown
                    size={16}
                    strokeWidth={2.2}
                    className={`shrink-0 text-cyan-100/80 transition ${isOpen ? "rotate-180" : ""}`}
                  />
                </span>
                {isOpen ? (
                  <span className="mt-2 block text-xs leading-5 text-slate-300/72">
                    {item.answer}
                  </span>
                ) : null}
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
