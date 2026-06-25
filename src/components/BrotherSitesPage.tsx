"use client";

import { ChevronDown, Search } from "lucide-react";
import { useMemo, useState } from "react";

import { BrotherSiteCard } from "@/components/BrotherSiteCard";
import type { BrotherSite } from "@/data/brotherSites";

type BrotherSitesPageProps = {
  sites: BrotherSite[];
};

const directoryCategories = [
  "全部",
  "音乐",
  "体育",
  "社区",
];

export function BrotherSitesPage({ sites }: BrotherSitesPageProps) {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("全部");
  const [categoryOpen, setCategoryOpen] = useState(false);
  const availableSites = useMemo(
    () => sites.filter((site) => site.enabled && site.url),
    [sites],
  );

  const categories = useMemo(() => {
    const knownCategories = new Set(directoryCategories);
    const extraCategories = availableSites
      .map((site) => site.category)
      .filter((category) => category && !knownCategories.has(category));

    return [...directoryCategories, ...Array.from(new Set(extraCategories))];
  }, [availableSites]);

  const filteredSites = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return availableSites.filter((site) => {
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
  }, [activeCategory, availableSites, query]);

  return (
    <section className="brother-sites-page">
      <div className="brother-sites-bg" aria-hidden="true">
        <span className="brother-sites-orb brother-sites-orb-one" />
        <span className="brother-sites-orb brother-sites-orb-two" />
        <span className="brother-sites-grid" />
        <span className="brother-sites-scan" />
      </div>

      <div className="brother-sites-content">
        <header className="brother-sites-hero">
          <div className="brother-sites-directory">
            <div className="brother-sites-search">
              <Search size={15} strokeWidth={2.2} />
              <input
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="搜索网站、分类或域名"
                aria-label="搜索网站、分类或域名"
              />
              <button
                type="button"
                className="brother-sites-search-action"
                onClick={() => setQuery((value) => value.trim())}
              >
                搜索
              </button>
            </div>

            <div className="brother-sites-category-select">
              <button
                type="button"
                className="brother-sites-category-trigger"
                aria-expanded={categoryOpen}
                onClick={() => setCategoryOpen((isOpen) => !isOpen)}
              >
                <span>{activeCategory}</span>
                <ChevronDown size={15} strokeWidth={2.4} />
              </button>

              {categoryOpen ? (
                <div className="brother-sites-category-menu" aria-label="网站分类筛选">
                  {categories.map((category) => (
                    <button
                      key={category}
                      type="button"
                      className={category === activeCategory ? "is-active" : ""}
                      onClick={() => {
                        setActiveCategory(category);
                        setCategoryOpen(false);
                      }}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              ) : null}
            </div>
          </div>
        </header>

        <div className="brother-sites-list">
          {filteredSites.map((site) => (
            <BrotherSiteCard
              key={site.id}
              site={site}
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
