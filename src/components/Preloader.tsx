import {useEffect, useState} from 'react';

export function Preloader() {
  const [progress, setProgress] = useState(0);
  const [fading, setFading] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      setDone(true);
      return;
    }

    const t1 = window.setTimeout(() => setProgress(62), 60);
    const t2 = window.setTimeout(() => setProgress(100), 340);
    const t3 = window.setTimeout(() => setFading(true), 520);
    const t4 = window.setTimeout(() => setDone(true), 780);

    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
      window.clearTimeout(t3);
      window.clearTimeout(t4);
    };
  }, []);

  if (done) return null;

  return (
    <div
      aria-hidden={fading}
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-zinc-950 text-zinc-50 transition-opacity duration-300 ${
        fading ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      <div className="flex flex-col items-center gap-5 px-6">
        {/* Precision Automotive Shield Mark */}
        <svg
          width="48"
          height="48"
          viewBox="0 0 48 48"
          fill="none"
          aria-hidden="true"
          className="text-amber-500"
        >
          <path
            d="M24 4L40 10.5V22.5C40 33.1 33.1 41.2 24 44C14.9 41.2 8 33.1 8 22.5V10.5L24 4Z"
            stroke="currentColor"
            strokeWidth="2"
          />
          <path
            d="M15 28L24 14L33 28H27.8L24 21.8L20.2 28H15Z"
            fill="currentColor"
          />
        </svg>

        <div className="text-center">
          <p className="font-display text-lg font-semibold tracking-tight text-zinc-50">
            Advance Car Studio
          </p>
          <p className="mt-1 text-xs text-zinc-400">
            Islamabad · 9H Ceramic &amp; Paint Correction
          </p>
        </div>

        <div className="w-48 h-0.5 bg-zinc-800 overflow-hidden rounded-full">
          <div
            className="h-full bg-amber-500 origin-left transition-transform duration-300 ease-out"
            style={{transform: `scaleX(${progress / 100})`}}
          />
        </div>
      </div>
    </div>
  );
}
