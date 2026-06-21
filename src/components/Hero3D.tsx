"use client";

import Image from "next/image";
import { ArrowRight, ChevronDown, CircleDot } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";

import type { SiteContent } from "@/data/siteContent";

type Hero3DProps = {
  hero: SiteContent["hero"];
};

const nodePositions = [
  "left-[4%] top-[34%]",
  "left-[23%] top-[9%]",
  "right-[5%] top-[30%]",
  "left-[12%] bottom-[11%]",
  "right-[13%] bottom-[7%]",
] as const;

export function Hero3D({ hero }: Hero3DProps) {
  const reduceMotion = useReducedMotion();

  return (
    <section
      id="top"
      className="safe-x relative isolate flex min-h-[calc(100svh-73px)] flex-col justify-between overflow-hidden pb-8 pt-4"
    >
      <div className="absolute inset-x-[-24%] top-[-10%] -z-10 h-[30rem] bg-[radial-gradient(circle_at_50%_35%,rgba(64,224,255,0.18),rgba(104,72,255,0.15)_34%,rgba(244,190,92,0.08)_50%,transparent_70%)] blur-2xl" />
      <div className="ambient-grid absolute inset-x-0 top-8 -z-10 h-[60%] opacity-35" />
      <div className="absolute right-5 top-24 -z-10 text-[4.8rem] font-semibold leading-none text-white/[0.025]">
        BKK
      </div>

      <div
        className="relative mx-auto flex h-[min(74vw,318px)] w-[min(74vw,318px)] items-center justify-center [perspective:900px]"
      >
        <motion.div
          className="absolute inset-[8%] rounded-full bg-cyan-300/20 blur-3xl"
          animate={reduceMotion ? undefined : { opacity: [0.35, 0.66, 0.35] }}
          transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut" }}
        />

        <motion.div
          className="relative h-full w-full will-change-transform [transform-style:preserve-3d]"
          animate={
            reduceMotion
              ? undefined
              : {
                  y: [0, -11, 0],
                  rotateX: [0, 2, 0],
                  rotateY: [-4, 4, -4],
                }
          }
          transition={{ duration: 7.5, repeat: Infinity, ease: "easeInOut" }}
        >
          <div className="absolute inset-[7%] rounded-full border border-cyan-200/25 bg-cyan-200/[0.03] shadow-[0_0_72px_rgba(62,210,255,0.24),inset_0_0_48px_rgba(255,255,255,0.08)]" />
          <Image
            src={hero.image.src}
            alt={hero.image.alt}
            fill
            priority
            sizes="(max-width: 430px) 74vw, 318px"
            className="object-contain opacity-90 drop-shadow-[0_28px_70px_rgba(44,203,255,0.3)]"
            style={{
              WebkitMaskImage:
                "radial-gradient(circle at center, black 56%, rgba(0,0,0,0.84) 68%, transparent 80%)",
              maskImage:
                "radial-gradient(circle at center, black 56%, rgba(0,0,0,0.84) 68%, transparent 80%)",
            }}
          />

          <motion.div
            className="absolute left-1/2 top-[18%] h-9 w-[82%] -translate-x-1/2 rounded-full border border-cyan-100/38 bg-cyan-100/5 [transform:rotateX(72deg)_rotateZ(-12deg)_translateZ(44px)]"
            animate={reduceMotion ? undefined : { rotateZ: [-12, -4, -12] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          />
          <div className="absolute left-[15%] top-1/2 h-px w-[70%] -translate-y-1/2 rotate-[-13deg] bg-gradient-to-r from-transparent via-cyan-200/55 to-transparent" />
          <div className="absolute left-[18%] top-1/2 h-px w-[65%] -translate-y-1/2 rotate-[28deg] bg-gradient-to-r from-transparent via-violet-200/45 to-transparent" />
          <div className="absolute left-1/2 top-[16%] h-[70%] w-px -translate-x-1/2 bg-gradient-to-b from-transparent via-amber-100/34 to-transparent" />

          {hero.nodes.map((node, index) => (
            <motion.div
              key={node.label}
              className={`absolute ${nodePositions[index]} grid min-h-12 min-w-12 place-items-center rounded-2xl border border-white/[0.14] bg-[#08111f]/75 px-2.5 text-center shadow-[0_18px_48px_rgba(0,0,0,0.42),inset_0_1px_0_rgba(255,255,255,0.14)] backdrop-blur-md`}
              animate={reduceMotion ? undefined : { y: [0, index % 2 ? -5 : 5, 0] }}
              transition={{
                duration: 4.6 + index * 0.2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <span className="mb-0.5 h-1.5 w-1.5 rounded-full bg-cyan-200 shadow-[0_0_16px_rgba(103,232,249,0.9)]" />
              <span className="text-[11px] font-semibold leading-4 text-white">
                {node.label}
              </span>
              <span className="text-[8px] uppercase tracking-[0.12em] text-cyan-100/45">
                {node.shortLabel}
              </span>
            </motion.div>
          ))}
        </motion.div>
      </div>

      <div
        className="relative z-10 mx-auto flex w-full max-w-[366px] flex-col items-center text-center"
      >
        <p className="mb-3 max-w-full rounded-full border border-cyan-200/15 bg-white/[0.06] px-3.5 py-1.5 text-[11px] font-medium leading-5 text-cyan-100/85 shadow-[inset_0_1px_0_rgba(255,255,255,0.12)]">
          {hero.eyebrow}
        </p>
        <h1 className="text-balance text-[clamp(2.1rem,9.6vw,3rem)] font-semibold leading-[1.06] tracking-normal text-white">
          {hero.title}
        </h1>
        <p className="mt-4 max-w-[21rem] text-pretty text-[15px] leading-7 text-white/[0.66]">
          {hero.subtitle}
        </p>

        <div className="mt-6 grid w-full grid-cols-2 gap-3">
          <a
            href={hero.primaryAction.href}
            className="flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-cyan-100 px-4 text-sm font-semibold text-[#041018] shadow-[0_18px_42px_rgba(36,213,255,0.24)] transition active:scale-[0.97]"
          >
            {hero.primaryAction.label}
            <ArrowRight size={17} strokeWidth={2} />
          </a>
          <a
            href={hero.secondaryAction.href}
            className="flex min-h-12 items-center justify-center gap-2 rounded-2xl border border-white/[0.13] bg-white/[0.06] px-4 text-sm font-semibold text-white/[0.86] shadow-[inset_0_1px_0_rgba(255,255,255,0.12)] backdrop-blur-xl transition active:scale-[0.97]"
          >
            {hero.secondaryAction.label}
            <ChevronDown size={17} strokeWidth={2} />
          </a>
        </div>

        <div className="mt-5 flex w-full flex-wrap justify-center gap-2">
          {hero.highlights.map((item) => (
            <span
              key={item}
              className="inline-flex items-center gap-1.5 rounded-full border border-white/[0.08] bg-white/[0.045] px-3 py-1.5 text-[11px] font-medium text-white/[0.54]"
            >
              <CircleDot size={10} className="text-cyan-100/60" />
              {item}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
