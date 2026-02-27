import { log } from "../shared/logger";
import { initNetflixObserver } from "./netflix/observer";
import { initXrayWatch } from "./netflix/xray-watch";

const init = async () => {
  try {
    await initNetflixObserver();
  } catch (err) {
    log("initNetflixObserver failed", err);
  }
  try {
    await initXrayWatch();
  } catch (err) {
    log("initXrayWatch failed", err);
  }
};

if (document.readyState === "loading") {
  document.addEventListener(
    "DOMContentLoaded",
    () => {
      init().catch((err) => log("Init failed", err));
    },
    { once: true }
  );
} else {
  init().catch((err) => log("Init failed", err));
}
