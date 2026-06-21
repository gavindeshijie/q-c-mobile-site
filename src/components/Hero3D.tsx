"use client";

import { ArrowRight, ChevronDown, CircleDot } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";

import type { SiteContent } from "@/data/siteContent";

type Hero3DProps = {
  hero: SiteContent["hero"];
};

const nodePositions = [
  "left-[calc(50%_-_75px)] top-0 w-[150px]",
  "right-0 top-[27%] w-[126px]",
  "left-0 top-[30%] w-[126px]",
  "left-[3%] bottom-[4%] w-[138px]",
  "right-[3%] bottom-[4%] w-[138px]",
] as const;

const nodeAnchors = [
  { x: 50, y: 20 },
  { x: 82, y: 43 },
  { x: 18, y: 46 },
  { x: 27, y: 78 },
  { x: 73, y: 78 },
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
        className="relative mx-auto flex h-[min(88vw,342px)] w-full max-w-[390px] items-center justify-center [perspective:1080px]"
      >
        <motion.div
          className="hero-hub-glow absolute inset-[-14%]"
          animate={reduceMotion ? undefined : { opacity: [0.58, 0.98, 0.58] }}
          transition={{ duration: 6.8, repeat: Infinity, ease: "easeInOut" }}
        />
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
            {nodeAnchors.map((anchor) => (
              <g key={`${anchor.x}-${anchor.y}`} filter="url(#hero-line-glow)">
                <line
                  x1="50"
                  y1="50"
                  x2={anchor.x}
                  y2={anchor.y}
                  stroke="url(#hero-connection-line)"
                  strokeLinecap="round"
                  strokeWidth="0.42"
                />
                <circle
                  cx={anchor.x}
                  cy={anchor.y}
                  r="1.15"
                  fill="rgba(165,243,252,0.9)"
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
              <div className="hero-glass-core absolute inset-0 rounded-full" />
              <div className="hero-core-lattice absolute inset-[10%] rounded-full" />
              <div className="hero-inner-world absolute inset-[22%] rounded-full" />
              <div className="hero-core-cube absolute left-1/2 top-1/2">
                <span className="hero-cube-face hero-cube-front" />
                <span className="hero-cube-face hero-cube-back" />
                <span className="hero-cube-face hero-cube-right" />
                <span className="hero-cube-face hero-cube-left" />
                <span className="hero-cube-face hero-cube-top" />
                <span className="hero-cube-face hero-cube-bottom" />
              </div>
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
              className={`absolute z-40 h-1 w-1 rounded-full bg-cyan-100 shadow-[0_0_14px_rgba(103,232,249,0.9)] ${position}`}
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
              className={`hero-business-node absolute z-50 ${nodePositions[index]} flex min-h-[58px] flex-col items-center justify-center px-2.5 py-2 text-center`}
              whileTap={{ scale: 0.96 }}
              animate={reduceMotion ? undefined : { y: [0, index % 2 ? -7 : 7, 0] }}
              transition={{
                duration: 4.9 + index * 0.28,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <span className="hero-node-scan mb-1 h-px w-11 rounded-full" />
              <span className="text-[11px] font-semibold leading-[1.18] text-white">
                {node.title}
              </span>
              <span className="mt-1 text-[7px] font-semibold uppercase leading-3 tracking-[0.08em] text-cyan-100/64">
                {node.subtitle}
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
