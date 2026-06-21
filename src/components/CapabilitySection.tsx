"use client";

import { Lightbulb, MapPin, Package, type LucideIcon } from "lucide-react";

import type { SiteContent } from "@/data/siteContent";

type Capability = SiteContent["capabilities"][number];

const icons: Record<Capability["icon"], LucideIcon> = {
  package: Package,
  lightbulb: Lightbulb,
  mapPin: MapPin,
};

type CapabilitySectionProps = {
  intro: SiteContent["capabilitiesIntro"];
  capabilities: SiteContent["capabilities"];
};

export function CapabilitySection({
  intro,
  capabilities,
}: CapabilitySectionProps) {
  return (
    <section className="safe-x py-7">
      <div className="mb-5">
        <p className="text-xs font-medium uppercase tracking-[0.18em] text-amber-100/[0.48]">
          Capability
        </p>
        <h2 className="mt-2 text-2xl font-semibold tracking-normal text-white">
          {intro.title}
        </h2>
      </div>

      <div className="space-y-3">
        {capabilities.map((item) => {
          const Icon = icons[item.icon];

          return (
            <article
              key={item.number}
              className="relative overflow-hidden rounded-[1.35rem] border border-white/10 bg-white/[0.052] p-4 shadow-[0_22px_55px_rgba(0,0,0,0.28),inset_0_1px_0_rgba(255,255,255,0.1)] backdrop-blur-xl transition-transform active:scale-[0.985]"
            >
              <div className="absolute inset-x-5 top-0 h-px bg-gradient-to-r from-transparent via-cyan-200/45 to-transparent" />
              <div className="flex gap-4">
                <div className="flex w-14 shrink-0 flex-col items-center">
                  <span className="text-xs font-semibold tracking-[0.18em] text-cyan-100/48">
                    {item.number}
                  </span>
                  <span className="mt-3 grid size-10 place-items-center rounded-2xl border border-white/[0.12] bg-cyan-200/[0.08] text-cyan-50">
                    <Icon size={18} strokeWidth={1.8} />
                  </span>
                </div>
                <div className="min-w-0">
                  <h3 className="text-[17px] font-semibold leading-6 text-white">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-[13.5px] leading-6 text-white/[0.58]">
                    {item.description}
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
