import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";

import { siteContent } from "@/data/siteContent";

type PageProps = {
  params: Promise<{
    slug: string;
  }>;
};

const pages = siteContent.placeholderPages;

function getPlaceholderPage(slug: string) {
  return pages.find((page) => page.slug === slug);
}

export function generateStaticParams() {
  return pages.map((page) => ({
    slug: page.slug,
  }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const page = getPlaceholderPage(slug);

  if (!page) {
    return {
      title: siteContent.name,
    };
  }

  return {
    title: `${page.title} | ${siteContent.name}`,
    description: page.description,
  };
}

export default async function PlaceholderPage({ params }: PageProps) {
  const { slug } = await params;
  const page = getPlaceholderPage(slug);

  if (!page) {
    notFound();
  }

  const menuLinks = siteContent.placeholderPages.filter(
    (item) => item.slug !== page.slug,
  );

  return (
    <div className="relative min-h-svh overflow-x-hidden bg-[#02040a] text-white md:flex md:justify-center md:px-8">
      <main className="mobile-frame relative mx-auto min-h-svh w-full max-w-[430px] overflow-hidden bg-[#05070d] px-5 pb-[calc(32px+env(safe-area-inset-bottom))] pt-[calc(22px+env(safe-area-inset-top))] shadow-[0_0_0_1px_rgba(255,255,255,0.08),0_36px_120px_rgba(0,0,0,0.55)]">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-[-22%] top-[-10%] h-72 w-72 rounded-full bg-cyan-400/12 blur-3xl" />
          <div className="absolute right-[-28%] top-[18%] h-80 w-80 rounded-full bg-fuchsia-500/14 blur-3xl" />
          <div className="absolute inset-x-0 bottom-0 h-1/2 bg-[linear-gradient(to_top,rgba(2,6,23,0.82),transparent)]" />
        </div>

        <div className="relative z-10">
          <Link
            href="/"
            className="inline-flex min-h-11 items-center gap-2 rounded-2xl border border-cyan-200/22 bg-white/[0.06] px-3.5 text-sm font-semibold text-cyan-50 backdrop-blur-md transition active:scale-[0.98]"
          >
            <ArrowLeft size={16} strokeWidth={2} />
            返回首页
          </Link>

          <section className="pt-16">
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-cyan-200/72">
              {page.label}
            </p>
            <h1 className="mt-4 text-3xl font-black leading-tight tracking-tight text-white">
              {page.title}
            </h1>
            <p className="mt-4 max-w-[20rem] text-sm leading-6 text-slate-200/72">
              {page.description}
            </p>
          </section>

          <section className="mt-10 rounded-[24px] border border-cyan-200/18 bg-white/[0.055] p-4 shadow-[0_18px_60px_rgba(0,0,0,0.32),inset_0_1px_0_rgba(255,255,255,0.12)] backdrop-blur-md">
            <div className="rounded-[18px] border border-white/10 bg-slate-950/36 p-4">
              <p className="text-sm font-semibold text-white">页面框架已创建</p>
              <p className="mt-2 text-xs leading-5 text-slate-300/72">
                这里先作为内容入口，后续可以继续添加图片、介绍模块、服务说明、案例、按钮或表单。
              </p>
            </div>
          </section>

          {page.slug === "menu" ? (
            <section className="mt-5 space-y-2">
              {menuLinks.map((item) => (
                <Link
                  key={item.slug}
                  href={`/${item.slug}`}
                  className="flex min-h-12 items-center justify-between rounded-2xl border border-white/10 bg-white/[0.055] px-4 text-sm font-semibold text-white/88 transition active:scale-[0.98]"
                >
                  <span>{item.title}</span>
                  <ArrowRight size={16} strokeWidth={2} />
                </Link>
              ))}
            </section>
          ) : null}
        </div>
      </main>
    </div>
  );
}
