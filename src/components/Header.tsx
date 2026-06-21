"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, LockKeyhole, Mail, Menu, X } from "lucide-react";

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
  const [authMode, setAuthMode] = useState<"login" | "register">("login");
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

  return (
    <header className="site-header pointer-events-none absolute inset-x-0 top-0 z-[80]">
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
          <span className="header-logo-mark grid size-11 shrink-0 place-items-center text-[13px] font-semibold text-cyan-50">
            {site.logoText}
          </span>
          <span className="min-w-0">
            <span className="block truncate text-[15px] font-semibold leading-5 text-white drop-shadow-[0_0_10px_rgba(103,232,249,0.2)]">
              {site.name}
            </span>
            <span className="block truncate text-xs leading-5 text-cyan-100/62">
              {site.tagline}
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
            className="header-menu-item header-account-entry group flex min-h-12 w-full items-center gap-3 rounded-2xl px-3.5 py-2 text-left text-sm font-semibold text-white/90 transition active:scale-[0.98]"
            onClick={() => {
              setIsMenuOpen(false);
              setIsAccountOpen(true);
            }}
          >
            <span className="min-w-0 flex-1 leading-snug">个人中心</span>
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

      {isAccountOpen ? (
        <div className="account-modal-layer pointer-events-auto fixed inset-0 z-[90] flex items-center justify-center px-5">
          <button
            type="button"
            aria-label="关闭个人中心"
            className="absolute inset-0 cursor-default bg-transparent"
            onClick={() => setIsAccountOpen(false)}
          />
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="account-dialog-title"
            className="account-modal-panel relative z-10 w-full max-w-[360px]"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="account-modal-kicker">Q-C ACCOUNT</p>
                <h2 id="account-dialog-title" className="account-modal-title">
                  个人中心
                </h2>
              </div>
              <button
                type="button"
                aria-label="关闭"
                className="account-modal-close grid size-10 place-items-center"
                onClick={() => setIsAccountOpen(false)}
              >
                <X size={18} strokeWidth={2} />
              </button>
            </div>

            <div className="account-auth-switch mt-5 grid grid-cols-2 gap-2">
              <button
                type="button"
                className={authMode === "login" ? "is-active" : ""}
                onClick={() => setAuthMode("login")}
              >
                邮箱登录
              </button>
              <button
                type="button"
                className={authMode === "register" ? "is-active" : ""}
                onClick={() => setAuthMode("register")}
              >
                邮箱注册
              </button>
            </div>

            <form
              className="mt-5 space-y-3"
              onSubmit={(event) => event.preventDefault()}
            >
              <label className="account-field">
                <span>
                  <Mail size={15} strokeWidth={2} />
                  邮箱地址
                </span>
                <input type="email" placeholder="name@example.com" required />
              </label>

              <label className="account-field">
                <span>
                  <LockKeyhole size={15} strokeWidth={2} />
                  登录密码
                </span>
                <input
                  type="password"
                  placeholder={authMode === "login" ? "输入密码" : "设置密码"}
                  required
                />
              </label>

              {authMode === "register" ? (
                <label className="account-field">
                  <span>
                    <LockKeyhole size={15} strokeWidth={2} />
                    确认密码
                  </span>
                  <input type="password" placeholder="再次输入密码" required />
                </label>
              ) : null}

              <button type="submit" className="account-submit">
                {authMode === "login" ? "登录账户" : "注册账户"}
                <ArrowRight size={18} strokeWidth={2} />
              </button>
            </form>
          </section>
        </div>
      ) : null}
    </header>
  );
}
