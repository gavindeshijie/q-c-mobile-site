"use client";

import { ArrowRight, ChevronDown, CircleDot } from "lucide-react";
import { motion, type TargetAndTransition, useReducedMotion } from "framer-motion";

import type { SiteContent } from "@/data/siteContent";

type Hero3DProps = {
  hero: SiteContent["hero"];
};

const nodePositions = [
  "left-[calc(50%_-_86px)] top-0 w-[172px]",
  "right-0 top-[22%] w-[158px]",
  "left-0 top-[25%] w-[158px]",
  "left-0 bottom-[2%] w-[158px]",
  "right-0 bottom-[1%] w-[168px]",
] as const;

const nodeTilts = ["-3.5deg", "3deg", "-4deg", "2.6deg", "-2.4deg"] as const;

const nodeDepths = [48, 40, 36, 44, 52] as const;

const nodeMotion: TargetAndTransition[] = [
  { x: [0, 2, -2, 0], y: [0, -6, 2, 0], rotateX: [0, 2, -1, 0] },
  { x: [0, -3, 2, 0], y: [0, 5, -5, 0], rotateY: [0, -3, 2, 0] },
  { x: [0, 3, -2, 0], y: [0, -4, 6, 0], rotateY: [0, 3, -2, 0] },
  { x: [0, -2, 3, 0], y: [0, 7, -3, 0], rotateX: [0, -2, 1, 0] },
  { x: [0, 3, -3, 0], y: [0, -5, 6, 0], rotateX: [0, 1, -2, 0] },
];

const connectionPaths = [
  { d: "M50 52 C50 42 49 30 50 18", x: 50, y: 18 },
  { d: "M50 52 C61 42 70 36 84 38", x: 84, y: 38 },
  { d: "M50 52 C39 42 29 40 16 43", x: 16, y: 43 },
  { d: "M50 52 C39 62 31 70 23 80", x: 23, y: 80 },
  { d: "M50 52 C61 63 69 71 78 80", x: 78, y: 80 },
] as const;

const particlePositions = [
  "left-[22%] top-[23%]",
  "left-[62%] top-[17%]",
  "left-[79%] top-[52%]",
  "left-[43%] top-[80%]",
  "left-[14%] top-[59%]",
  "left-[53%] top-[36%]",
  "left-[33%] top-[50%]",
  "left-[70%] top-[70%]",
  "left-[48%] top-[11%]",
  "left-[84%] top-[32%]",
  "left-[8%] top-[36%]",
  "left-[58%] top-[86%]",
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
        <div className="hero-deep-space absolute inset-[-10%]" />
        <motion.div
          className="hero-hub-glow absolute inset-[-14%]"
          animate={reduceMotion ? undefined : { opacity: [0.58, 0.98, 0.58] }}
          transition={{ duration: 6.8, repeat: Infinity, ease: "easeInOut" }}
        />
        <div className="hero-signal-grid absolute inset-[1%]" />
        <div className="hero-energy-ribbon hero-energy-ribbon-one absolute left-[3%] top-[23%] h-[38%] w-[94%]" />
        <div className="hero-energy-ribbon hero-energy-ribbon-two absolute left-[7%] top-[45%] h-[32%] w-[86%]" />
        <div className="hero-depth-disc absolute left-1/2 top-[53%] h-[42%] w-[72%] -translate-x-1/2 rounded-full" />

        <motion.div
          className="relative h-full w-full will-change-transform [transform-style:preserve-3d]"
          animate={
            reduceMotion
              ? undefined
              : {
                  y: [0, -11, 0],
                  rotateX: [0, 3, 0],
                  rotateY: [-6, 6, -6],
                }
          }
          transition={{ duration: 8.2, repeat: Infinity, ease: "easeInOut" }}
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
                <stop offset="100%" stopColor="rgba(250,204,21,0.16)" />
              </linearGradient>
              <filter id="hero-line-glow" x="-35%" y="-35%" width="170%" height="170%">
                <feGaussianBlur stdDeviation="0.85" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
            {connectionPaths.map((path, index) => (
              <g key={path.d} filter="url(#hero-line-glow)">
                <path
                  className="hero-connection-base"
                  d={path.d}
                  stroke="url(#hero-connection-line)"
                />
                <path
                  className="hero-connection-flow"
                  d={path.d}
                  style={{ animationDelay: `${index * -0.42}s` }}
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
          <div className="hero-orbit hero-orbit-four absolute inset-[30%] z-20 rounded-full" />

          <div className="absolute left-1/2 top-1/2 z-30 h-[42%] w-[42%] -translate-x-1/2 -translate-y-1/2">
            <motion.div
              className="hero-core-stage relative h-full w-full"
              animate={
                reduceMotion
                  ? undefined
                  : {
                      y: [0, -7, 0],
                      rotateX: [58, 63, 58],
                      rotateY: [-12, 12, -12],
                    }
              }
              transition={{ duration: 7.6, repeat: Infinity, ease: "easeInOut" }}
            >
              <div className="hero-core-shadow absolute inset-[12%] rounded-full" />
              <div className="hero-core-rim hero-core-rim-back absolute inset-[-20%] rounded-full" />
              <div className="hero-glass-core absolute inset-0 rounded-full" />
              <div className="hero-core-lattice absolute inset-[10%] rounded-full" />
              <div className="hero-inner-world absolute inset-[22%] rounded-full" />
              <div className="hero-core-prism absolute left-1/2 top-1/2" />
              <div className="hero-core-cube absolute left-1/2 top-1/2">
                <span className="hero-cube-face hero-cube-front" />
                <span className="hero-cube-face hero-cube-back" />
                <span className="hero-cube-face hero-cube-right" />
                <span className="hero-cube-face hero-cube-left" />
                <span className="hero-cube-face hero-cube-top" />
                <span className="hero-cube-face hero-cube-bottom" />
              </div>
              <div className="hero-core-rim hero-core-rim-front absolute inset-[-15%] rounded-full" />
              <div className="absolute inset-[28%] rounded-full bg-cyan-200/45 blur-xl" />
              <div className="absolute left-[19%] top-[17%] h-[22%] w-[22%] rounded-full bg-white/45 blur-md" />
              <div className="hero-data-stream absolute left-[11%] top-[47%] h-px w-[78%] rotate-[-14deg]" />
              <div className="hero-data-stream hero-data-stream-delay absolute left-[15%] top-[54%] h-px w-[70%] rotate-[22deg]" />
              <div className="hero-data-stream hero-data-stream-third absolute left-[18%] top-[36%] h-px w-[64%] rotate-[42deg]" />
              <div className="absolute left-1/2 top-[12%] h-[76%] w-px -translate-x-1/2 bg-gradient-to-b from-transparent via-amber-100/50 to-transparent" />
              <div className="absolute left-[13%] top-1/2 h-px w-[74%] -translate-y-1/2 bg-gradient-to-r from-transparent via-cyan-100/56 to-transparent" />
            </motion.div>
          </div>

          {particlePositions.map((position, index) => (
            <motion.span
              key={position}
              className={`hero-particle absolute z-40 rounded-full ${
                index % 3 === 0 ? "h-1.5 w-1.5" : "h-1 w-1"
              } ${position}`}
              animate={
                reduceMotion
                  ? undefined
                  : {
                      y: [0, index % 2 ? -10 : 8, 0],
                      opacity: [0.28, 0.82, 0.28],
                    }
              }
              transition={{
                duration: 5.2 + index * 0.45,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          ))}

          {hero.nodes.map((node, index) => (
            <motion.div
              key={node.title}
              className={`absolute z-50 ${nodePositions[index]} [transform-style:preserve-3d]`}
              whileTap={{ scale: 0.96 }}
              whileHover={{ scale: 1.025 }}
              animate={reduceMotion ? undefined : nodeMotion[index]}
              transition={{
                duration: 5.6 + index * 0.32,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <div
                className="hero-business-node flex min-h-[78px] flex-col items-center justify-center px-2.5 py-2 text-center"
                style={{
                  transform: `rotate(${nodeTilts[index]}) translateZ(${nodeDepths[index]}px)`,
                }}
              >
                <span className="hero-node-scan mb-1 h-px w-12 rounded-full" />
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
