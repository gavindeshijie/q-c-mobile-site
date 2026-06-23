import type { Metadata } from "next";

import { BrotherSitesPage } from "@/components/BrotherSitesPage";
import { Header } from "@/components/Header";
import { ScrollToTopOnLoad } from "@/components/ScrollToTopOnLoad";
import { SupportChatWidget } from "@/components/SupportChatWidget";
import { brotherSites } from "@/data/brotherSites";
import { siteContent } from "@/data/siteContent";

export const metadata: Metadata = {
  title: "兄弟网站 | Q-C",
  description: "Q-C 兄弟网站入口中心，集中展示未来独立部署的网站入口。",
};

export default function BrotherSitesRoute() {
  return (
    <div className="relative min-h-svh overflow-x-hidden bg-[#02040a] text-white md:flex md:justify-center md:px-8">
      <div className="pointer-events-none fixed left-1/2 top-5 z-40 hidden -translate-x-1/2 rounded-full border border-white/10 bg-white/[0.06] px-4 py-2 text-xs text-white/55 backdrop-blur-xl md:block">
        {siteContent.desktopNotice}
      </div>

      <Header site={siteContent} />

      <main className="page-enter mobile-frame relative mx-auto min-h-svh w-full max-w-[430px] overflow-hidden bg-[#02040a] shadow-[0_0_0_1px_rgba(255,255,255,0.08),0_36px_120px_rgba(0,0,0,0.55)]">
        <ScrollToTopOnLoad />
        <BrotherSitesPage sites={brotherSites} />
      </main>

      <SupportChatWidget />
    </div>
  );
}
