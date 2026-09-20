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
      document.querySelectorAll("header, [data-site-header]").forEach((el) => {
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

    function syncTrackHeight() {
      const stack = root.querySelector<HTMLElement>("[data-work-stack]");
      if (!splitLayout() || !stack) {
        track.style.minHeight = "";
        return;
      }
      track.style.minHeight = `${stack.offsetHeight}px`;
    }

    function visibleOverlap(win: HTMLElement) {
      const rect = win.getBoundingClientRect();
      const top = observerTop();
      const bottom = window.innerHeight - 16;
      return Math.max(0, Math.min(rect.bottom, bottom) - Math.max(rect.top, top));
    }

    function pickWindow() {
      const wins = workWindows();
      if (!wins.length) return null;
      const active = document.activeElement;
      if (active && root.contains(active) && active !== document.body) {
        const focused = active.closest<HTMLElement>("[data-work-window]");
        if (focused) return focused;
      }
      const viewMid = (observerTop() + window.innerHeight) / 2;
      let best: HTMLElement | null = null;
      let bestDist = Infinity;
      wins.forEach((win) => {
        const overlap = visibleOverlap(win);
        if (overlap < 48) return;
        const rect = win.getBoundingClientRect();
        const mid = (rect.top + rect.bottom) / 2;
        const dist = Math.abs(mid - viewMid);
        if (dist < bestDist) {
          bestDist = dist;
          best = win;
        }
      });
      if (!best) best = wins[0];
      if (lastWindow && lastWindow !== best && lastWindow.isConnected) {
        const lastOverlap = visibleOverlap(lastWindow);
        const lastRect = lastWindow.getBoundingClientRect();
        const lastMid = (lastRect.top + lastRect.bottom) / 2;
        const lastDist = Math.abs(lastMid - viewMid);
        const lastGone = lastOverlap < lastRect.height * 0.28;
        if (!lastGone && lastDist <= bestDist + 70) return lastWindow;
      }
      return best;
    }

    function alignY(win: HTMLElement, liveH: number, trackRect: DOMRect) {
      const wins = workWindows();
      const index = wins.indexOf(win);
      const rect = win.getBoundingClientRect();
      const top = rect.top - trackRect.top;
      if (index <= 0) return top;
      if (index === wins.length - 1) return top + rect.height - liveH;
      return top + (rect.height - liveH) / 2;
    }

    function place(fromTravel?: boolean) {
      if (!splitLayout()) {
        live.classList.remove("is-traveling");
        live.style.marginTop = "";
        live.style.transform = "none";
        track.style.minHeight = "";
        lastY = -1;
        lastWindow = null;
        return;
      }
      syncTrackHeight();
      const target = pickWindow();
      if (!target) return;
      const liveH = live.offsetHeight;
      const trackRect = track.getBoundingClientRect();
      const maxY = Math.max(0, track.clientHeight - liveH);
      const viewTop = observerTop();
      const viewBottom = window.innerHeight - 16;
      let y = alignY(target, liveH, trackRect);
      if (trackRect.top + y < viewTop) y = viewTop - trackRect.top;
      if (trackRect.top + y + liveH > viewBottom) {
        y = viewBottom - liveH - trackRect.top;
      }
      y = Math.max(0, Math.min(maxY, y));
      y = Math.round(y);
      const switched = target !== lastWindow;
      lastWindow = target;
      if (switched && fromTravel !== false) {
        live.classList.add("is-traveling");
        window.clearTimeout(travelTimer);
        travelTimer = window.setTimeout(() => {
          live.classList.remove("is-traveling");
        }, 1000);
      }
      if (y === lastY) return;
      lastY = y;
      live.style.marginTop = "0px";
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

    function onFocus() {
      place();
    }

    function onClick(event: MouseEvent) {
      if ((event.target as HTMLElement).closest("[data-live-panel]")) {
        place();
        return;
      }
      place();
    }

    window.addEventListener("scroll", requestPlace, { passive: true, capture: true });
    window.addEventListener("resize", requestPlace);
    root.addEventListener("focusin", onFocus);
    root.addEventListener("click", onClick);
    const io =
      typeof IntersectionObserver === "function"
        ? new IntersectionObserver(requestPlace, {
            root: null,
            threshold: [0, 0.15, 0.35, 0.5, 0.7, 1],
          })
        : null;
    workWindows().forEach((win) => io?.observe(win));
    const ro =
      typeof ResizeObserver === "function" ? new ResizeObserver(requestPlace) : null;
    const stack = root.querySelector("[data-work-stack]");
    if (stack) ro?.observe(stack);
    ro?.observe(live);
    workWindows().forEach((win) => ro?.observe(win));
    place(false);

    return () => {
      window.removeEventListener("scroll", requestPlace, true);
      window.removeEventListener("resize", requestPlace);
      root.removeEventListener("focusin", onFocus);
      root.removeEventListener("click", onClick);
      io?.disconnect();
      ro?.disconnect();
      window.clearTimeout(travelTimer);
    };
  }, [rootRef]);
}
