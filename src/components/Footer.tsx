import type { SiteContent } from "@/data/siteContent";

type FooterProps = {
  footer: SiteContent["footer"];
  domain: SiteContent["domain"];
};

export function Footer({ footer, domain }: FooterProps) {
  return (
    <footer className="safe-x safe-bottom mt-6 border-t border-white/[0.08] pt-6">
      <div className="rounded-[1.5rem] border border-white/[0.09] bg-white/[0.045] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] backdrop-blur-xl">
        <p className="text-base font-semibold text-white">{footer.title}</p>
        <p className="mt-2 text-sm leading-6 text-white/50">
          {footer.subtitle}
        </p>
        <div className="mt-5 space-y-2 text-sm leading-6 text-white/[0.46]">
          <p>{domain}</p>
          <p>{footer.scope}</p>
          <p>{footer.copyright}</p>
        </div>
      </div>
    </footer>
  );
}
