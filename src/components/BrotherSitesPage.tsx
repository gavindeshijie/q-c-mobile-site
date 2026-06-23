"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Network, Radar } from "lucide-react";

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
        <Link href="/" className="brother-sites-back">
          <ArrowLeft size={16} strokeWidth={2.2} />
          返回 q-c.hk 首页
        </Link>

        <header className="brother-sites-hero">
          <p className="brother-sites-kicker">
            <Radar size={14} strokeWidth={2} />
            Brother Sites Hub
          </p>
          <h1>兄弟网站</h1>
          <p className="brother-sites-subtitle">独立项目入口中心</p>
          <p className="brother-sites-description">
            这里集中展示未来将独立部署的项目入口。每个入口对应一个独立网站，后续可绑定不同域名、独立部署和独立管理。
          </p>

          <div className="brother-sites-summary">
            <span>
              <Network size={15} strokeWidth={2} />
              10 个预留入口
            </span>
            <span>外部网站独立部署</span>
          </div>
        </header>

        <div className="brother-sites-list">
          {sites.map((site) => (
            <BrotherSiteCard
              key={site.id}
              site={site}
              onUnavailable={() => setNotice("该兄弟网站暂未开放。")}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
