"use client";

import Link from "next/link";
import { Menu } from "lucide-react";

import type { SiteContent } from "@/data/siteContent";

type HeaderProps = {
  site: Pick<SiteContent, "logoText" | "name" | "tagline" | "menuLabel" | "entryLinks">;
};

export function Header({ site }: HeaderProps) {
  return (
    <header className="site-header pointer-events-none absolute inset-x-0 top-0 z-[80]">
      <div className="relative z-10 flex items-start justify-between">
        <Link
          href={site.entryLinks.brand}
          className="header-brand group pointer-events-auto flex min-h-12 min-w-0 items-center gap-3 outline-none transition-transform active:scale-[0.98]"
          aria-label={site.name}
        >
          <span className="header-logo-mark grid size-11 shrink-0 place-items-center text-[13px] font-semibold text-cyan-50">
            {site.logoText}
          </span>
          <span className="min-w-0">
            <span className="block truncate text-[15px] font-semibold leading-5 text-white drop-shadow-[0_0_10px_rgba(103,232,249,0.2)]">
              {site.name}
            </span>
            <span className="block truncate text-xs leading-5 text-cyan-100/62">
              {site.tagline}
            </span>
          </span>
        </Link>

        <Link
          href={site.entryLinks.menu}
          aria-label={site.menuLabel}
          className="header-menu-button pointer-events-auto grid size-12 place-items-center text-cyan-50 outline-none transition duration-200 active:scale-95"
        >
          <Menu size={21} strokeWidth={1.9} />
        </Link>
      </div>
    </header>
  );
}
