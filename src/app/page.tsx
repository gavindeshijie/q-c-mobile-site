import { BusinessCards } from "@/components/BusinessCards";
import { CapabilitySection } from "@/components/CapabilitySection";
import { CTASection } from "@/components/CTASection";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { Hero3D } from "@/components/Hero3D";
import { ProcessSection } from "@/components/ProcessSection";
import { ScrollToTopOnLoad } from "@/components/ScrollToTopOnLoad";
import { siteContent } from "@/data/siteContent";

export default function Home() {
  return (
    <div className="relative min-h-svh overflow-x-hidden bg-[#02040a] text-white md:flex md:justify-center md:px-8">
      <div className="pointer-events-none fixed left-1/2 top-5 z-40 hidden -translate-x-1/2 rounded-full border border-white/10 bg-white/[0.06] px-4 py-2 text-xs text-white/55 backdrop-blur-xl md:block">
        {siteContent.desktopNotice}
      </div>

      <Header site={siteContent} />

      <main className="page-enter mobile-frame relative mx-auto min-h-svh w-full max-w-[430px] overflow-hidden bg-[#05070d] shadow-[0_0_0_1px_rgba(255,255,255,0.08),0_36px_120px_rgba(0,0,0,0.55)]">
        <ScrollToTopOnLoad />
        <Hero3D hero={siteContent.hero} />
        <BusinessCards
          intro={siteContent.businessesIntro}
          businesses={siteContent.businesses}
        />
        <CapabilitySection
          intro={siteContent.capabilitiesIntro}
          capabilities={siteContent.capabilities}
        />
        <ProcessSection
          intro={siteContent.processIntro}
          steps={siteContent.process}
        />
        <CTASection cta={siteContent.cta} />
        <Footer footer={siteContent.footer} domain={siteContent.domain} />
      </main>
    </div>
  );
}
