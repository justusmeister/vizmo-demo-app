import { useSyncExternalStore } from "react";

const subscribe = () => () => {};

/** False during static rendering and hydration, true afterwards. For clock-dependent output. */
export function useMounted() {
  return useSyncExternalStore(subscribe, () => true, () => false);
}
