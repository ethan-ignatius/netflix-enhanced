/**
 * Check if the extension context is still valid (e.g. extension not reloaded, page not torn down).
 * Use before chrome.runtime / chrome.storage in content scripts to avoid "Extension context invalidated".
 */
export function isExtensionContextValid(): boolean {
  try {
    return typeof chrome !== "undefined" && !!chrome.runtime?.id;
  } catch {
    return false;
  }
}

export function isContextInvalidatedError(err: unknown): boolean {
  return err instanceof Error && err.message?.includes("Extension context invalidated");
}
