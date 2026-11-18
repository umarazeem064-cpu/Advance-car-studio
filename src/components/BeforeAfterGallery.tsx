import {useState} from 'react';
import {MoveHorizontal} from 'lucide-react';
import {STUDIO_IMAGES, type Translations} from '../data/studioData';
import {SafeImage} from './SafeImage';

interface BeforeAfterGalleryProps {
  t: Translations['gallery'];
}

export function BeforeAfterGallery({t}: BeforeAfterGalleryProps) {
  const [sliderPos, setSliderPos] = useState(52);
  const [viewMode, setViewMode] = useState<'slider' | 'side'>('slider');

  return (
    <section
      id="gallery"
      className="py-20 lg:py-28 border-b border-zinc-200 dark:border-zinc-800/80 bg-white dark:bg-zinc-950 transition-colors duration-200"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-12">
          <div className="max-w-2xl">
            <p className="text-xs font-medium tracking-wide text-amber-700 dark:text-amber-400">
              {t.eyebrow}
            </p>
            <h2 className="mt-2 font-display text-3xl sm:text-4xl font-bold tracking-tight text-zinc-950 dark:text-zinc-50 [text-wrap:balance]">
              {t.title}
            </h2>
            <p className="mt-3 text-base text-zinc-600 dark:text-zinc-400 leading-relaxed">
              {t.subtitle}
            </p>
          </div>

          {/* Interactive View Switcher (Functional Segmented Buttons) */}
          <div
            role="tablist"
            aria-label="Comparison layout mode"
            className="inline-flex items-center p-1 rounded-lg bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 self-start lg:self-end shrink-0"
          >
            <button
              type="button"
              role="tab"
              aria-selected={viewMode === 'slider'}
              onClick={() => setViewMode('slider')}
              className={`px-3.5 py-2 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-amber-500 ${
                viewMode === 'slider'
                  ? 'bg-white dark:bg-zinc-800 text-zinc-950 dark:text-zinc-50 shadow-xs'
                  : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-zinc-100'
              }`}
            >
              {t.modeSlider}
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={viewMode === 'side'}
              onClick={() => setViewMode('side')}
              className={`px-3.5 py-2 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-amber-500 ${
                viewMode === 'side'
                  ? 'bg-white dark:bg-zinc-800 text-zinc-950 dark:text-zinc-50 shadow-xs'
                  : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-zinc-100'
              }`}
            >
              {t.modeSideBySide}
            </button>
          </div>
        </div>

        {/* Main Interactive Paint Transformation Viewer */}
        {viewMode === 'slider' ? (
          <div className="space-y-4">
            <div
              dir="ltr"
              className="relative w-full aspect-[4/3] sm:aspect-[16/9] max-h-[600px] overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-900 select-none"
            >
              {/* After Image (Full Base Layer) */}
              <SafeImage
                src={STUDIO_IMAGES.afterCeramic}
                alt="After multi-stage paint correction and 9H ceramic coating with mirror gloss and hydrophobic water beading"
                fallbackTitle="After — 9H Ceramic Gloss"
                className="w-full h-full object-cover"
              />

              {/* Before Image (Clipped Overlay Layer) */}
              <div
                className="absolute inset-0 overflow-hidden"
                style={{clipPath: `inset(0 ${100 - sliderPos}% 0 0)`}}
              >
                <SafeImage
                  src={STUDIO_IMAGES.beforeSwirls}
                  alt="Before paint correction showing heavy circular swirl marks, micro-scratches, and dull oxidation under LED inspection light"
                  fallbackTitle="Before — Swirl Marks & Oxidation"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Subtle Top Contrast Scrim for Corner Labels */}
              <div className="pointer-events-none absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-black/70 via-black/30 to-transparent flex items-start justify-between px-4 sm:px-6 pt-4">
                <span className="text-xs sm:text-sm font-medium text-zinc-100 tracking-tight">
                  {t.beforeLabel}
                </span>
                <span className="text-xs sm:text-sm font-medium text-amber-300 tracking-tight">
                  {t.afterLabel}
                </span>
              </div>

              {/* Vertical Divider Handle */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-y-0 w-0.5 bg-white/90 shadow-md"
                style={{left: `${sliderPos}%`}}
              >
                <div className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-zinc-950/90 border border-white/80 text-white flex items-center justify-center shadow-lg">
                  <MoveHorizontal className="w-5 h-5" />
                </div>
              </div>

              {/* Full-Surface Accessible Range Input for Pointer, Touch, & Keyboard Control */}
              <input
                type="range"
                min={5}
                max={95}
                value={sliderPos}
                onChange={(e) => setSliderPos(Number(e.target.value))}
                aria-label="Before and after paint correction comparison slider"
                className="ba-range-input absolute inset-0 w-full h-full z-10 m-0 focus-visible:outline-2 focus-visible:outline-amber-500"
              />
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-zinc-500 dark:text-zinc-400">
              <span>{t.dragHint}</span>
              <span className="font-mono tabular-nums">
                95%+ Swirl Removal · 115° Hydrophobic Contact Angle · 9H SiO2 Bond
              </span>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
            <figure className="flex flex-col rounded-xl overflow-hidden border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900">
              <div className="aspect-[4/3] w-full overflow-hidden bg-zinc-900">
                <SafeImage
                  src={STUDIO_IMAGES.beforeSwirls}
                  alt="Before detailing showing heavy swirl marks and dull clear coat under swirl-finder lamp"
                  fallbackTitle="Before — Swirl Marks"
                  className="w-full h-full object-cover"
                />
              </div>
              <figcaption className="p-5 flex items-center justify-between gap-4 border-t border-zinc-200 dark:border-zinc-800">
                <div>
                  <p className="font-display text-base font-semibold text-zinc-950 dark:text-zinc-50">
                    {t.beforeLabel}
                  </p>
                  <p className="mt-1 text-xs text-zinc-600 dark:text-zinc-400">
                    Wash-induced spiderwebbing, oxidation haze, and hard water etching
                  </p>
                </div>
                <span className="font-mono text-xs tabular-nums text-zinc-500 dark:text-zinc-400 shrink-0">
                  Stage 0
                </span>
              </figcaption>
            </figure>

            <figure className="flex flex-col rounded-xl overflow-hidden border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900">
              <div className="aspect-[4/3] w-full overflow-hidden bg-zinc-900">
                <SafeImage
                  src={STUDIO_IMAGES.afterCeramic}
                  alt="After multi-stage correction and 9H ceramic coating with deep wet mirror clarity and tight water beading"
                  fallbackTitle="After — 9H Mirror Finish"
                  className="w-full h-full object-cover"
                />
              </div>
              <figcaption className="p-5 flex items-center justify-between gap-4 border-t border-zinc-200 dark:border-zinc-800">
                <div>
                  <p className="font-display text-base font-semibold text-zinc-950 dark:text-zinc-50">
                    {t.afterLabel}
                  </p>
                  <p className="mt-1 text-xs text-zinc-600 dark:text-zinc-400">
                    3-stage machine refinement sealed under dual-layer 9H ceramic
                  </p>
                </div>
                <span className="font-mono text-xs tabular-nums text-amber-700 dark:text-amber-400 shrink-0">
                  9H Sealed
                </span>
              </figcaption>
            </figure>
          </div>
        )}

        {/* Asymmetric Secondary Studio Bay Documentation */}
        <div className="mt-12 pt-10 border-t border-zinc-200 dark:border-zinc-800/80">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-display text-xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50">
              {t.studioHighlightsTitle}
            </h3>
            <span className="text-xs text-zinc-500 dark:text-zinc-400 hidden sm:inline">
              Advance Car Studio · Police Foundation, Islamabad
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            <article className="lg:col-span-7 flex flex-col rounded-xl overflow-hidden border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/70">
              <div className="aspect-[16/10] w-full overflow-hidden bg-zinc-900">
                <SafeImage
                  src={STUDIO_IMAGES.ceramicCraft}
                  alt="Technician applying 9H ceramic coating in controlled LED detailing bay"
                  fallbackTitle="9H Ceramic Bonding"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">
                    01 · Ceramic Bonding Bay · Infrared Cured
                  </p>
                  <h4 className="mt-1.5 font-display text-lg font-semibold text-zinc-950 dark:text-zinc-50">
                    Controlled-Environment 9H SiO2 Layering
                  </h4>
                  <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                    Applied panel by panel under high-CRI inspection tubes and cured inside
                    dust-filtered bays to lock in deep chemical resistance against UV, bird
                    droppings, and monsoon road film.
                  </p>
                </div>
              </div>
            </article>

            <article className="lg:col-span-5 flex flex-col rounded-xl overflow-hidden border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/70">
              <div className="aspect-[4/3] lg:aspect-[16/14] w-full overflow-hidden bg-zinc-900">
                <SafeImage
                  src={STUDIO_IMAGES.interiorRestored}
                  alt="Restored luxury Nappa leather cabin with factory satin-matte finish"
                  fallbackTitle="Interior Restoration"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">
                    02 · Cabin Restoration · Factory Satin Matte
                  </p>
                  <h4 className="mt-1.5 font-display text-lg font-semibold text-zinc-950 dark:text-zinc-50">
                    Deep Steam Sanitation &amp; Nappa Leather Care
                  </h4>
                  <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                    Zero greasy silicone shine. We restore stitched leather, Alcantara, and piano
                    trim to clean factory-matte suppleness.
                  </p>
                </div>
              </div>
            </article>
          </div>
        </div>
      </div>
    </section>
  );
}
