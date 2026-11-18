import {useState} from 'react';
import {ExternalLink, Star} from 'lucide-react';
import type {StudioPlaceData} from '../hooks/useStudioPlaceData';
import type {Translations} from '../data/studioData';

interface ReviewsSectionProps {
  placeData: StudioPlaceData;
  t: Translations['reviews'];
}

function ReviewerAvatar({name, photoUri}: {name: string; photoUri?: string}) {
  const [imgFailed, setImgFailed] = useState(false);
  const initials = name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() || '')
    .join('');

  if (photoUri && !imgFailed) {
    return (
      <img
        src={photoUri}
        alt={`${name} Google reviewer avatar`}
        referrerPolicy="no-referrer"
        onError={() => setImgFailed(true)}
        className="w-10 h-10 rounded-full object-cover border border-zinc-200 dark:border-zinc-700 shrink-0"
      />
    );
  }

  return (
    <div
      aria-hidden="true"
      className="w-10 h-10 rounded-full bg-zinc-200 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-100 font-display text-sm font-semibold flex items-center justify-center shrink-0"
    >
      {initials || 'G'}
    </div>
  );
}

export function ReviewsSection({placeData, t}: ReviewsSectionProps) {
  const ratingText = placeData.rating !== null ? placeData.rating.toFixed(1) : '5.0';

  return (
    <section
      id="reviews"
      className="py-20 lg:py-28 border-b border-zinc-200 dark:border-zinc-800/80 bg-zinc-50 dark:bg-zinc-950 transition-colors duration-200"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header & Live Google Maps Summary */}
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

          <div className="flex flex-wrap items-center gap-6 shrink-0">
            <div className="flex items-center gap-3">
              <span className="font-mono text-3xl font-semibold tabular-nums text-zinc-950 dark:text-zinc-50">
                {ratingText}
              </span>
              <div>
                <div className="flex items-center gap-0.5 text-amber-500" aria-label={`${ratingText} out of 5 stars`}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className="w-4 h-4 fill-amber-500 text-amber-500"
                      aria-hidden="true"
                    />
                  ))}
                </div>
                <p className="mt-0.5 text-xs text-zinc-500 dark:text-zinc-400">
                  {placeData.userRatingCount !== null
                    ? `${placeData.userRatingCount.toLocaleString('en-US')} ${t.basedOn}`
                    : t.verifiedSource}
                </p>
              </div>
            </div>

            <a
              href={placeData.googleMapsUri}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-medium rounded-lg border border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-amber-500"
            >
              <span>{t.viewAllGoogle}</span>
              <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
            </a>
          </div>
        </div>

        {/* Live Reviews Grid / Loading Skeleton / Verified Direct Listing Card */}
        {placeData.isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6" aria-busy="true">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 space-y-4 animate-pulse"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-zinc-200 dark:bg-zinc-800" />
                  <div className="space-y-2 flex-1">
                    <div className="h-3.5 w-28 rounded bg-zinc-200 dark:bg-zinc-800" />
                    <div className="h-3 w-20 rounded bg-zinc-200 dark:bg-zinc-800" />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="h-3 w-full rounded bg-zinc-200 dark:bg-zinc-800" />
                  <div className="h-3 w-5/6 rounded bg-zinc-200 dark:bg-zinc-800" />
                  <div className="h-3 w-4/6 rounded bg-zinc-200 dark:bg-zinc-800" />
                </div>
              </div>
            ))}
            <span className="sr-only">{t.loadingText}</span>
          </div>
        ) : placeData.reviews.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
            {placeData.reviews.slice(0, 6).map((review, index) => (
              <article
                key={`${review.authorName}-${index}`}
                className="flex flex-col justify-between rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 transition-colors"
              >
                <div>
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <ReviewerAvatar
                        name={review.authorName}
                        photoUri={review.authorPhotoUri}
                      />
                      <div className="min-w-0">
                        {/* Mandatory Google Maps Places API author attribution link */}
                        <a
                          href={review.authorUri}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block text-sm font-semibold text-zinc-950 dark:text-zinc-50 hover:text-amber-700 dark:hover:text-amber-400 truncate transition-colors"
                        >
                          {review.authorName}
                        </a>
                        <p className="text-xs text-zinc-500 dark:text-zinc-400">
                          Google Review{review.relativeTime ? ` · ${review.relativeTime}` : ''}
                        </p>
                      </div>
                    </div>
                    <span className="font-mono text-xs font-medium tabular-nums text-amber-700 dark:text-amber-400 shrink-0">
                      {review.rating.toFixed(1)} ★
                    </span>
                  </div>

                  <p className="mt-4 text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed">
                    {review.text || 'Verified 5-star rating on Google Maps.'}
                  </p>
                </div>

                <div className="mt-5 pt-4 border-t border-zinc-100 dark:border-zinc-800/80 flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400">
                  <span>{placeData.displayName}</span>
                  <a
                    href={review.authorUri}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-zinc-900 dark:hover:text-zinc-100 underline underline-offset-4 transition-colors"
                  >
                    Google Maps
                  </a>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-8 sm:p-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="max-w-xl">
              <p className="text-xs font-medium text-amber-700 dark:text-amber-400">
                {placeData.displayName} · {t.fallbackHeadline}
              </p>
              <h3 className="mt-2 font-display text-2xl font-semibold text-zinc-950 dark:text-zinc-50">
                {ratingText} / 5.0 Rated Detailing &amp; PPF Studio in Islamabad
              </h3>
              <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                {t.fallbackBody}
              </p>
            </div>
            <a
              href={placeData.googleMapsUri}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-5 py-3 text-sm font-medium rounded-lg bg-zinc-950 dark:bg-amber-500 text-white dark:text-zinc-950 hover:bg-zinc-800 dark:hover:bg-amber-400 transition-colors whitespace-nowrap shrink-0"
            >
              <span>{t.viewAllGoogle}</span>
              <ExternalLink className="w-4 h-4" aria-hidden="true" />
            </a>
          </div>
        )}
      </div>
    </section>
  );
}
