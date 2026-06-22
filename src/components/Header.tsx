"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Menu, X } from "lucide-react";

import { UserCenterModal } from "@/components/UserCenterModal";
import type { SiteContent } from "@/data/siteContent";

type HeaderProps = {
  site: Pick<
    SiteContent,
    "logoText" | "name" | "tagline" | "menuLabel" | "entryLinks" | "hero"
  >;
};

export function Header({ site }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const scrollYRef = useRef(0);
  const headerDisplayName = "q-c.hk";
  const menuItems = site.hero.nodes.map((node) => ({
    label: node.title,
    href: node.href,
  }));

  useEffect(() => {
    if (!isMenuOpen && !isAccountOpen) {
      return;
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsMenuOpen(false);
        setIsAccountOpen(false);
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isMenuOpen, isAccountOpen]);

  useEffect(() => {
    if (!isAccountOpen) {
      return;
    }

    const body = document.body;
    const html = document.documentElement;
    const previousBodyStyle = {
      position: body.style.position,
      top: body.style.top,
      left: body.style.left,
      right: body.style.right,
      width: body.style.width,
      overflow: body.style.overflow,
    };
    const previousScrollBehavior = html.style.scrollBehavior;

    scrollYRef.current = window.scrollY;
    html.style.scrollBehavior = "auto";
    body.style.position = "fixed";
    body.style.top = `-${scrollYRef.current}px`;
    body.style.left = "0";
    body.style.right = "0";
    body.style.width = "100%";
    body.style.overflow = "hidden";

    return () => {
      const y = scrollYRef.current;

      body.style.position = previousBodyStyle.position;
      body.style.top = previousBodyStyle.top;
      body.style.left = previousBodyStyle.left;
      body.style.right = previousBodyStyle.right;
      body.style.width = previousBodyStyle.width;
      body.style.overflow = previousBodyStyle.overflow;
      html.style.scrollBehavior = previousScrollBehavior;
      window.scrollTo({ top: y, left: 0, behavior: "auto" });
    };
  }, [isAccountOpen]);

  const accountModal =
    isAccountOpen && typeof document !== "undefined"
      ? createPortal(
          <div className="account-modal-layer pointer-events-auto fixed z-[9999] flex items-center justify-center p-4">
            <button
              type="button"
              aria-label="关闭个人中心"
              className="absolute inset-0 cursor-default bg-transparent"
              onClick={() => setIsAccountOpen(false)}
            />
            <UserCenterModal onClose={() => setIsAccountOpen(false)} />
          </div>,
          document.body,
        )
      : null;

  return (
    <>
      <header className="site-header pointer-events-none">
        {isMenuOpen ? (
          <button
            type="button"
            aria-label="关闭菜单"
            className="pointer-events-auto fixed inset-0 z-0 cursor-default bg-transparent"
            onClick={() => setIsMenuOpen(false)}
          />
        ) : null}

        <div className="relative z-10 flex items-start justify-between">
          <Link
            href={site.entryLinks.brand}
            className="header-brand group pointer-events-auto flex min-h-12 min-w-0 items-center gap-3 outline-none transition-transform active:scale-[0.98]"
            aria-label={site.name}
          >
            <span className="header-logo-mark grid size-11 shrink-0 place-items-center">
              <Image
                src="/images/qichuang-logo.png"
                alt="启创"
                width={512}
                height={512}
                className="header-logo-image"
                priority
              />
            </span>
            <span className="min-w-0">
              <span className="block truncate text-[16px] font-semibold leading-5 text-white drop-shadow-[0_0_10px_rgba(103,232,249,0.2)]">
                {headerDisplayName}
              </span>
            </span>
          </Link>

          <button
            type="button"
            aria-label={isMenuOpen ? "关闭菜单" : site.menuLabel}
            aria-expanded={isMenuOpen}
            aria-controls="site-hud-menu"
            className="header-menu-button pointer-events-auto grid size-12 place-items-center text-cyan-50 outline-none transition duration-200 active:scale-95"
            onClick={() => setIsMenuOpen((current) => !current)}
          >
            {isMenuOpen ? (
              <X size={20} strokeWidth={1.9} />
            ) : (
              <Menu size={21} strokeWidth={1.9} />
            )}
          </button>
        </div>

        <nav
          id="site-hud-menu"
          aria-label="主菜单"
          className={`header-menu-panel absolute right-[max(18px,env(safe-area-inset-right))] ${
            isMenuOpen
              ? "pointer-events-auto translate-y-0 scale-100 opacity-100"
              : "pointer-events-none -translate-y-2 scale-[0.98] opacity-0"
          }`}
        >
          <div className="space-y-2">
            <button
              type="button"
              className="header-menu-item header-account-entry group flex min-h-12 w-full items-center justify-center rounded-2xl px-3.5 py-2 text-center transition active:scale-[0.98]"
              onClick={(event) => {
                event.preventDefault();
                event.currentTarget.blur();
                setIsMenuOpen(false);
                setIsAccountOpen(true);
              }}
            >
              <span className="header-account-label">个人中心</span>
            </button>

            {menuItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="header-menu-item group flex min-h-12 items-center gap-3 rounded-2xl px-3.5 py-2 text-sm font-semibold text-white/86 transition active:scale-[0.98]"
                onClick={() => setIsMenuOpen(false)}
              >
                <span className="header-menu-alert-dot" aria-hidden="true" />
                <span className="min-w-0 flex-1 leading-tight">
                  <span className="block truncate">{item.label}</span>
                </span>
                <ArrowRight size={15} strokeWidth={2} />
              </Link>
            ))}
          </div>
        </nav>
      </header>
      {accountModal}
    </>
  );
}
