import { ArrowRight } from "lucide-react";

import type { SiteContent } from "@/data/siteContent";

type CTASectionProps = {
  cta: SiteContent["cta"];
};

export function CTASection({ cta }: CTASectionProps) {
  return (
    <section id={cta.id} className="safe-x py-8">
      <div
        className="relative overflow-hidden rounded-[1.6rem] border border-cyan-100/[0.16] bg-[linear-gradient(145deg,rgba(255,255,255,0.11),rgba(255,255,255,0.045))] p-5 shadow-[0_30px_80px_rgba(20,184,166,0.14),inset_0_1px_0_rgba(255,255,255,0.16)] backdrop-blur-2xl"
      >
        <div className="absolute bottom-[-60px] left-1/2 size-44 -translate-x-1/2 rounded-full bg-cyan-300/18 blur-3xl" />
        <div className="absolute right-[-40px] top-[-44px] size-32 rounded-full bg-amber-200/12 blur-3xl" />
        <div className="relative">
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-cyan-100/50">
            Contact
          </p>
          <h2 className="mt-2 text-2xl font-semibold leading-tight tracking-normal text-white">
            {cta.title}
          </h2>
          <p className="mt-3 text-[14px] leading-6 text-white/[0.62]">
            {cta.description}
          </p>
          <a
            href={cta.action.href}
            className="mt-5 inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-cyan-100 px-5 text-sm font-semibold text-[#041018] shadow-[0_18px_42px_rgba(36,213,255,0.23)] transition active:scale-[0.97]"
          >
            {cta.action.label}
            <ArrowRight size={17} strokeWidth={2} />
          </a>
        </div>
      </div>
    </section>
  );
}
