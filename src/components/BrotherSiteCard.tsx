import { ArrowUpRight, Globe2, Headphones, Trophy, UsersRound } from "lucide-react";

import type { BrotherSite } from "@/data/brotherSites";

type BrotherSiteCardProps = {
  site: BrotherSite;
};

export function BrotherSiteCard({ site }: BrotherSiteCardProps) {
  const isAvailable = site.enabled && Boolean(site.url);
  const domainText = site.domain;
  const accentClass =
    site.accent === "music"
      ? "is-music-site"
      : site.accent === "football"
        ? "is-football-site"
        : site.accent === "community"
          ? "is-community-site"
          : "";
  const iconOnlyIndex =
    site.accent === "music" || site.accent === "football" || site.accent === "community";

  if (!isAvailable) {
    return null;
  }

  return (
    <article className={`brother-site-card ${accentClass}`}>
      <a
        href={site.url}
        target="_blank"
        rel="noopener noreferrer"
        className="brother-site-card-link"
        aria-label={`打开${site.title}：${site.domain}`}
      />

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
          {site.accent === "community" ? (
            <UsersRound size={27} strokeWidth={2.15} />
          ) : null}
        </div>

        <div className="brother-site-copy">
          <div className="brother-site-meta">
            <span className={isAvailable ? "is-live" : ""}>{site.status}</span>
            <span className="brother-site-domain">
              <Globe2 size={12} strokeWidth={2} />
              {domainText}
            </span>
          </div>
          <h2>{site.title}</h2>
          <p>{site.description}</p>
        </div>
      </div>

      <div className="brother-site-actions">
        <span className="brother-site-action-stack">
          {site.footerNote ? (
            <span className="brother-site-note">{site.footerNote}</span>
          ) : null}
          <span className="brother-site-button is-live">
            {site.actionLabel ?? "进入网站"}
            <ArrowUpRight size={15} strokeWidth={2.2} />
          </span>
        </span>
      </div>
    </article>
  );
}
