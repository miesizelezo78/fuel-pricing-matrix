"use client";

import { useEffect, type RefObject } from "react";

export function useWorkWindowAside(rootRef: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const live =
      root.querySelector<HTMLElement>("[data-live-panel]") ||
      root.querySelector<HTMLElement>("aside");
    const track = live?.closest<HTMLElement>(".live-track");
    if (!live || !track) return;

    let lastWindow: HTMLElement | null = null;
    let lockedWindow: HTMLElement | null = null;
    let lastY = -1;
    let travelTimer = 0;
    let ticking = false;

    function splitLayout() {
      const grid = root.querySelector("form") || root;
      const cols = window.getComputedStyle(grid).gridTemplateColumns;
      return cols.split(" ").filter(Boolean).length >= 2;
    }

    function observerTop() {
      let bottom = 12;
      document
        .querySelectorAll("header, [data-site-header]")
        .forEach((el) => {
          const style = window.getComputedStyle(el);
          if (style.position !== "fixed" && style.position !== "sticky") return;
          const rect = el.getBoundingClientRect();
          if (rect.height < 8 || rect.top > 120) return;
          if (rect.bottom > bottom) bottom = rect.bottom;
        });
      return bottom + 16;
    }

    function workWindows() {
      return Array.from(root.querySelectorAll<HTMLElement>("[data-work-window]"));
    }

    function stillInView(win: HTMLElement | null) {
      if (!win?.isConnected) return false;
      const rect = win.getBoundingClientRect();
      const top = observerTop();
      return rect.bottom > top + 48 && rect.top < window.innerHeight - 48;
    }

    function pickWindow() {
      const wins = workWindows();
      if (!wins.length) return null;
      if (lockedWindow && stillInView(lockedWindow)) return lockedWindow;
      lockedWindow = null;
      const active = document.activeElement;
      if (active && root.contains(active)) {
        const focused = active.closest<HTMLElement>("[data-work-window]");
        if (focused) return focused;
      }
      const top = observerTop();
      const line =
        top + Math.min(160, Math.max(72, (window.innerHeight - top) * 0.22));
      let containing: HTMLElement | null = null;
      let best = wins[0];
      let bestDist = Infinity;
      wins.forEach((win) => {
        const rect = win.getBoundingClientRect();
        if (rect.bottom <= top + 8 || rect.top >= window.innerHeight - 8) return;
        if (rect.top <= line && rect.bottom > line + 20) containing = win;
        const mid = (rect.top + Math.min(rect.bottom, window.innerHeight)) / 2;
        const dist = Math.abs(mid - line);
        if (dist < bestDist) {
          bestDist = dist;
          best = win;
        }
      });
      const next = containing || best;
      if (lastWindow && lastWindow !== next && stillInView(lastWindow) && !containing) {
        return lastWindow;
      }
      return next;
    }

    function place(fromTravel?: boolean) {
      if (!splitLayout()) {
        live.classList.remove("is-traveling");
        live.style.transform = "none";
        lastY = -1;
        lastWindow = null;
        return;
      }
      const target = pickWindow();
      if (!target) return;
      const trackRect = track.getBoundingClientRect();
      const liveH = live.offsetHeight;
      const maxY = Math.max(0, track.clientHeight - liveH);
      const viewTop = observerTop();
      const viewBottom = window.innerHeight - 16;
      const targetRect = target.getBoundingClientRect();
      let desired = targetRect.top;
      if (desired < viewTop) desired = viewTop;
      if (desired + liveH > viewBottom) {
        desired = Math.max(viewTop, viewBottom - liveH);
      }
      let y = Math.max(0, Math.min(maxY, desired - trackRect.top));
      y = Math.round(y);
      const switched = target !== lastWindow;
      lastWindow = target;
      if (switched && fromTravel !== false) {
        live.classList.add("is-traveling");
        window.clearTimeout(travelTimer);
        travelTimer = window.setTimeout(() => {
          live.classList.remove("is-traveling");
        }, 600);
      } else if (!switched) {
        live.classList.remove("is-traveling");
      }
      if (y === lastY) return;
      lastY = y;
      live.style.transform = `translate3d(0,${y}px,0)`;
    }

    function requestPlace() {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(() => {
        ticking = false;
        place();
      });
    }

    function onFocus(event: FocusEvent) {
      const win = (event.target as HTMLElement).closest?.("[data-work-window]");
      if (win instanceof HTMLElement) lockedWindow = win;
      requestPlace();
    }

    function onClick(event: MouseEvent) {
      const target = event.target as HTMLElement;
      if (target.closest("[data-live-panel]")) {
        requestPlace();
        return;
      }
      const win = target.closest("[data-work-window]");
      if (win instanceof HTMLElement) lockedWindow = win;
      requestPlace();
    }

    window.addEventListener("scroll", requestPlace, { passive: true });
    window.addEventListener("resize", requestPlace);
    root.addEventListener("focusin", onFocus);
    root.addEventListener("click", onClick);
    const ro =
      typeof ResizeObserver === "function" ? new ResizeObserver(requestPlace) : null;
    ro?.observe(track);
    ro?.observe(live);
    workWindows().forEach((win) => ro?.observe(win));
    place(false);

    return () => {
      window.removeEventListener("scroll", requestPlace);
      window.removeEventListener("resize", requestPlace);
      root.removeEventListener("focusin", onFocus);
      root.removeEventListener("click", onClick);
      ro?.disconnect();
      window.clearTimeout(travelTimer);
    };
  }, [rootRef]);
}
