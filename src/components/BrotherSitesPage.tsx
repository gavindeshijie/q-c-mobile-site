"use client";

import { Search } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { BrotherSiteCard } from "@/components/BrotherSiteCard";
import type { BrotherSite } from "@/data/brotherSites";

type BrotherSitesPageProps = {
  sites: BrotherSite[];
};

export function BrotherSitesPage({ sites }: BrotherSitesPageProps) {
  const [notice, setNotice] = useState("");
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("全部");

  const categories = useMemo(() => {
    const uniqueCategories = Array.from(
      new Set(sites.map((site) => site.category).filter(Boolean)),
    );

    return ["全部", ...uniqueCategories];
  }, [sites]);

  const filteredSites = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return sites.filter((site) => {
      const categoryMatched =
        activeCategory === "全部" || site.category === activeCategory;
      const searchText = [
        site.title,
        site.description,
        site.domain,
        site.status,
        site.category,
        ...(site.keywords ?? []),
      ]
        .join(" ")
        .toLowerCase();

      return categoryMatched && (!normalizedQuery || searchText.includes(normalizedQuery));
    });
  }, [activeCategory, query, sites]);

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
          <div className="brother-sites-directory">
            <label className="brother-sites-search">
              <Search size={15} strokeWidth={2.2} />
              <input
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="搜索网站、分类或域名"
                aria-label="搜索网站、分类或域名"
              />
            </label>

            <div className="brother-sites-categories" aria-label="网站分类筛选">
              {categories.map((category) => (
                <button
                  key={category}
                  type="button"
                  className={category === activeCategory ? "is-active" : ""}
                  onClick={() => setActiveCategory(category)}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </header>

        <div className="brother-sites-list">
          {filteredSites.map((site) => (
            <BrotherSiteCard
              key={site.id}
              site={site}
              onUnavailable={(message) => setNotice(message)}
            />
          ))}
        </div>

        {filteredSites.length === 0 ? (
          <p className="brother-sites-empty">没有找到匹配的网站入口。</p>
        ) : null}
      </div>
    </section>
  );
}
