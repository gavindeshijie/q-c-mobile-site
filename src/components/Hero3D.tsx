"use client";

import { ArrowRight, ChevronDown, CircleDot } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";

import type { SiteContent } from "@/data/siteContent";

type Hero3DProps = {
  hero: SiteContent["hero"];
};

const nodePositions = [
  "left-[calc(50%_-_72px)] top-[1%] w-[144px]",
  "right-[1%] top-[19%] w-[138px]",
  "left-[1%] top-[21%] w-[138px]",
  "left-[3%] bottom-[8%] w-[136px]",
  "right-[1%] bottom-[5%] w-[154px]",
] as const;

const nodeTilts = ["-3.5deg", "3deg", "-4deg", "2.6deg", "-2.4deg"] as const;

const nodePitch = ["10deg", "-7deg", "-8deg", "6deg", "8deg"] as const;

const nodeYaw = ["-7deg", "-13deg", "12deg", "10deg", "-10deg"] as const;

const nodeDepths = [18, 34, 32, 16, 22] as const;

const nodeDrift = [-4, 3, -3, 4, -4] as const;

const connectionPaths = [
  { d: "M50 52 C50 41 49 29 50 16", x: 50, y: 16 },
  { d: "M50 52 C63 40 72 34 86 35", x: 86, y: 35 },
  { d: "M50 52 C37 41 27 37 14 38", x: 14, y: 38 },
  { d: "M50 52 C37 62 28 70 21 78", x: 21, y: 78 },
  { d: "M50 52 C64 62 73 70 82 77", x: 82, y: 77 },
] as const;

const particlePositions = [
  "left-[22%] top-[23%]",
  "left-[62%] top-[17%]",
  "left-[79%] top-[52%]",
  "left-[43%] top-[80%]",
  "left-[14%] top-[59%]",
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
        className="relative mx-auto flex h-[min(96vw,374px)] w-full max-w-[390px] items-center justify-center [perspective:1120px]"
      >
        <div className="hero-void-depth absolute inset-[-18%]" />
        <div className="hero-deep-space absolute inset-[-10%]" />
        <div
          className="hero-hub-glow absolute inset-[-14%]"
        />
        <div className="hero-signal-grid absolute inset-[1%]" />
        <div className="hero-energy-ribbon hero-energy-ribbon-one absolute left-[3%] top-[23%] h-[38%] w-[94%]" />
        <div className="hero-depth-disc absolute left-1/2 top-[53%] h-[42%] w-[72%] -translate-x-1/2 rounded-full" />

        <motion.div
          className="relative h-full w-full will-change-transform [transform-style:preserve-3d]"
          animate={
            reduceMotion
              ? undefined
              : {
                  y: [0, -6, 0],
                }
          }
          transition={{ duration: 9.5, repeat: Infinity, ease: "easeInOut" }}
        >
          <div className="hero-core-backlight absolute inset-[9%] rounded-full" />

          <svg
            aria-hidden="true"
            viewBox="0 0 100 100"
            className="absolute inset-0 z-10 overflow-visible opacity-80"
          >
            <defs>
              <linearGradient id="hero-connection-line" x1="0" x2="1" y1="0" y2="1">
                <stop offset="0%" stopColor="rgba(103,232,249,0)" />
                <stop offset="48%" stopColor="rgba(103,232,249,0.86)" />
                <stop offset="100%" stopColor="rgba(167,139,250,0.32)" />
              </linearGradient>
              <filter id="hero-line-glow" x="-35%" y="-35%" width="170%" height="170%">
                <feGaussianBlur stdDeviation="0.85" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
            {connectionPaths.map((path) => (
              <g key={path.d} filter="url(#hero-line-glow)">
                <path
                  className="hero-connection-base"
                  d={path.d}
                  stroke="url(#hero-connection-line)"
                />
                <circle
                  className="hero-connection-dot"
                  cx={path.x}
                  cy={path.y}
                  r="1.15"
                />
              </g>
            ))}
          </svg>

          <div className="hero-far-orbit absolute inset-[4%] z-10 rounded-full" />
          <div className="hero-orbit hero-orbit-one absolute inset-[13%] z-20 rounded-full" />
          <div className="hero-orbit hero-orbit-two absolute inset-[18%] z-20 rounded-full" />
          <div className="hero-orbit hero-orbit-three absolute inset-[24%] z-20 rounded-full" />
          <div className="hero-pulse-ring hero-pulse-ring-one absolute left-1/2 top-1/2 z-20 h-[58%] w-[58%] -translate-x-1/2 -translate-y-1/2 rounded-full" />

          <div className="absolute left-1/2 top-1/2 z-30 h-[48%] w-[48%] -translate-x-1/2 -translate-y-1/2">
            <motion.div
              className="hero-core-stage relative h-full w-full"
              animate={
                reduceMotion
                  ? undefined
                  : {
                      y: [0, -4, 0],
                      rotateY: [-8, 8, -8],
                    }
              }
              transition={{ duration: 10.5, repeat: Infinity, ease: "easeInOut" }}
            >
              <div className="hero-core-shadow absolute inset-[13%] rounded-full" />
              <div className="hero-core-rim hero-core-rim-back absolute inset-[-16%] rounded-full" />
              <div className="hero-quantum-shell absolute inset-0 rounded-full" />
              <div className="hero-core-prism absolute left-1/2 top-1/2" />
              <div className="hero-quantum-crystal absolute left-1/2 top-1/2" />
              <div className="hero-core-rim hero-core-rim-front absolute inset-[-10%] rounded-full" />
              <div className="hero-data-stream absolute left-[14%] top-[48%] h-px w-[72%] rotate-[-14deg]" />
              <div className="hero-data-stream hero-data-stream-delay absolute left-[18%] top-[55%] h-px w-[64%] rotate-[22deg]" />
              <div className="absolute left-1/2 top-[12%] h-[76%] w-px -translate-x-1/2 bg-gradient-to-b from-transparent via-violet-200/45 to-transparent" />
              <div className="absolute left-[13%] top-1/2 h-px w-[74%] -translate-y-1/2 bg-gradient-to-r from-transparent via-cyan-100/56 to-transparent" />
            </motion.div>
          </div>

          {particlePositions.map((position, index) => (
            <span
              key={position}
              className={`hero-particle absolute z-40 rounded-full ${
                index % 3 === 0 ? "h-1.5 w-1.5" : "h-1 w-1"
              } ${position}`}
            />
          ))}

          {hero.nodes.map((node, index) => (
            <motion.div
              key={node.title}
              className={`absolute z-50 ${nodePositions[index]} [transform-style:preserve-3d]`}
              whileTap={{ scale: 0.96 }}
              whileHover={{ scale: 1.025 }}
              animate={reduceMotion ? undefined : { y: [0, nodeDrift[index], 0] }}
              transition={{
                duration: 7.5 + index * 0.35,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <div
                className="hero-business-node flex min-h-[64px] flex-col items-center justify-center px-2 py-1.5 text-center"
                style={{
                  transform: `perspective(800px) rotateX(${nodePitch[index]}) rotateY(${nodeYaw[index]}) rotate(${nodeTilts[index]}) translateZ(${nodeDepths[index]}px)`,
                }}
              >
                <span className="hero-node-scan mb-1 h-px w-8 rounded-full" />
                <span className="hero-node-title">{node.title}</span>
                <span lang="th" className="hero-node-thai">
                  {node.thai}
                </span>
                <span className="hero-node-en">{node.subtitle}</span>
              </div>
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
