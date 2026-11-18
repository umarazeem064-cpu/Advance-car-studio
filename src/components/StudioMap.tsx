import {useState} from 'react';
import {
  AdvancedMarker,
  APILoadingStatus,
  InfoWindow,
  Map as GoogleMap,
  Pin,
  useAdvancedMarkerRef,
  useApiLoadingStatus,
} from '@vis.gl/react-google-maps';
import {ExternalLink, MapPin} from 'lucide-react';
import type {StudioPlaceData} from '../hooks/useStudioPlaceData';

interface StudioMapProps {
  hasApiKey: boolean;
  placeData: StudioPlaceData;
  directionsLabel: string;
}

function InteractiveGoogleMapCanvas({
  placeData,
  directionsLabel,
}: {
  placeData: StudioPlaceData;
  directionsLabel: string;
}) {
  const status = useApiLoadingStatus();
  const [markerRef, marker] = useAdvancedMarkerRef();
  const [infoOpen, setInfoOpen] = useState(true);

  if (
    status === APILoadingStatus.FAILED ||
    status === APILoadingStatus.AUTH_FAILURE
  ) {
    return (
      <StaticMapFallback
        placeData={placeData}
        directionsLabel={directionsLabel}
      />
    );
  }

  return (
    <div className="relative w-full h-[400px] sm:h-[440px] rounded-xl overflow-hidden border border-zinc-200 dark:border-zinc-800 bg-zinc-900">
      <GoogleMap
        defaultCenter={placeData.location}
        center={placeData.location}
        defaultZoom={16}
        mapId="DEMO_MAP_ID"
        gestureHandling="cooperative"
        internalUsageAttributionIds={['gmp_mcp_codeassist_v1_aistudio']}
        style={{width: '100%', height: '100%'}}
      >
        <AdvancedMarker
          ref={markerRef}
          position={placeData.location}
          title={placeData.displayName}
          onClick={() => setInfoOpen((prev) => !prev)}
        >
          <Pin
            background="#d97706"
            borderColor="#78350f"
            glyphColor="#ffffff"
            scale={1.2}
          />
        </AdvancedMarker>

        {infoOpen && marker && (
          <InfoWindow
            anchor={marker}
            maxWidth={270}
            onCloseClick={() => setInfoOpen(false)}
          >
            <div className="p-1 text-zinc-900">
              <p className="font-display text-sm font-bold text-zinc-950">
                {placeData.displayName}
              </p>
              <p className="mt-1 text-xs text-zinc-600 leading-snug">
                {placeData.formattedAddress}
              </p>
              <div className="mt-2 flex items-center justify-between gap-2 text-xs">
                <span className="font-mono font-semibold text-amber-700">
                  {(placeData.rating ?? 5.0).toFixed(1)} ★
                </span>
                <a
                  href={placeData.googleMapsUri}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-zinc-950 underline underline-offset-2 hover:text-amber-700"
                >
                  {directionsLabel}
                </a>
              </div>
            </div>
          </InfoWindow>
        )}
      </GoogleMap>
    </div>
  );
}

function StaticMapFallback({
  placeData,
  directionsLabel,
}: {
  placeData: StudioPlaceData;
  directionsLabel: string;
}) {
  return (
    <div className="relative w-full h-[400px] sm:h-[440px] rounded-xl overflow-hidden border border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-900 flex flex-col items-center justify-center p-8 text-center">
      <div className="w-12 h-12 rounded-full bg-amber-500/15 text-amber-700 dark:text-amber-400 flex items-center justify-center mb-4">
        <MapPin className="w-6 h-6" aria-hidden="true" />
      </div>
      <h3 className="font-display text-xl font-semibold text-zinc-950 dark:text-zinc-50">
        {placeData.displayName}
      </h3>
      <p className="mt-2 max-w-md text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
        {placeData.formattedAddress}
      </p>
      <p className="mt-2 font-mono text-xs tabular-nums text-zinc-500 dark:text-zinc-500">
        {placeData.location.lat.toFixed(6)}, {placeData.location.lng.toFixed(6)}
      </p>
      <a
        href={placeData.googleMapsUri}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-5 inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium rounded-lg bg-zinc-950 dark:bg-amber-500 text-white dark:text-zinc-950 hover:bg-zinc-800 dark:hover:bg-amber-400 transition-colors"
      >
        <span>{directionsLabel}</span>
        <ExternalLink className="w-4 h-4" aria-hidden="true" />
      </a>
    </div>
  );
}

export function StudioMap({
  hasApiKey,
  placeData,
  directionsLabel,
}: StudioMapProps) {
  if (!hasApiKey) {
    return (
      <StaticMapFallback
        placeData={placeData}
        directionsLabel={directionsLabel}
      />
    );
  }

  return (
    <InteractiveGoogleMapCanvas
      placeData={placeData}
      directionsLabel={directionsLabel}
    />
  );
}
