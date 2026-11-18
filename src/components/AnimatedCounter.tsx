import {useEffect, useRef, useState} from 'react';

interface AnimatedCounterProps {
  target: number;
  suffix?: string;
  decimals?: number;
  durationMs?: number;
}

export function AnimatedCounter({
  target,
  suffix = '',
  decimals = 0,
  durationMs = 1100,
}: AnimatedCounterProps) {
  const [displayValue, setDisplayValue] = useState<number>(target);
  const ref = useRef<HTMLSpanElement | null>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const prefersReduced =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReduced) {
      setDisplayValue(target);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry?.isIntersecting || hasAnimated.current) return;
        hasAnimated.current = true;

        const startTime = performance.now();
        const step = (now: number) => {
          const elapsed = now - startTime;
          const t = Math.min(1, elapsed / durationMs);
          // Smooth ease-out cubic
          const eased = 1 - Math.pow(1 - t, 3);
          setDisplayValue(target * eased);
          if (t < 1) {
            requestAnimationFrame(step);
          } else {
            setDisplayValue(target);
          }
        };
        requestAnimationFrame(step);
        observer.disconnect();
      },
      {threshold: 0.35},
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [target, durationMs]);

  const formatted =
    decimals > 0
      ? displayValue.toFixed(decimals)
      : Math.round(displayValue).toLocaleString('en-US');

  return (
    <span ref={ref} className="font-mono tabular-nums">
      {formatted}
      {suffix}
    </span>
  );
}
