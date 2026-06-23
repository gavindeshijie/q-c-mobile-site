"use client";

import { useEffect, useState } from "react";

import { BrotherSiteCard } from "@/components/BrotherSiteCard";
import type { BrotherSite } from "@/data/brotherSites";

type BrotherSitesPageProps = {
  sites: BrotherSite[];
};

export function BrotherSitesPage({ sites }: BrotherSitesPageProps) {
  const [notice, setNotice] = useState("");

  useEffect(() => {
    if (!notice) {
      return;
    }

    const timer = window.setTimeout(() => setNotice(""), 2400);
    return () => window.clearTimeout(timer);
  }, [notice]);

  return (
    <section className="brother-sites-page">
      <div className="brother-sites-bg" aria-hidden="true">
        <span className="brother-sites-orb brother-sites-orb-one" />
        <span className="brother-sites-orb brother-sites-orb-two" />
        <span className="brother-sites-grid" />
        <span className="brother-sites-scan" />
      </div>

      {notice ? (
        <div className="brother-sites-page-toast" role="status">
          {notice}
        </div>
      ) : null}

      <div className="brother-sites-content">
        <header className="brother-sites-hero">
          <p className="brother-sites-description">
            这里集中展示独立部署的网站，每个入口对应一个独立网站。
          </p>
        </header>

        <div className="brother-sites-list">
          {sites.map((site) => (
            <BrotherSiteCard
              key={site.id}
              site={site}
              onUnavailable={(message) => setNotice(message)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
