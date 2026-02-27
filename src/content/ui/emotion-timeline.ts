import type { ReactionTimeline } from "../../shared/types";
import { requestReactionTimeline } from "../netflix/reactions";
import { log } from "../../shared/logger";

const TIMELINE_HOST_ID = "nxlb-reaction-timeline";
const GRAPH_MAX_HEIGHT = 40; // px – max bar height like YouTube's "most replayed"

/** Locate Netflix's scrubber / progress bar so we can align pixel-perfectly. */
const findScrubberBar = (): HTMLElement | null => {
  const selectors = [
    "[data-uia='timeline']",
    "[class*='scrubber']",
    "[role='slider'][aria-label]",
    "[class*='Slider']",
    "[class*='progress-bar']",
    "[class*='PlayerTimeline']"
  ];
  for (const sel of selectors) {
    const el = document.querySelector<HTMLElement>(sel);
    if (el) {
      const r = el.getBoundingClientRect();
      if (r.width > 100) return el;
    }
  }
  return null;
};

const createTimelineHost = (): HTMLDivElement => {
  const host = document.createElement("div");
  host.id = TIMELINE_HOST_ID;
  host.style.position = "absolute";
  host.style.left = "0";
  host.style.right = "0";
  host.style.bottom = "0";
  host.style.height = `${GRAPH_MAX_HEIGHT}px`;
  host.style.pointerEvents = "auto";

  const shadow = host.attachShadow({ mode: "open" });
  const style = document.createElement("style");
  style.textContent = `
    :host {
      all: initial;
      display: block;
      width: 100%;
      height: 100%;
      pointer-events: auto;
    }
    .bar {
      display: flex;
      align-items: flex-end;
      width: 100%;
      height: 100%;
      overflow: hidden;
      gap: 0;
      position: relative;
    }
    .segment {
      flex: 1 1 auto;
      min-height: 0;
      border-radius: 1.5px 1.5px 0 0;
      background: rgba(255, 255, 255, 0.25);
      transition: height 200ms ease, background-color 120ms ease, opacity 120ms ease;
      cursor: pointer;
      position: relative;
    }
    .segment:hover {
      filter: brightness(1.4);
    }
    .tooltip {
      position: absolute;
      bottom: calc(100% + 8px);
      left: 50%;
      transform: translateX(-50%);
      background: rgba(0, 0, 0, 0.92);
      color: #f5f5f5;
      font-family: "Netflix Sans", "Helvetica Neue", Helvetica, Arial, sans-serif;
      font-size: 11px;
      padding: 6px 10px;
      border-radius: 6px;
      white-space: nowrap;
      pointer-events: none;
      z-index: 10;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.6);
      display: none;
    }
    .segment:hover .tooltip {
      display: block;
    }
  `;
  const bar = document.createElement("div");
  bar.className = "bar";
  bar.dataset.field = "segments";
  shadow.appendChild(style);
  shadow.appendChild(bar);
  return host;
};

const mapValenceToColor = (valence: number, intensity: number): string => {
  const v = Math.max(-1, Math.min(1, valence));
  const t = (v + 1) / 2; // 0..1
  const green = 120;
  const red = 0;
  const hue = red * (1 - t) + green * t;
  const alpha = Math.max(0.1, Math.min(0.8, intensity));
  return `hsla(${hue}, 70%, 55%, ${alpha})`;
};

const formatTime = (sec: number): string => {
  const h = Math.floor(sec / 3600);
  const m = Math.floor((sec % 3600) / 60);
  const s = Math.floor(sec % 60);
  if (h > 0) return `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  return `${m}:${String(s).padStart(2, "0")}`;
};

export const mountEmotionTimeline = async (): Promise<ReactionTimeline | null> => {
  if (!window.location.pathname.includes("/watch/")) return null;

  const player =
    document.querySelector<HTMLElement>(
      ".watch-video--player-view, [data-uia*='video-player'], [class*='VideoPlayer']"
    ) ?? document.body;

  if (!player) {
    log("EMOTION_TIMELINE_NO_PLAYER");
    return null;
  }

  if (!player.style.position || player.style.position === "static") {
    player.style.position = "relative";
  }

  let host = player.querySelector<HTMLDivElement>(`#${TIMELINE_HOST_ID}`);
  if (!host) {
    host = createTimelineHost();

    // Align with the actual Netflix scrubber bar when possible
    const scrubber = findScrubberBar();
    if (scrubber) {
      const playerRect = player.getBoundingClientRect();
      const scrubberRect = scrubber.getBoundingClientRect();
      const leftPx = scrubberRect.left - playerRect.left;
      const rightPx = playerRect.right - scrubberRect.right;
      host.style.left = `${leftPx}px`;
      host.style.right = `${rightPx}px`;
      // Sit directly above the scrubber
      const bottomPx = playerRect.bottom - scrubberRect.top;
      host.style.bottom = `${bottomPx}px`;
    } else {
      host.style.left = "6%";
      host.style.right = "6%";
      host.style.bottom = "54px";
    }

    host.style.height = `${GRAPH_MAX_HEIGHT}px`;
    player.appendChild(host);
  }

  const video = document.querySelector<HTMLVideoElement>("video");
  const match = window.location.pathname.match(/\/watch\/(\d+)/);
  const netflixId = match?.[1] ?? null;
  if (!video || !netflixId) return null;

  const durationSec = video.duration || 0;
  if (!durationSec || !Number.isFinite(durationSec)) return null;

  const timeline = await requestReactionTimeline(netflixId, durationSec);
  if (!timeline) return null;

  const bar = host.shadowRoot?.querySelector<HTMLDivElement>("[data-field='segments']");
  if (!bar) return timeline;
  bar.innerHTML = "";

  const total = timeline.buckets.length || 1;

  // Normalize heights relative to the peak intensity (YouTube "most replayed" style)
  const maxIntensity = timeline.buckets.reduce(
    (max, b) => Math.max(max, b.intensity),
    0
  );

  timeline.buckets.forEach((bucket) => {
    const seg = document.createElement("div");
    seg.className = "segment";

    if (bucket.count > 0 && maxIntensity > 0) {
      const color = mapValenceToColor(bucket.meanValence, bucket.intensity);
      seg.style.backgroundColor = color;
      const heightPct = Math.max(5, (bucket.intensity / maxIntensity) * 100);
      seg.style.height = `${heightPct}%`;
      seg.style.opacity = "1";
    } else {
      seg.style.backgroundColor = "rgba(255,255,255,0.08)";
      seg.style.height = "2px";
      seg.style.opacity = "0.3";
    }

    // Hover tooltip with time range + reaction count
    const tooltip = document.createElement("div");
    tooltip.className = "tooltip";
    const timeStr = `${formatTime(bucket.startSec)} – ${formatTime(bucket.endSec)}`;
    if (bucket.count > 0) {
      tooltip.textContent = `${timeStr}  •  ${bucket.count} reaction${bucket.count !== 1 ? "s" : ""}`;
    } else {
      tooltip.textContent = timeStr;
    }
    seg.appendChild(tooltip);

    seg.style.flexBasis = `${100 / total}%`;
    bar.appendChild(seg);
  });

  return timeline;
};
