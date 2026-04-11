"use client";

import { GoogleMap, InfoWindow, useJsApiLoader, Circle } from "@react-google-maps/api";
import { useCallback, useState } from "react";
import { CircleMarker, MapContainer, Popup, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";

import {
  VALENCIA_DISTRICTS,
  VALENCIA_MAP_CENTER,
  districtHeatColor,
  type ValenciaDistrict,
} from "@/lib/marketing/valenciaHeatmapModel";

const mapContainerClass =
  "h-[min(42vh,340px)] min-h-[260px] w-full overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--muted-bg)]";

function GoogleValenciaMap({ apiKey }: { apiKey: string }) {
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: apiKey,
    id: "openspot-google-maps",
  });
  const [sel, setSel] = useState<ValenciaDistrict | null>(null);

  const onMapClick = useCallback(() => setSel(null), []);

  if (loadError) {
    return <LeafletValenciaMap reason="No se pudo cargar Google Maps." />;
  }
  if (!isLoaded) {
    return (
      <div className={`${mapContainerClass} flex items-center justify-center text-[13px] text-[var(--muted)]`}>
        Cargando mapa…
      </div>
    );
  }

  return (
    <div className={mapContainerClass}>
      <GoogleMap
        mapContainerStyle={{ width: "100%", height: "100%" }}
        center={VALENCIA_MAP_CENTER}
        zoom={12}
        onClick={onMapClick}
        options={{
          streetViewControl: false,
          mapTypeControl: false,
          fullscreenControl: false,
          clickableIcons: false,
          styles: [
            { featureType: "poi", elementType: "labels", stylers: [{ visibility: "off" }] },
          ],
        }}
      >
        {VALENCIA_DISTRICTS.map((d) => (
          <Circle
            key={d.id}
            center={{ lat: d.lat, lng: d.lng }}
            radius={380 + d.v * 420}
            onClick={() => setSel(d)}
            options={{
              fillColor: districtHeatColor(d.v),
              fillOpacity: 0.4,
              strokeColor: "#4338ca",
              strokeOpacity: 0.9,
              strokeWeight: 1,
            }}
          />
        ))}
        {sel ? (
          <InfoWindow
            position={{ lat: sel.lat, lng: sel.lng }}
            onCloseClick={() => setSel(null)}
          >
            <div className="max-w-[220px] p-1 text-[13px] text-gray-900">
              <p className="font-semibold">{sel.label}</p>
              <p className="mt-1 text-[12px] leading-snug text-gray-600">{sel.blurb}</p>
              <p className="mt-2 font-mono text-[11px] text-indigo-700">
                índice modelo {Math.round(sel.v * 100)}
              </p>
            </div>
          </InfoWindow>
        ) : null}
      </GoogleMap>
    </div>
  );
}

function LeafletValenciaMap({ reason }: { reason?: string }) {
  const center: [number, number] = [VALENCIA_MAP_CENTER.lat, VALENCIA_MAP_CENTER.lng];

  return (
    <div className="relative">
      {reason ? (
        <p className="mb-2 text-[11px] text-[var(--muted)]">{reason}</p>
      ) : null}
      <div className={`${mapContainerClass} [&_.leaflet-container]:h-full [&_.leaflet-container]:w-full [&_.leaflet-container]:rounded-xl`}>
        <MapContainer
          center={center}
          zoom={12}
          className="h-full w-full rounded-xl"
          scrollWheelZoom={false}
          attributionControl
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {VALENCIA_DISTRICTS.map((d) => (
            <CircleMarker
              key={d.id}
              center={[d.lat, d.lng]}
              radius={9 + d.v * 16}
              pathOptions={{
                color: "#4338ca",
                fillColor: districtHeatColor(d.v),
                fillOpacity: 0.55,
                weight: 2,
              }}
            >
              <Popup>
                <div className="min-w-[180px] text-[13px]">
                  <p className="font-semibold">{d.label}</p>
                  <p className="mt-1 text-[12px] text-gray-600">{d.blurb}</p>
                  <p className="mt-1 font-mono text-[11px] text-indigo-700">
                    índice {Math.round(d.v * 100)}
                  </p>
                </div>
              </Popup>
            </CircleMarker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
}

export default function ValenciaMapCanvas() {
  const key = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY?.trim();
  if (key) return <GoogleValenciaMap apiKey={key} />;
  return <LeafletValenciaMap />;
}
