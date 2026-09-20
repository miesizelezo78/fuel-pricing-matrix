"use client";

import { useEffect, type RefObject } from "react";

export function useWorkWindowAside(rootRef: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const live =
      root.querySelector<HTMLElement>("[data-live-panel]") ||
      root.querySelector<HTMLElement>(".live-body");
    const track = live?.closest<HTMLElement>(".live-track");
    if (!live || !track) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const TAU_MOVE = 0.82;
    const TAU_FOLLOW = 0.18;
    const MOVE_START = 56;

    let lastWindow: HTMLElement | null = null;
    let currentY = 0;
    let targetY = 0;
    let lastTs = 0;
    let raf = 0;
    let cruising = true;
    let ticking = false;
    let snapped = false;

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
        if (focused && visibleOverlap(focused) > 48) return focused;
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
        const lastGone = lastOverlap < lastRect.height * 0.18;
        if (!lastGone && lastDist <= bestDist + 140) return lastWindow;
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

    function applyY() {
      live.style.marginTop = "0px";
      live.style.transform = `translate3d(0,${currentY}px,0)`;
    }

    function stopLoop() {
      if (raf) {
        window.cancelAnimationFrame(raf);
        raf = 0;
      }
      lastTs = 0;
    }

    function loop(ts: number) {
      raf = 0;
      if (!splitLayout()) return;
      if (!lastTs) lastTs = ts;
      const dt = Math.min(0.05, (ts - lastTs) / 1000);
      lastTs = ts;
      const dist = targetY - currentY;
      const abs = Math.abs(dist);
      if (reduceMotion.matches || abs < 0.35) {
        currentY = targetY;
        applyY();
        cruising = true;
        lastTs = 0;
        return;
      }
      if (abs > MOVE_START) cruising = false;
      const tau = cruising ? TAU_FOLLOW : TAU_MOVE;
      currentY += dist * (1 - Math.exp(-dt / tau));
      applyY();
      raf = window.requestAnimationFrame(loop);
    }

    function kick() {
      if (!raf) {
        lastTs = 0;
        raf = window.requestAnimationFrame(loop);
      }
    }

    function resetFlow() {
      stopLoop();
      live.style.marginTop = "";
      live.style.transform = "";
      track.style.minHeight = "";
      lastWindow = null;
      currentY = 0;
      targetY = 0;
      cruising = true;
      snapped = false;
    }

    function place() {
      if (!splitLayout()) {
        resetFlow();
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
      lastWindow = target;
      if (!snapped || reduceMotion.matches) {
        currentY = y;
        targetY = y;
        snapped = true;
        cruising = true;
        applyY();
        return;
      }
      if (Math.abs(y - targetY) < 0.4 && Math.abs(currentY - y) < 0.4) return;
      targetY = y;
      kick();
    }

    function requestPlace() {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(() => {
        ticking = false;
        place();
      });
    }

    window.addEventListener("scroll", requestPlace, { passive: true, capture: true });
    window.addEventListener("resize", requestPlace);
    root.addEventListener("focusin", requestPlace);
    root.addEventListener("click", requestPlace);
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
    ro?.observe(track);
    workWindows().forEach((win) => ro?.observe(win));
    place();

    return () => {
      window.removeEventListener("scroll", requestPlace, true);
      window.removeEventListener("resize", requestPlace);
      root.removeEventListener("focusin", requestPlace);
      root.removeEventListener("click", requestPlace);
      io?.disconnect();
      ro?.disconnect();
      stopLoop();
    };
  }, [rootRef]);
}
