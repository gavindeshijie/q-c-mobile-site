import { Menu } from "lucide-react";

import type { SiteContent } from "@/data/siteContent";

type HeaderProps = {
  site: Pick<SiteContent, "logoText" | "name" | "tagline" | "menuLabel">;
};

export function Header({ site }: HeaderProps) {
  return (
    <header className="safe-x sticky top-0 z-30 border-b border-white/[0.08] bg-[#05070d]/[0.76] pt-[max(10px,env(safe-area-inset-top))] backdrop-blur-2xl">
      <div className="flex h-16 items-center justify-between">
        <a
          href="#top"
          className="group flex min-h-12 min-w-0 items-center gap-3 rounded-full pr-2 outline-none transition-transform active:scale-[0.98]"
          aria-label={site.name}
        >
          <span className="grid size-11 shrink-0 place-items-center rounded-2xl border border-cyan-200/20 bg-[linear-gradient(145deg,rgba(255,255,255,0.18),rgba(255,255,255,0.04))] text-[13px] font-semibold text-cyan-50 shadow-[0_18px_50px_rgba(0,225,255,0.18),inset_0_1px_0_rgba(255,255,255,0.35)]">
            {site.logoText}
          </span>
          <span className="min-w-0">
            <span className="block truncate text-[15px] font-semibold leading-5 text-white">
              {site.name}
            </span>
            <span className="block truncate text-xs leading-5 text-white/50">
              {site.tagline}
            </span>
          </span>
        </a>

        <button
          type="button"
          aria-label={site.menuLabel}
          className="grid size-12 place-items-center rounded-2xl border border-white/10 bg-white/[0.06] text-white/85 shadow-[0_12px_38px_rgba(0,0,0,0.35),inset_0_1px_0_rgba(255,255,255,0.12)] outline-none transition duration-200 active:scale-95"
        >
          <Menu size={20} strokeWidth={1.8} />
        </button>
      </div>
    </header>
  );
}
