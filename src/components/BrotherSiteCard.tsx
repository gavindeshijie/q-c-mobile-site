import { ArrowUpRight, Globe2, LockKeyhole } from "lucide-react";

import type { BrotherSite } from "@/data/brotherSites";

type BrotherSiteCardProps = {
  site: BrotherSite;
  onUnavailable: () => void;
};

export function BrotherSiteCard({ site, onUnavailable }: BrotherSiteCardProps) {
  const isAvailable = site.enabled && Boolean(site.url);
  const domainText = site.domain || "暂未设置";

  return (
    <article className="brother-site-card">
      <div className="brother-site-card-grid">
        <div className="brother-site-index" aria-hidden="true">
          {site.index}
        </div>

        <div className="brother-site-copy">
          <div className="brother-site-meta">
            <span className={isAvailable ? "is-live" : ""}>{site.status}</span>
            <span>{domainText}</span>
          </div>
          <h2>{site.title}</h2>
          <p>{site.description}</p>
        </div>
      </div>

      <div className="brother-site-actions">
        <span className="brother-site-domain">
          <Globe2 size={14} strokeWidth={2} />
          {domainText}
        </span>

        {isAvailable ? (
          <a
            href={site.url}
            target="_blank"
            rel="noopener noreferrer"
            className="brother-site-button is-live"
          >
            进入网站
            <ArrowUpRight size={15} strokeWidth={2.2} />
          </a>
        ) : (
          <button
            type="button"
            className="brother-site-button"
            onClick={onUnavailable}
          >
            即将开放
            <LockKeyhole size={14} strokeWidth={2.2} />
          </button>
        )}
      </div>
    </article>
  );
}
