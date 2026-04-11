"use client";

import {
  Circle,
  CircleMarker,
  MapContainer,
  TileLayer,
  useMapEvents,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";

function MapClickLayer({
  onPick,
}: {
  onPick: (lat: number, lng: number) => void;
}) {
  useMapEvents({
    click(e) {
      onPick(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

type Props = {
  centerLat: number;
  centerLng: number;
  pinLat: number;
  pinLng: number;
  radiusM: number;
  onPinChange: (lat: number, lng: number) => void;
};

export function AnalyzePinMap({
  centerLat,
  centerLng,
  pinLat,
  pinLng,
  radiusM,
  onPinChange,
}: Props) {
  return (
    <div className="overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--muted-bg)]/40 [&_.leaflet-container]:h-[min(42vh,280px)] [&_.leaflet-container]:min-h-[220px] [&_.leaflet-container]:w-full [&_.leaflet-container]:rounded-xl">
      <MapContainer
        key={`${centerLat.toFixed(4)}-${centerLng.toFixed(4)}`}
        center={[centerLat, centerLng]}
        zoom={14}
        className="z-0"
        scrollWheelZoom
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapClickLayer onPick={onPinChange} />
        <Circle
          center={[pinLat, pinLng]}
          radius={radiusM}
          pathOptions={{
            color: "#4f46e5",
            fillColor: "#6366f1",
            fillOpacity: 0.12,
            weight: 2,
          }}
        />
        <CircleMarker
          center={[pinLat, pinLng]}
          radius={9}
          pathOptions={{
            color: "#4f46e5",
            fillColor: "#ffffff",
            weight: 3,
          }}
        />
      </MapContainer>
      <p className="border-t border-[var(--border)] px-3 py-2 text-[11px] text-[var(--muted)]">
        Pulsa en el mapa para colocar el pin. El círculo es el radio de competencia OSM
        (sin Google Places).
      </p>
    </div>
  );
}
