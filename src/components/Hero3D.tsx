"use client";

import { ArrowRight, ChevronDown, CircleDot } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import Image from "next/image";

import type { SiteContent } from "@/data/siteContent";

type Hero3DProps = {
  hero: SiteContent["hero"];
};

const nodePositions = [
  "left-[4px] top-[3%] w-[170px]",
  "left-[24px] top-[21%] w-[164px]",
  "left-[2px] top-[39%] w-[176px]",
  "left-[36px] top-[57%] w-[158px]",
  "left-[10px] top-[74%] w-[184px]",
] as const;

const nodeTilts = ["-1.4deg", "1.1deg", "-1.8deg", "1.5deg", "-1deg"] as const;

const nodeDrift = [-3, 2, -2, 3, -3] as const;

const nodeNumbers = ["01", "02", "03", "04", "05"] as const;

const particlePositions = [
  "left-[8%] top-[17%]",
  "left-[72%] top-[13%]",
  "left-[91%] top-[42%]",
  "left-[55%] top-[78%]",
  "left-[16%] top-[88%]",
] as const;

export function Hero3D({ hero }: Hero3DProps) {
  const reduceMotion = useReducedMotion();

  return (
    <section
      id="top"
      className="safe-x relative isolate flex min-h-[calc(100svh-73px)] flex-col justify-between overflow-hidden pb-8 pt-4"
    >
      <div className="hero-aurora absolute inset-x-[-28%] top-[-15%] -z-10 h-[34rem]" />
      <div className="hero-space-field absolute inset-x-[-8%] top-4 -z-10 h-[68%]" />
      <div className="ambient-grid absolute inset-x-0 top-8 -z-10 h-[62%] opacity-30" />
      <div className="hero-perspective-haze absolute inset-x-[-12%] top-0 -z-10 h-[24rem]" />
      <div className="absolute right-5 top-24 -z-10 text-[4.8rem] font-semibold leading-none text-white/[0.025]">
        BKK
      </div>

      <div
        className="hero-cyber-stage relative mx-auto h-[min(112vw,448px)] w-full max-w-[390px] overflow-hidden [perspective:1100px]"
      >
        <div className="hero-cyber-depth absolute inset-0" />
        <div className="hero-cyber-grid absolute inset-x-[-12%] bottom-0 h-[62%]" />
        <div className="hero-neon-triangle hero-neon-triangle-main absolute right-[-10%] top-[7%]" />
        <div className="hero-neon-triangle hero-neon-triangle-small hero-triangle-chip-one absolute right-[17%] top-[20%]" />
        <div className="hero-neon-triangle hero-neon-triangle-small hero-triangle-chip-two absolute right-[1%] top-[64%]" />

        <motion.div
          className="hero-character-wrap absolute bottom-[-4%] right-[-18%] z-30 h-[98%] w-[86%]"
          animate={reduceMotion ? undefined : { y: [0, -4, 0] }}
          transition={{ duration: 8.5, repeat: Infinity, ease: "easeInOut" }}
        >
          <div className="hero-character-fallback absolute inset-[10%] rounded-full" />
          <Image
            src="/images/hero-character.png"
            alt=""
            fill
            priority
            sizes="(max-width: 430px) 82vw, 360px"
            className="hero-character-image relative z-10 object-contain object-right-bottom"
          />
        </motion.div>

        <div className="hero-character-hud absolute right-[7%] top-[27%] z-40 h-[32%] w-[44%]" />
        <div className="hero-scanline absolute inset-x-0 top-[28%] z-40 h-px" />

        {particlePositions.map((position, index) => (
          <span
            key={position}
            className={`hero-cyber-particle absolute z-20 rounded-full ${
              index % 2 === 0 ? "h-1.5 w-1.5" : "h-1 w-1"
            } ${position}`}
          />
        ))}

        <svg
          aria-hidden="true"
          viewBox="0 0 390 448"
          className="absolute inset-0 z-40 h-full w-full overflow-visible"
          preserveAspectRatio="none"
        >
          <path className="hero-hud-link" d="M172 58 C228 54 260 82 310 124" />
          <path className="hero-hud-link hero-hud-link-soft" d="M188 214 C232 206 268 226 336 288" />
          <path className="hero-hud-link hero-hud-link-soft" d="M160 346 C222 332 262 348 340 382" />
        </svg>

        <div className="absolute inset-y-[2%] left-0 z-50 w-[56%]">
          {hero.nodes.map((node, index) => (
            <motion.div
              key={node.title}
              className={`absolute ${nodePositions[index]}`}
              whileTap={{ scale: 0.97 }}
              animate={reduceMotion ? undefined : { y: [0, nodeDrift[index], 0] }}
              transition={{
                duration: 7 + index * 0.35,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <div
                className="hero-hud-node relative min-h-[58px] px-2.5 py-2"
                style={{ transform: `rotate(${nodeTilts[index]})` }}
              >
                <span className="hero-hud-index">{nodeNumbers[index]}</span>
                <span className="hero-node-title">{node.title}</span>
                <span lang="th" className="hero-node-thai">
                  {node.thai}
                </span>
                <span className="hero-node-en">{node.subtitle}</span>
              </div>
            </motion.div>
          ))}
        </div>
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
