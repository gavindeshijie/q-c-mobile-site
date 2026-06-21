"use client";

import {
  Code2,
  Cpu,
  Network,
  ShoppingBag,
  Store,
  type LucideIcon,
} from "lucide-react";

import type { SiteContent } from "@/data/siteContent";

type Business = SiteContent["businesses"][number];

const icons: Record<Business["icon"], LucideIcon> = {
  shoppingBag: ShoppingBag,
  code: Code2,
  store: Store,
  cpu: Cpu,
  network: Network,
};

const accents: Record<Business["accent"], string> = {
  cyan: "from-cyan-300/[0.26] via-cyan-300/[0.08] to-white/[0.045]",
  violet: "from-violet-300/[0.24] via-indigo-300/[0.08] to-white/[0.045]",
  gold: "from-amber-200/[0.24] via-yellow-200/[0.06] to-white/[0.04]",
  blue: "from-sky-300/[0.24] via-blue-300/[0.08] to-white/[0.045]",
  silver: "from-slate-100/[0.22] via-cyan-100/[0.06] to-white/[0.045]",
};

type BusinessCardsProps = {
  intro: SiteContent["businessesIntro"];
  businesses: SiteContent["businesses"];
};

export function BusinessCards({ intro, businesses }: BusinessCardsProps) {
  return (
    <section id="business" className="safe-x py-9">
      <div className="mb-5">
        <p className="text-xs font-medium uppercase tracking-[0.18em] text-cyan-100/[0.5]">
          Business
        </p>
        <h2 className="mt-2 text-2xl font-semibold tracking-normal text-white">
          {intro.title}
        </h2>
        <p className="mt-3 text-[14px] leading-6 text-white/55">
          {intro.subtitle}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {businesses.map((business) => {
          const Icon = icons[business.icon];
          const isFeatured = "featured" in business && business.featured;

          return (
            <article
              key={business.title}
              className={`relative overflow-hidden rounded-[1.35rem] border border-white/10 bg-gradient-to-br ${accents[business.accent]} p-4 shadow-[0_24px_60px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.13)] backdrop-blur-xl transition-transform active:scale-[0.975] ${isFeatured ? "col-span-2 min-h-[158px]" : "min-h-[204px]"}`}
            >
              <div className="absolute right-[-22px] top-[-24px] size-24 rounded-full bg-white/[0.07] blur-2xl" />
              <div className={isFeatured ? "flex gap-4" : ""}>
                <span className="mb-4 grid size-11 shrink-0 place-items-center rounded-2xl border border-white/[0.14] bg-black/[0.18] text-cyan-50 shadow-[inset_0_1px_0_rgba(255,255,255,0.14)]">
                  <Icon size={20} strokeWidth={1.8} />
                </span>
                <div className="min-w-0">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.13em] text-cyan-100/48">
                    {business.english}
                  </p>
                  <h3 className="mt-2 text-[16px] font-semibold leading-5 text-white">
                    {business.title}
                  </h3>
                  <p className="mt-3 text-[12.5px] leading-[1.65] text-white/[0.58]">
                    {business.description}
                  </p>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
