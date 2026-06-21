"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

function resetScrollPosition() {
  window.requestAnimationFrame(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  });
}

export function ScrollToTopOnLoad() {
  const pathname = usePathname();

  useEffect(() => {
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }

    const shouldPreserveAnchor = () => window.location.hash.length > 0;

    if (!shouldPreserveAnchor()) {
      resetScrollPosition();
    }

    const handlePageShow = () => {
      if (!shouldPreserveAnchor()) {
        resetScrollPosition();
      }
    };

    window.addEventListener("pageshow", handlePageShow);

    return () => {
      window.removeEventListener("pageshow", handlePageShow);
    };
  }, [pathname]);

  return null;
}
