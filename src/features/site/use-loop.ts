"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Steps through `durations` (ms per step) in a loop while the element is on screen.
 * Under prefers-reduced-motion it holds the last step, which shows the finished state.
 */
export function useLoop<T extends HTMLElement>(durations: number[]) {
  const ref = useRef<T>(null);
  const [step, setStep] = useState(0);
  const [visible, setVisible] = useState(false);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { threshold: 0.35 });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!visible || reduced) return;
    const timer = window.setTimeout(() => setStep((s) => (s + 1) % durations.length), durations[step]);
    return () => window.clearTimeout(timer);
  }, [visible, reduced, step, durations]);

  return { ref, step: reduced ? durations.length - 1 : step };
}
