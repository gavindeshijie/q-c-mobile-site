"use client";

import { ArrowRight, ChevronDown } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import Image from "next/image";

import type { SiteContent } from "@/data/siteContent";

type Hero3DProps = {
  hero: SiteContent["hero"];
};

const nodePositions = [
  "w-[166px]",
  "w-[188px]",
  "w-[174px]",
  "ml-1 w-[214px]",
] as const;

const nodeTilts = ["-1.2deg", "1deg", "-1.4deg", "1.1deg"] as const;

const nodeDrift = [-2, 2, -2, 2] as const;

const nodeTitleClasses = [
  "",
  "hero-node-title-nowrap",
  "hero-node-title-nowrap",
  "hero-node-title-nowrap",
] as const;

const particlePositions = [
  "left-[8%] top-[17%]",
  "left-[72%] top-[13%]",
  "left-[91%] top-[42%]",
  "left-[55%] top-[78%]",
  "left-[16%] top-[88%]",
] as const;

// TODO: Replace with transparent character cutout for perfect layering.
const characterImage = "/images/hero-character.png";

export function Hero3D({ hero }: Hero3DProps) {
  const reduceMotion = useReducedMotion();
  const characterMotion = reduceMotion ? undefined : { y: [0, -3, 0] };
  const characterTransition = {
    duration: 9.5,
    repeat: Infinity,
    ease: "easeInOut" as const,
  };

  return (
    <section
      id="top"
      className="hero-fullscreen relative isolate overflow-hidden"
    >
      <h1 className="sr-only">{hero.title}</h1>
      <p className="sr-only">{hero.eyebrow}</p>
      <p className="sr-only">{hero.subtitle}</p>

      <div className="absolute right-4 top-10 z-[5] text-[4.8rem] font-semibold leading-none text-white/[0.035]">
        BKK
      </div>

      <div className="hero-cyber-stage absolute inset-0 overflow-hidden [perspective:1100px]">
        <div className="hero-cyber-depth absolute inset-0" />
        <div className="hero-cyber-grid absolute inset-x-[-18%] bottom-[-5%] h-[58%]" />

        <motion.div
          className="hero-character-wrap absolute inset-0 z-10"
          animate={characterMotion}
          transition={characterTransition}
        >
          <Image
            src={characterImage}
            alt=""
            fill
            priority
            sizes="(max-width: 430px) 100vw, 430px"
            className="hero-character-image hero-character-backplate object-cover object-[78%_center]"
          />
        </motion.div>

        <div className="hero-neon-triangle hero-neon-triangle-main absolute left-[94px] top-[128px] z-[34]" />
        <svg
          aria-hidden="true"
          viewBox="0 0 340 315"
          className="hero-triangle-runner absolute left-[94px] top-[128px] z-[35]"
        >
          <path
            className="hero-triangle-runner-glow"
            pathLength="100"
            d="M27 22 L326 158 L27 293 Z"
          />
          <path
            className="hero-triangle-runner-core"
            pathLength="100"
            d="M27 22 L326 158 L27 293 Z"
          />
        </svg>
        <div className="hero-neon-triangle hero-neon-triangle-small hero-triangle-chip-one absolute right-[18%] top-[19%] z-[28]" />
        <div className="hero-neon-triangle hero-neon-triangle-small hero-triangle-chip-two absolute right-[2%] top-[67%] z-[28]" />

        <div className="hero-character-hud absolute right-[9%] top-[28%] z-[22] h-[28%] w-[45%]" />
        <div className="hero-scanline absolute inset-x-0 top-[29%] z-[22] h-px" />

        {particlePositions.map((position, index) => (
          <span
            key={position}
            className={`hero-cyber-particle absolute z-[12] rounded-full ${
              index % 2 === 0 ? "h-1.5 w-1.5" : "h-1 w-1"
            } ${position}`}
          />
        ))}

        <svg
          aria-hidden="true"
          viewBox="0 0 390 760"
          className="absolute inset-0 z-[18] h-full w-full overflow-visible"
          preserveAspectRatio="none"
        >
          <path className="hero-hud-link" d="M160 92 C225 100 256 150 336 220" />
          <path className="hero-hud-link hero-hud-link-soft" d="M176 248 C226 244 268 282 342 346" />
          <path className="hero-hud-link" d="M154 405 C222 390 274 430 352 508" />
        </svg>

        <motion.div
          aria-hidden="true"
          className="hero-character-foreground absolute inset-0 z-[36]"
          animate={characterMotion}
          transition={characterTransition}
        >
          <Image
            src={characterImage}
            alt=""
            fill
            sizes="(max-width: 430px) 100vw, 430px"
            className="hero-character-image hero-character-cutout object-cover object-[78%_center]"
          />
        </motion.div>

        <motion.div
          aria-hidden="true"
          className="hero-character-effects absolute inset-0 z-[37]"
          animate={characterMotion}
          transition={characterTransition}
        >
          <span className="hero-hair-aura" />
          <span className="hero-hair-strand hero-hair-strand-one" />
          <span className="hero-hair-strand hero-hair-strand-two" />
          <span className="hero-hair-strand hero-hair-strand-three" />
          <span className="hero-visor-glow" />
        </motion.div>

        <div className="hero-fullscreen-shade absolute inset-0 z-40" />
        <div className="hero-left-readability absolute inset-y-0 left-0 z-40 w-[66%]" />
      </div>

      <div className="absolute bottom-[calc(env(safe-area-inset-bottom)+184px)] left-[max(4px,env(safe-area-inset-left))] top-[clamp(150px,20dvh,170px)] z-50 flex max-w-[calc(100%_-_8px)] flex-col justify-between gap-2">
        {hero.nodes.map((node, index) => (
          <motion.div
            key={node.title}
            className={nodePositions[index]}
            whileTap={{ scale: 0.97 }}
            animate={reduceMotion ? undefined : { y: [0, nodeDrift[index], 0] }}
            transition={{
              duration: 7.4 + index * 0.28,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <div
              className="hero-hud-node relative px-2 py-[6px]"
              style={{ transform: `rotate(${nodeTilts[index]})` }}
            >
              <span
                aria-hidden="true"
                className="hero-hud-frame-line hero-hud-frame-line-top"
              />
              <span
                aria-hidden="true"
                className="hero-hud-frame-line hero-hud-frame-line-bottom"
              />
              <span aria-hidden="true" className="hero-hud-alert-dot" />
              <span className={`hero-node-title ${nodeTitleClasses[index]}`}>
                {node.title}
              </span>
              <span lang="th" className="hero-node-thai">
                {node.thai}
              </span>
              <span className="hero-node-en">{node.subtitle}</span>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="hero-bottom-actions absolute inset-x-0 bottom-0 z-[60]">
        <div className="grid w-full grid-cols-2 gap-3">
          <a
            href={hero.primaryAction.href}
            className="flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-cyan-100 px-4 text-sm font-semibold text-[#041018] shadow-[0_18px_42px_rgba(36,213,255,0.24)] transition active:scale-[0.97]"
          >
            {hero.primaryAction.label}
            <ArrowRight size={17} strokeWidth={2} />
          </a>
          <a
            href={hero.secondaryAction.href}
            className="flex min-h-12 items-center justify-center gap-2 rounded-2xl border border-white/[0.16] bg-white/[0.08] px-4 text-sm font-semibold text-white/[0.9] shadow-[inset_0_1px_0_rgba(255,255,255,0.12)] backdrop-blur-md transition active:scale-[0.97]"
          >
            {hero.secondaryAction.label}
            <ChevronDown size={17} strokeWidth={2} />
          </a>
        </div>
      </div>
    </section>
  );
}
