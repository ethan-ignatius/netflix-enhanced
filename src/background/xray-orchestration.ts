import { log } from "../shared/logger";
import type { AnalyzeFramePayload, XraySceneActor } from "../shared/types";
import { getXrayCached, setXrayCached } from "./xray-cache";
import { resolveTitle, getPersonCharacter, recognizeCelebrities } from "./api-proxy";
import { REKOGNITION_MAX_FACES } from "../shared/constants";

const OFFSCREEN_DOCUMENT_PATH = "offscreen/offscreen.html";
const OFFSCREEN_REASON = "USER_MEDIA" as chrome.offscreen.Reason;
const OFFSCREEN_JUSTIFICATION = "Process tab capture for X-Ray face detection";

let cachedPort: chrome.runtime.Port | null = null;

function clearCachedPort(): void {
  cachedPort = null;
}

export type ProcessedFace = { base64: string; box: { x: number; y: number; width: number; height: number } };

function base64ToUint8Array(base64: string): Uint8Array {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

async function ensureOffscreenDocument(): Promise<void> {
  const existing = await chrome.offscreen.hasDocument();
  if (existing) return;
  await chrome.offscreen.createDocument({
    url: OFFSCREEN_DOCUMENT_PATH,
    reasons: [OFFSCREEN_REASON],
    justification: OFFSCREEN_JUSTIFICATION
  });
}

export async function closeOffscreenDocument(): Promise<void> {
  clearCachedPort();
  const existing = await chrome.offscreen.hasDocument();
  if (existing) await chrome.offscreen.closeDocument();
}

function waitForPort(timeoutMs: number): Promise<chrome.runtime.Port> {
  if (cachedPort) return Promise.resolve(cachedPort);
  return new Promise((resolve, reject) => {
    const t = setTimeout(() => reject(new Error("Offscreen port timeout")), timeoutMs);
    const listener = (port: chrome.runtime.Port) => {
      if (port.name === "xray-offscreen") {
        clearTimeout(t);
        chrome.runtime.onConnect.removeListener(listener);
        cachedPort = port;
        port.onDisconnect.addListener(clearCachedPort);
        resolve(port);
      }
    };
    chrome.runtime.onConnect.addListener(listener);
  });
}

function getTabStreamId(tabId: number): Promise<string> {
  return new Promise((resolve, reject) => {
    chrome.tabCapture.getMediaStreamId(
      {
        targetTabId: tabId,
        consumerTabId: tabId
      },
      (streamId) => {
        const lastError = chrome.runtime.lastError;
        if (lastError) {
          reject(new Error(lastError.message));
          return;
        }
        if (!streamId) {
          reject(new Error("No media stream ID returned"));
          return;
        }
        resolve(streamId);
      }
    );
  });
}

export async function analyzeFrame(payload: AnalyzeFramePayload): Promise<{
  actors: XraySceneActor[];
  noFaces?: boolean;
  drmBlocked?: boolean;
  permissionRequired?: boolean;
  error?: string;
}> {
  let { tmdbId: titleId, tmdbMediaType } = payload;
  let mediaType = tmdbMediaType ?? "movie";

  if (titleId == null && (payload.titleText || payload.netflixTitleId)) {
    try {
      const resolved = await resolveTitle({
        rawTitle: payload.titleText ?? "",
        normalizedTitle: payload.titleText ?? "",
        year: payload.year ?? null,
        isSeries: mediaType === "tv" ? true : undefined,
        netflixId: payload.netflixTitleId ?? null,
        href: null
      });
      titleId = resolved.tmdbId ?? undefined;
      mediaType = resolved.tmdbMediaType ?? "movie";
    } catch {
      // keep titleId undefined
    }
  }

  const { netflixTitleId, timestamp } = payload;

  const cached = await getXrayCached(netflixTitleId, timestamp);
  if (cached) {
    log("X-Ray cache hit", { netflixTitleId, timestamp });
    return { actors: cached };
  }

  let streamId: string;
  try {
    streamId = await getTabStreamId(payload.tabId);
  } catch (e) {
    const message = (e as Error).message ?? "Capture failed";
    const permissionRequired =
      /invok|gesture|activeTab|permission|allow|not allowed|grant/i.test(message);
    const drmBlocked = /drm|protected/i.test(message);
    log("tabCapture.getMediaStreamId failed", e);
    return {
      actors: [],
      drmBlocked,
      permissionRequired,
      error: message
    };
  }

  if (!cachedPort) {
    const hasDoc = await chrome.offscreen.hasDocument();
    if (hasDoc) await chrome.offscreen.closeDocument();
    await ensureOffscreenDocument();
  }
  const port = await waitForPort(8000).catch(() => null);
  if (!port) {
    return { actors: [], error: "Offscreen not ready" };
  }

  const processed = await new Promise<{
    faces: ProcessedFace[];
    error?: string;
    drmBlocked?: boolean;
  }>((resolve) => {
    const handler = (msg: { type: string; faces?: ProcessedFace[]; error?: string; drmBlocked?: boolean }) => {
      if (msg.type === "FRAME_PROCESSED") {
        port.onMessage.removeListener(handler);
        resolve({
          faces: msg.faces ?? [],
          error: msg.error,
          drmBlocked: msg.drmBlocked
        });
      }
    };
    port.onMessage.addListener(handler);
    port.postMessage({ type: "PROCESS_STREAM_ID", streamId });
  });

  if (processed.error) {
    const isDrmBlocked =
      processed.drmBlocked ||
      /drm|protected/i.test(processed.error);
    const permissionRequired =
      /invok|gesture|activeTab|permission|allow|not allowed|grant/i.test(processed.error);
    return {
      actors: [],
      error: processed.error,
      drmBlocked: isDrmBlocked,
      permissionRequired,
      noFaces: processed.faces?.length === 0
    };
  }

  if (!processed.faces?.length) {
    return { actors: [], noFaces: true };
  }

  const actors: XraySceneActor[] = [];
  const facesToProcess = processed.faces.slice(0, REKOGNITION_MAX_FACES);

  for (const face of facesToProcess) {
    try {
      const imageBytes = base64ToUint8Array(face.base64);
      const celebs = await recognizeCelebrities(imageBytes);
      const celeb = celebs[0];
      if (!celeb || (celeb.matchConfidence ?? 0) < 70) {
        actors.push({
          name: "Unknown",
          confidence: (celeb?.matchConfidence ?? 0) / 100,
          faceBox: face.box
        });
        continue;
      }

      let character: string | null = null;
      let photoUrl: string | null = null;
      if (titleId && (mediaType === "movie" || mediaType === "tv")) {
        const person = await getPersonCharacter(celeb.name, titleId, mediaType);
        if (person) {
          character = person.character ?? null;
          photoUrl = person.photoUrl ?? null;
        }
      }

      actors.push({
        name: celeb.name,
        character,
        photoUrl,
        confidence: (celeb.matchConfidence ?? 0) / 100,
        faceBox: face.box
      });
    } catch (e) {
      log("Rekognition or TMDB failed for face", e);
      actors.push({
        name: "Unknown",
        confidence: 0,
        faceBox: face.box
      });
    }
  }

  await setXrayCached(netflixTitleId, timestamp, actors);
  return { actors };
}
