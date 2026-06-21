"use client";

import {
  Code2,
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
  network: Network,
};

const accents: Record<Business["accent"], string> = {
  cyan: "business-accent-cyan",
  violet: "business-accent-violet",
  gold: "business-accent-pink",
  silver: "business-accent-blue",
};

type BusinessCardsProps = {
  intro: SiteContent["businessesIntro"];
  businesses: SiteContent["businesses"];
};

export function BusinessCards({ intro, businesses }: BusinessCardsProps) {
  return (
    <section
      id="business"
      className="business-tech-section safe-x relative isolate scroll-mt-6 overflow-hidden py-10"
    >
      <div aria-hidden="true" className="business-tech-bg absolute inset-0 -z-10">
        <div className="business-tech-aurora absolute inset-x-[-30%] top-[-18%] h-[32rem]" />
        <div className="business-tech-grid absolute inset-x-[-8%] top-0 h-full" />
        <div className="business-tech-chip absolute right-[-14px] top-[18%]" />
        <svg
          viewBox="0 0 390 720"
          preserveAspectRatio="none"
          className="business-circuit-lines absolute inset-0 h-full w-full"
        >
          <path d="M22 92 H116 C139 92 139 128 162 128 H250" />
          <path d="M318 82 V154 H286 C266 154 266 196 246 196 H170" />
          <path d="M36 314 H104 L132 342 H212 C235 342 235 384 258 384 H344" />
          <path d="M18 538 H88 C112 538 112 492 136 492 H228 L266 454 H364" />
          <path d="M306 252 H344 V612 H268" />
          <circle cx="116" cy="92" r="3" />
          <circle cx="250" cy="128" r="3" />
          <circle cx="170" cy="196" r="3" />
          <circle cx="212" cy="342" r="3" />
          <circle cx="268" cy="612" r="3" />
        </svg>
        <span className="business-data-dot business-data-dot-one absolute rounded-full" />
        <span className="business-data-dot business-data-dot-two absolute rounded-full" />
        <span className="business-data-dot business-data-dot-three absolute rounded-full" />
      </div>

      <div className="business-section-head relative mb-5">
        <div className="mb-2 flex items-center gap-2">
          <span className="size-1.5 rounded-full bg-cyan-200 shadow-[0_0_14px_rgba(103,232,249,0.9)]" />
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-cyan-100/62">
            Business
          </p>
        </div>
        <h2 className="text-2xl font-semibold tracking-normal text-white">
          {intro.title}
        </h2>
        <p className="mt-3 text-[14px] leading-6 text-white/58">
          {intro.subtitle}
        </p>
        <span className="business-title-scan mt-4 block h-px w-28" />
      </div>

      <div className="grid grid-cols-2 gap-3">
        {businesses.map((business, index) => {
          const Icon = icons[business.icon];
          const isFeatured = "featured" in business && business.featured;

          return (
            <article
              key={business.title}
              className={`business-service-card ${accents[business.accent]} ${
                isFeatured ? "col-span-2 min-h-[164px]" : "min-h-[218px]"
              }`}
            >
              <div className="business-card-glow absolute right-[-28px] top-[-30px] size-28 rounded-full" />
              <div className="business-card-corner absolute right-3 top-3">
                {(index + 1).toString().padStart(2, "0")}
              </div>

              <div className={isFeatured ? "relative z-10 flex gap-4" : "relative z-10"}>
                <span className="business-icon mb-4 grid size-11 shrink-0 place-items-center">
                  <Icon size={20} strokeWidth={1.8} />
                </span>
                <div className="min-w-0">
                  <p className="text-[9.5px] font-semibold uppercase tracking-[0.15em] text-cyan-100/58">
                    {business.english}
                  </p>
                  <h3 className="mt-2 text-[16px] font-semibold leading-5 text-white">
                    {business.title}
                  </h3>
                  <p className="mt-3 text-[12.5px] leading-[1.65] text-white/[0.62]">
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
