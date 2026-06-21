import {
  ArrowDownRight,
  Code2,
  Network,
  ShoppingBag,
  Store,
  type LucideIcon,
} from "lucide-react";

import type { SiteContent } from "@/data/siteContent";

type BusinessDetail = SiteContent["businessDetails"][number];

const icons: Record<BusinessDetail["icon"], LucideIcon> = {
  code: Code2,
  shoppingBag: ShoppingBag,
  network: Network,
  store: Store,
};

const accents: Record<BusinessDetail["accent"], string> = {
  cyan: "business-detail-accent-cyan",
  violet: "business-detail-accent-violet",
  gold: "business-detail-accent-pink",
  silver: "business-detail-accent-blue",
};

type BusinessDetailSectionsProps = {
  details: SiteContent["businessDetails"];
};

export function BusinessDetailSections({
  details,
}: BusinessDetailSectionsProps) {
  return (
    <section className="business-detail-flow relative isolate overflow-hidden">
      <div aria-hidden="true" className="business-detail-bg absolute inset-0 -z-10">
        <div className="business-detail-aurora absolute inset-x-[-28%] top-[-7rem] h-[34rem]" />
        <div className="business-detail-grid absolute inset-0" />
        <div className="business-detail-orb business-detail-orb-one absolute rounded-full" />
        <div className="business-detail-orb business-detail-orb-two absolute rounded-full" />
      </div>

      {details.map((detail, index) => {
        const Icon = icons[detail.icon];

        return (
          <article
            key={detail.id}
            id={detail.id}
            className="business-detail-page safe-x relative isolate flex min-h-[88svh] scroll-mt-[88px] items-center py-14"
          >
            <div
              aria-hidden="true"
              className="business-detail-page-light absolute inset-x-[-16%] top-[12%] -z-10 h-[70%]"
            />
            <div className={`business-detail-shell ${accents[detail.accent]}`}>
              <div className="business-detail-index">
                {(index + 1).toString().padStart(2, "0")}
              </div>
              <div className="mb-6 flex items-center justify-between gap-4">
                <span className="business-detail-icon grid place-items-center">
                  <Icon size={24} strokeWidth={1.8} />
                </span>
                <span className="business-detail-signal inline-flex items-center gap-1.5">
                  <span />
                  LIVE NODE
                </span>
              </div>

              <p lang="th" className="business-detail-thai">
                {detail.thai}
              </p>
              <p className="business-detail-english">{detail.english}</p>
              <h2 className="business-detail-title">{detail.title}</h2>
              <p className="business-detail-summary">{detail.summary}</p>

              <div className="business-detail-points">
                {detail.points.map((point) => (
                  <div key={point} className="business-detail-point">
                    <ArrowDownRight size={15} strokeWidth={2} />
                    <span>{point}</span>
                  </div>
                ))}
              </div>
            </div>
          </article>
        );
      })}
    </section>
  );
}
