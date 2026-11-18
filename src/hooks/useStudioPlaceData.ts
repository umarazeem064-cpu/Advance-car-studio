import {useEffect, useState} from 'react';
import {useMapsLibrary} from '@vis.gl/react-google-maps';
import {STUDIO_GROUNDED_INFO} from '../data/studioData';

export interface LiveGoogleReview {
  authorName: string;
  authorUri: string;
  authorPhotoUri?: string;
  rating: number;
  relativeTime: string;
  text: string;
}

export interface StudioPlaceData {
  placeId: string | null;
  displayName: string;
  formattedAddress: string;
  location: {lat: number; lng: number};
  rating: number | null;
  userRatingCount: number | null;
  phoneNumber: string;
  whatsappDigits: string;
  weekdayHours: string[];
  googleMapsUri: string;
  reviews: LiveGoogleReview[];
  isLoading: boolean;
  isLiveSynced: boolean;
}

interface PlaceReviewLike {
  rating?: number | null;
  relativePublishTimeDescription?: string | null;
  text?: string | null;
  authorAttribution?: {
    displayName?: string | null;
    uri?: string | null;
    photoURI?: string | null;
  } | null;
}

interface PlaceResultLike {
  id?: string | null;
  displayName?: string | null;
  formattedAddress?: string | null;
  location?: {
    lat: () => number;
    lng: () => number;
  } | null;
  rating?: number | null;
  userRatingCount?: number | null;
  regularOpeningHours?: {
    weekdayDescriptions?: string[] | null;
  } | null;
  nationalPhoneNumber?: string | null;
  internationalPhoneNumber?: string | null;
  googleMapsURI?: string | null;
  reviews?: PlaceReviewLike[] | null;
}

interface PlacesLibraryLike {
  Place: {
    searchByText: (request: {
      textQuery: string;
      fields: string[];
      locationBias?: {lat: number; lng: number};
      maxResultCount?: number;
      language?: string;
      region?: string;
      internalUsageAttributionIds?: string[];
    }) => Promise<{places?: PlaceResultLike[]}>;
  };
}

function normalizeWhatsAppDigits(rawPhone: string): string {
  const digits = rawPhone.replace(/\D/g, '');
  if (!digits) return STUDIO_GROUNDED_INFO.whatsappDigits;
  if (digits.startsWith('0') && digits.length === 11) {
    return `92${digits.slice(1)}`;
  }
  return digits;
}

function isQuotaError(err: unknown): boolean {
  const text = err instanceof Error ? err.message : String(err);
  return (
    text.includes('OVER_QUERY_LIMIT') ||
    text.includes('RESOURCE_EXHAUSTED') ||
    text.includes('QuotaExceeded') ||
    text.includes('OverQuota') ||
    text.includes('429')
  );
}

export function useStudioPlaceData(hasApiKey: boolean): StudioPlaceData {
  const placesLib = useMapsLibrary('places') as unknown as PlacesLibraryLike | null;

  const [data, setData] = useState<StudioPlaceData>({
    placeId: null,
    displayName: STUDIO_GROUNDED_INFO.name,
    formattedAddress: STUDIO_GROUNDED_INFO.address,
    location: STUDIO_GROUNDED_INFO.coordinates,
    rating: null,
    userRatingCount: null,
    phoneNumber: STUDIO_GROUNDED_INFO.phoneDisplay,
    whatsappDigits: STUDIO_GROUNDED_INFO.whatsappDigits,
    weekdayHours: [...STUDIO_GROUNDED_INFO.defaultWeekdayHours],
    googleMapsUri: STUDIO_GROUNDED_INFO.googleMapsUrl,
    reviews: [],
    isLoading: hasApiKey,
    isLiveSynced: false,
  });

  useEffect(() => {
    if (!hasApiKey) {
      setData((prev) => ({...prev, isLoading: false}));
      return;
    }
    if (!placesLib?.Place?.searchByText) return;

    const activePlacesLib = placesLib;
    let cancelled = false;

    async function fetchStudioDetails() {
      try {
        // Places API (New): Place.searchByText with locationBias around Advance Car Studio
        const response = await activePlacesLib.Place.searchByText({
          textQuery: 'Advance car studio Islamabad',
          fields: [
            'id',
            'displayName',
            'formattedAddress',
            'location',
            'rating',
            'userRatingCount',
            'regularOpeningHours',
            'nationalPhoneNumber',
            'internationalPhoneNumber',
            'googleMapsURI',
            'reviews',
          ],
          locationBias: STUDIO_GROUNDED_INFO.coordinates,
          maxResultCount: 1,
          language: 'en',
          region: 'pk',
          internalUsageAttributionIds: ['gmp_mcp_codeassist_v1_aistudio'],
        });

        const place = response?.places?.[0];
        if (!place || cancelled) {
          if (!cancelled) {
            setData((prev) => ({...prev, isLoading: false}));
          }
          return;
        }

        const lat = place.location?.lat?.() ?? STUDIO_GROUNDED_INFO.coordinates.lat;
        const lng = place.location?.lng?.() ?? STUDIO_GROUNDED_INFO.coordinates.lng;

        const livePhone =
          place.internationalPhoneNumber ||
          place.nationalPhoneNumber ||
          STUDIO_GROUNDED_INFO.phoneDisplay;

        const liveReviews: LiveGoogleReview[] = (place.reviews ?? [])
          .filter((rev: PlaceReviewLike) => Boolean(rev.authorAttribution?.displayName))
          .map((rev: PlaceReviewLike) => ({
            authorName: rev.authorAttribution?.displayName || 'Google Reviewer',
            authorUri:
              rev.authorAttribution?.uri ||
              place.googleMapsURI ||
              STUDIO_GROUNDED_INFO.googleMapsUrl,
            authorPhotoUri: rev.authorAttribution?.photoURI || undefined,
            rating: rev.rating ?? 5,
            relativeTime: rev.relativePublishTimeDescription || '',
            text: rev.text || '',
          }));

        const weekdayDescriptions =
          place.regularOpeningHours?.weekdayDescriptions &&
          place.regularOpeningHours.weekdayDescriptions.length > 0
            ? place.regularOpeningHours.weekdayDescriptions
            : [...STUDIO_GROUNDED_INFO.defaultWeekdayHours];

        if (!cancelled) {
          setData({
            placeId: place.id || null,
            displayName: place.displayName || STUDIO_GROUNDED_INFO.name,
            formattedAddress: place.formattedAddress || STUDIO_GROUNDED_INFO.address,
            location: {lat, lng},
            rating: typeof place.rating === 'number' ? place.rating : null,
            userRatingCount:
              typeof place.userRatingCount === 'number' ? place.userRatingCount : null,
            phoneNumber: livePhone,
            whatsappDigits: normalizeWhatsAppDigits(livePhone),
            weekdayHours: weekdayDescriptions,
            googleMapsUri: place.googleMapsURI || STUDIO_GROUNDED_INFO.googleMapsUrl,
            reviews: liveReviews,
            isLoading: false,
            isLiveSynced: true,
          });
        }
      } catch (err) {
        if (isQuotaError(err)) {
          window.dispatchEvent(new CustomEvent('gmp-quota-exceeded'));
        }
        if (!cancelled) {
          setData((prev) => ({...prev, isLoading: false}));
        }
      }
    }

    void fetchStudioDetails();

    return () => {
      cancelled = true;
    };
  }, [placesLib, hasApiKey]);

  return data;
}
