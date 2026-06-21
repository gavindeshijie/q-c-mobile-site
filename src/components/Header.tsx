"use client";

import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";

import type { SiteContent } from "@/data/siteContent";

type HeaderProps = {
  site: Pick<SiteContent, "logoText" | "name" | "tagline" | "menuLabel">;
};

const menuItems = [
  { label: "首页", href: "#top" },
  { label: "五大业务", href: "#business" },
  { label: "网站与软件定制", href: "#business" },
  { label: "软硬件结合开发", href: "#business" },
  { label: "本地资源整合与销售", href: "#business" },
  { label: "潮流科技小商品供应", href: "#business" },
  { label: "泰国本土网店开店协助与商品供应", href: "#business" },
  { label: "合作咨询", href: "#contact" },
] as const;

export function Header({ site }: HeaderProps) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  return (
    <header className="site-header pointer-events-none absolute inset-x-0 top-0 z-[80]">
      {isOpen ? (
        <button
          type="button"
          aria-label="关闭菜单"
          className="pointer-events-auto fixed inset-0 z-0 cursor-default bg-transparent"
          onClick={() => setIsOpen(false)}
        />
      ) : null}

      <div className="relative z-10 flex items-start justify-between">
        <a
          href="#top"
          className="header-brand group pointer-events-auto flex min-h-12 min-w-0 items-center gap-3 outline-none transition-transform active:scale-[0.98]"
          aria-label={site.name}
          onClick={() => setIsOpen(false)}
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
        </a>

        <button
          type="button"
          aria-label={isOpen ? "关闭菜单" : site.menuLabel}
          aria-expanded={isOpen}
          aria-controls="site-hud-menu"
          className="header-menu-button pointer-events-auto grid size-12 place-items-center text-cyan-50 outline-none transition duration-200 active:scale-95"
          onClick={() => setIsOpen((current) => !current)}
        >
          {isOpen ? (
            <X size={20} strokeWidth={1.9} />
          ) : (
            <Menu size={21} strokeWidth={1.9} />
          )}
        </button>
      </div>

      <nav
        id="site-hud-menu"
        aria-label="主菜单"
        className={`header-menu-panel absolute right-[max(18px,env(safe-area-inset-right))] ${
          isOpen
            ? "pointer-events-auto translate-y-0 scale-100 opacity-100"
            : "pointer-events-none -translate-y-2 scale-[0.98] opacity-0"
        }`}
      >
        <div className="space-y-1.5">
          {menuItems.map((item, index) => (
            <a
              key={item.label}
              href={item.href}
              className="header-menu-item group flex min-h-11 items-center gap-3 rounded-2xl px-3.5 py-2 text-sm font-semibold text-white/86 transition active:scale-[0.98]"
              onClick={() => setIsOpen(false)}
            >
              <span className="header-menu-index">
                {(index + 1).toString().padStart(2, "0")}
              </span>
              <span className="min-w-0 flex-1 leading-snug">{item.label}</span>
            </a>
          ))}
        </div>
      </nav>
    </header>
  );
}
