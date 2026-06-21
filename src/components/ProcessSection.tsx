import type { SiteContent } from "@/data/siteContent";

type ProcessSectionProps = {
  intro: SiteContent["processIntro"];
  steps: SiteContent["process"];
};

export function ProcessSection({ intro, steps }: ProcessSectionProps) {
  return (
    <section className="safe-x py-8">
      <div className="mb-5">
        <p className="text-xs font-medium uppercase tracking-[0.18em] text-cyan-100/[0.48]">
          Process
        </p>
        <h2 className="mt-2 text-2xl font-semibold tracking-normal text-white">
          {intro.title}
        </h2>
      </div>

      <div className="relative space-y-3">
        <div className="absolute bottom-6 left-[23px] top-4 w-px bg-gradient-to-b from-cyan-200/70 via-violet-200/30 to-transparent" />
        {steps.map((step) => (
          <article
            key={step.number}
            className="relative flex gap-4 rounded-[1.25rem] border border-white/[0.08] bg-black/[0.16] p-4 backdrop-blur-md"
          >
            <span className="relative z-10 mt-1 grid size-12 shrink-0 place-items-center rounded-full border border-cyan-100/25 bg-[#071524] text-xs font-semibold text-cyan-50 shadow-[0_0_28px_rgba(34,211,238,0.18),inset_0_1px_0_rgba(255,255,255,0.12)]">
              {step.number}
            </span>
            <div className="min-w-0">
              <h3 className="text-[16px] font-semibold leading-6 text-white">
                {step.title}
              </h3>
              <p className="mt-1.5 text-[13.5px] leading-6 text-white/[0.58]">
                {step.description}
              </p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
