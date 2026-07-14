"use client";

import { useEffect, useState } from "react";

/**
 * Eases a number from 0 up to `target` once `active` becomes true.
 * Dependency-free (requestAnimationFrame) so it adds nothing to the bundle.
 */
export function useCountUp(target: number, active: boolean, duration = 1.2) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!active) {
      setValue(0);
      return;
    }
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const progress = Math.min((now - start) / (duration * 1000), 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(target * eased));
      if (progress < 1) {
        raf = requestAnimationFrame(tick);
      }
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, active, duration]);

  return value;
}

/**
 * Typewriter that cycles through `words`, typing then deleting each in turn.
 */
export function useTypewriter(words: string[], typingSpeed = 85, deletingSpeed = 40, pause = 1400) {
  const safeWords = words.length ? words : [""];
  const [text, setText] = useState("");
  const [wordIndex, setWordIndex] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const current = safeWords[wordIndex % safeWords.length];
    let timeout: ReturnType<typeof setTimeout>;

    if (!deleting && text === current) {
      timeout = setTimeout(() => setDeleting(true), pause);
    } else if (deleting && text === "") {
      setDeleting(false);
      setWordIndex((index) => (index + 1) % safeWords.length);
    } else {
      timeout = setTimeout(
        () => {
          setText((prev) =>
            deleting ? current.slice(0, prev.length - 1) : current.slice(0, prev.length + 1),
          );
        },
        deleting ? deletingSpeed : typingSpeed,
      );
    }

    return () => clearTimeout(timeout);
  }, [text, deleting, wordIndex, safeWords, typingSpeed, deletingSpeed, pause]);

  return text;
}
