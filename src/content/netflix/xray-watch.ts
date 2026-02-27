import { log } from "../../shared/logger";
import { STORAGE_KEYS, XRAY_DEBOUNCE_MS } from "../../shared/constants";
import { isExtensionContextValid, isContextInvalidatedError } from "../../shared/extension-context";
import {
  showXrayPanel,
  showXrayLoading,
  showXrayError,
  hideXrayPanel
} from "../ui/xray-panel";
import { detectActiveTitleContext } from "./selectors";

const XRAY_STATE_POLL_MS = 800;
const XRAY_CONTROL_SYNC_DELAY_MS = 120;
const PLAY_PAUSE_CONTROL_SELECTOR =
  [
    "button[aria-label*='Play']",
    "button[aria-label*='Pause']",
    "[data-uia*='play-pause']",
    "[class*='PlayPause']",
    "[class*='play-pause']"
  ].join(",");

type NxlXrayWindow = Window & {
  __nxlXrayBooted?: boolean;
};

let debounceTimer: number | undefined;
let pollTimer: number | undefined;
let lastPauseAt = 0;
let xrayEnabled = true;
let lastKnownPaused: boolean | undefined;
let lastMediaSessionState: "none" | "playing" | "paused" = "none";
const observedVideos = new WeakSet<HTMLVideoElement>();

function getNxlWindow(): NxlXrayWindow {
  return window as NxlXrayWindow;
}

function extractTitleId(pathname: string): string | undefined {
  const match = pathname.match(/\/watch\/(\d+)/);
  return match?.[1];
}

function getNetflixTitleIdFromPage(): string | undefined {
  const inCurrentFrame = extractTitleId(window.location.pathname);
  if (inCurrentFrame) return inCurrentFrame;
  try {
    return extractTitleId(window.top?.location?.pathname ?? "");
  } catch {
    return undefined;
  }
}

function getTitleDocument(): Document {
  try {
    if (window.top && window.top !== window && window.top.document) {
      return window.top.document;
    }
  } catch {
    // Cross-origin access can throw in iframes; fallback to current frame.
  }
  return document;
}

function getCurrentTitleFromWatchPage(): { titleText?: string; year?: number } {
  const doc = getTitleDocument();
  const { candidate } = detectActiveTitleContext();
  if (candidate?.titleText) {
    return {
      titleText: candidate.titleText,
      year: candidate.year ?? undefined
    };
  }
  const titleEl = doc.querySelector(
    "[data-uia='video-title'], .title-title, [class*='title']"
  );
  const titleText = titleEl?.textContent?.trim();
  const yearEl = doc.querySelector("[class*='year'], [data-uia*='year']");
  const yearMatch = yearEl?.textContent?.match(/(19\d{2}|20\d{2})/);
  return {
    titleText: titleText ?? undefined,
    year: yearMatch ? Number(yearMatch[1]) : undefined
  };
}

function requestAnalyzeFrame(): void {
  if (!isExtensionContextValid()) return;
  if (!xrayEnabled) return;

  const netflixTitleId = getNetflixTitleIdFromPage();
  if (!netflixTitleId) {
    log("X-Ray: no title ID on watch page");
    showXrayError("Could not detect title");
    return;
  }

  let titleText: string | undefined;
  let year: number | undefined;
  try {
    const titleInfo = getCurrentTitleFromWatchPage();
    titleText = titleInfo.titleText;
    year = titleInfo.year;
  } catch (err) {
    log("X-Ray: title extraction failed", err);
  }

  const payload = {
    tabId: 0,
    netflixTitleId,
    titleText,
    year,
    timestamp: Math.floor(Date.now() / 1000)
  };

  log("XRAY_ANALYZE_REQUEST", {
    netflixTitleId,
    titleText,
    year
  });

  try {
    chrome.runtime.sendMessage(
      { type: "ANALYZE_FRAME", requestId: `xray_${Date.now()}`, payload },
      (response) => {
        if (!isExtensionContextValid()) return;
        if (chrome.runtime.lastError) {
          showXrayError(chrome.runtime.lastError.message || "Extension error");
          return;
        }
        if (response?.type !== "XRAY_FRAME_RESULT") {
          showXrayError("No response");
          return;
        }
        const { actors, noFaces, drmBlocked, permissionRequired, error } = response.payload;
        log("XRAY_ANALYZE_RESPONSE", {
          actors: actors?.length ?? 0,
          noFaces,
          drmBlocked,
          permissionRequired,
          error
        });
        if (error) {
          if (permissionRequired) {
            showXrayError("Click the extension icon on this tab, then pause again");
          } else if (drmBlocked) {
            showXrayError("Capture not available (DRM)");
          }
          else showXrayError(error);
          return;
        }
        if (noFaces) showXrayPanel([]);
        else showXrayPanel(actors);
      }
    );
  } catch (err) {
    if (isContextInvalidatedError(err)) return;
    showXrayError((err as Error)?.message ?? "Extension error");
  }
}

function getMainVideo(): HTMLVideoElement | null {
  const videos = Array.from(document.querySelectorAll<HTMLVideoElement>("video"));
  for (const v of videos) {
    const r = v.getBoundingClientRect();
    if (r.width >= window.innerWidth * 0.5 && r.height >= window.innerHeight * 0.5) return v;
  }
  return videos[0] ?? null;
}

function onPause(): void {
  const now = Date.now();
  if (now - lastPauseAt < XRAY_DEBOUNCE_MS) return;
  lastPauseAt = now;
  log("XRAY_PAUSE_DETECTED");

  if (debounceTimer) window.clearTimeout(debounceTimer);
  debounceTimer = window.setTimeout(() => {
    debounceTimer = undefined;
    showXrayLoading();
    requestAnalyzeFrame();
  }, XRAY_DEBOUNCE_MS);
}

function onPlay(): void {
  log("XRAY_PLAY_DETECTED");
  if (debounceTimer) {
    window.clearTimeout(debounceTimer);
    debounceTimer = undefined;
  }
  hideXrayPanel();
}

function observeVideo(video: HTMLVideoElement): void {
  if (observedVideos.has(video)) return;
  log("XRAY_VIDEO_OBSERVED", {
    width: Math.round(video.getBoundingClientRect().width),
    height: Math.round(video.getBoundingClientRect().height)
  });
  video.addEventListener("pause", onPause);
  video.addEventListener("play", onPlay);
  observedVideos.add(video);
}

function syncPlaybackState(video: HTMLVideoElement | null): void {
  if (!video) return;
  const isPaused = Boolean(video.paused || video.ended);
  if (lastKnownPaused === isPaused) return;
  lastKnownPaused = isPaused;
  if (isPaused) onPause();
  else onPlay();
}

function isWatchPage(): boolean {
  if (window.location.pathname.includes("/watch/")) return true;
  try {
    return Boolean(window.top?.location?.pathname?.includes("/watch/"));
  } catch {
    return false;
  }
}

function getMediaSessionState(): "none" | "playing" | "paused" {
  const state = navigator.mediaSession?.playbackState;
  if (state === "playing" || state === "paused") return state;
  return "none";
}

function isVisible(el: Element): boolean {
  const rect = el.getBoundingClientRect();
  if (rect.width === 0 || rect.height === 0) return false;
  const style = window.getComputedStyle(el as HTMLElement);
  if (style.display === "none" || style.visibility === "hidden" || style.opacity === "0") {
    return false;
  }
  return true;
}

function inferPausedFromControls(): boolean | undefined {
  const controls = Array.from(document.querySelectorAll<HTMLElement>(PLAY_PAUSE_CONTROL_SELECTOR))
    .filter((el) => isVisible(el));
  if (!controls.length) return undefined;

  const labels = controls
    .map((el) => (el.getAttribute("aria-label") ?? "").toLowerCase())
    .filter(Boolean);

  if (labels.some((label) => /\bpause\b/.test(label))) return false;
  if (labels.some((label) => /\bplay\b/.test(label))) return true;
  return undefined;
}

function syncFromControls(): void {
  const inferredPaused = inferPausedFromControls();
  if (inferredPaused === undefined) return;
  if (inferredPaused) {
    log("XRAY_CONTROLS_PAUSED");
    onPause();
  } else {
    log("XRAY_CONTROLS_PLAYING");
    onPlay();
  }
}

function syncFromMediaSession(): void {
  const state = getMediaSessionState();
  if (state === lastMediaSessionState) return;
  lastMediaSessionState = state;
  if (state === "paused") {
    log("XRAY_MEDIA_SESSION_PAUSED");
    onPause();
    return;
  }
  if (state === "playing") {
    log("XRAY_MEDIA_SESSION_PLAYING");
    onPlay();
  }
}

function startStatePolling(): void {
  if (pollTimer) window.clearInterval(pollTimer);
  pollTimer = window.setInterval(() => {
    if (!xrayEnabled || !isWatchPage()) return;
    const video = getMainVideo();
    if (video) {
      observeVideo(video);
      syncPlaybackState(video);
      return;
    }
    syncFromMediaSession();
    syncFromControls();
  }, XRAY_STATE_POLL_MS);
}

function bindPlayerControlFallbacks(): void {
  document.addEventListener(
    "click",
    (event) => {
      if (!isWatchPage()) return;
      const target = event.target as Element | null;
      if (!target) return;
      if (!target.closest(PLAY_PAUSE_CONTROL_SELECTOR)) return;
      window.setTimeout(() => {
        const video = getMainVideo();
        if (video) {
          syncPlaybackState(video);
          return;
        }
        syncFromMediaSession();
        syncFromControls();
      }, XRAY_CONTROL_SYNC_DELAY_MS);
    },
    true
  );

  document.addEventListener(
    "keydown",
    (event) => {
      if (!isWatchPage()) return;
      const key = event.key.toLowerCase();
      if (key !== " " && key !== "k") return;
      window.setTimeout(() => {
        const video = getMainVideo();
        if (video) {
          syncPlaybackState(video);
          return;
        }
        syncFromMediaSession();
        syncFromControls();
      }, XRAY_CONTROL_SYNC_DELAY_MS);
    },
    true
  );
}

export async function initXrayWatch(): Promise<void> {
  try {
    const win = getNxlWindow();
    if (win.__nxlXrayBooted) return;
    win.__nxlXrayBooted = true;

    if (!isExtensionContextValid()) return;
    const state = await chrome.storage.local.get([STORAGE_KEYS.XRAY_ENABLED]);
    if (!isExtensionContextValid()) return;
    xrayEnabled = true;
    if (state[STORAGE_KEYS.XRAY_ENABLED] === false) {
      // Legacy key from older builds that had an X-Ray toggle in popup.
      // Keep X-Ray enabled by default now so users don't get permanently stuck off.
      void chrome.storage.local.remove([STORAGE_KEYS.XRAY_ENABLED]);
    }

    const watchPage = isWatchPage();
    log("XRAY_INIT_FRAME", {
      href: window.location.href,
      topHref: (() => {
        try {
          return window.top?.location?.href;
        } catch {
          return "cross-origin";
        }
      })(),
      watchPage
    });
    if (!watchPage) return;
    log("XRAY_INIT", {
      href: window.location.href,
      topHref: (() => {
        try {
          return window.top?.location?.href;
        } catch {
          return "cross-origin";
        }
      })()
    });

    const video = getMainVideo();
    if (video) {
      observeVideo(video);
      syncPlaybackState(video);
    } else {
      syncFromMediaSession();
      syncFromControls();
    }

    if (!document.body) return;
    const observer = new MutationObserver(() => {
      if (!isWatchPage()) return;
      const v = getMainVideo();
      if (v) {
        observeVideo(v);
        syncPlaybackState(v);
        return;
      }
      syncFromMediaSession();
      syncFromControls();
    });
    observer.observe(document.body, { childList: true, subtree: true });
    bindPlayerControlFallbacks();
    startStatePolling();
  } catch (err) {
    log("initXrayWatch error", err);
    throw err;
  }
}
