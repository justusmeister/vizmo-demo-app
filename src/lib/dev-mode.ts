"use client";

import { useSyncExternalStore } from "react";

// Presenter-only switch: clicking the logo hides or shows development areas (e.g. the
// "Entwicklung" nav section). Remembered per browser; defaults to visible.

const KEY = "vizmo-dev-visible";
const EVENT = "vizmo-dev-mode";

function read() {
  try {
    return window.localStorage.getItem(KEY) !== "0";
  } catch {
    return true;
  }
}

function subscribe(callback: () => void) {
  window.addEventListener(EVENT, callback);
  window.addEventListener("storage", callback);
  return () => {
    window.removeEventListener(EVENT, callback);
    window.removeEventListener("storage", callback);
  };
}

export function useDevVisible() {
  return useSyncExternalStore(subscribe, read, () => false);
}

export function toggleDevVisible() {
  try {
    window.localStorage.setItem(KEY, read() ? "0" : "1");
  } catch {
    // Storage unavailable: the toggle simply won't persist.
  }
  window.dispatchEvent(new Event(EVENT));
}
