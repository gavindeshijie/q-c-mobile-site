import { ArrowUpRight, Globe2, Headphones, LockKeyhole, Trophy } from "lucide-react";

import type { BrotherSite } from "@/data/brotherSites";

type BrotherSiteCardProps = {
  site: BrotherSite;
  onUnavailable: (message: string) => void;
};

export function BrotherSiteCard({ site, onUnavailable }: BrotherSiteCardProps) {
  const isAvailable = site.enabled && Boolean(site.url);
  const domainText = site.domain || "暂未设置";
  const unavailableMessage = site.unavailableMessage ?? "该兄弟网站暂未开放。";
  const accentClass =
    site.accent === "music"
      ? "is-music-site"
      : site.accent === "football"
        ? "is-football-site"
        : "";
  const iconOnlyIndex = site.accent === "music" || site.accent === "football";

  return (
    <article className={`brother-site-card ${accentClass}`}>
      {isAvailable ? (
        <a
          href={site.url}
          target="_blank"
          rel="noopener noreferrer"
          className="brother-site-card-link"
          aria-label={`打开${site.title}：${site.domain}`}
        />
      ) : null}

      <div className="brother-site-card-grid">
        <div
          className={`brother-site-index ${iconOnlyIndex ? "is-icon-card" : ""}`}
          aria-hidden="true"
        >
          {iconOnlyIndex ? null : <span>{site.index}</span>}
          {site.accent === "music" ? (
            <Headphones size={27} strokeWidth={2.15} />
          ) : null}
          {site.accent === "football" ? (
            <Trophy size={27} strokeWidth={2.15} />
          ) : null}
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
          <span className="brother-site-action-stack">
            {site.footerNote ? (
              <span className="brother-site-note">{site.footerNote}</span>
            ) : null}
            <span className="brother-site-button is-live">
              {site.actionLabel ?? "进入网站"}
              <ArrowUpRight size={15} strokeWidth={2.2} />
            </span>
          </span>
        ) : (
          <button
            type="button"
            className="brother-site-button"
            onClick={() => onUnavailable(unavailableMessage)}
          >
            {site.actionLabel ?? "即将开放"}
            <LockKeyhole size={14} strokeWidth={2.2} />
          </button>
        )}
      </div>
    </article>
  );
}
