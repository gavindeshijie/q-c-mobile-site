"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

function resetScrollPosition() {
  const scrollTop = () => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  };

  scrollTop();
  window.requestAnimationFrame(scrollTop);
  window.setTimeout(scrollTop, 80);
  window.setTimeout(scrollTop, 320);
  window.setTimeout(scrollTop, 720);
}

export function ScrollToTopOnLoad() {
  const pathname = usePathname();

  useEffect(() => {
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }

    if (window.location.hash) {
      window.history.replaceState(
        null,
        "",
        `${window.location.pathname}${window.location.search}`,
      );
    }

    resetScrollPosition();

    const handlePageShow = () => resetScrollPosition();
    const handleBeforeUnload = () => {
      window.scrollTo(0, 0);
    };

    window.addEventListener("pageshow", handlePageShow);
    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("pageshow", handlePageShow);
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [pathname]);

  return null;
}
