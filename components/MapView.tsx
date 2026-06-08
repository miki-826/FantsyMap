"use client";

import { useMemo } from "react";
import L from "leaflet";
import { MapContainer, Marker, TileLayer, useMapEvents } from "react-leaflet";
import { getThemeStyle } from "@/lib/imageTheme";
import { LEVEL_LABELS, DEFAULT_CENTER, DEFAULT_ZOOM } from "@/lib/constants";
import type { FantasySpot } from "@/lib/types";

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function buildIcon(spot: FantasySpot, selected: boolean): L.DivIcon {
  const style = getThemeStyle(spot.image_theme);
  const lvLabel = LEVEL_LABELS[spot.level] ?? "噂";
  const html = `
    <div class="fantasy-card ${selected ? "selected" : ""}">
      <div class="fantasy-card__image" style="background:${style.gradient}">
        <span class="fantasy-card__lv">Lv.${spot.level} ${lvLabel}</span>
        <span>${style.icon}</span>
      </div>
      <div class="fantasy-card__body">
        <div class="fantasy-card__title">${escapeHtml(spot.title)}</div>
        <div class="fantasy-card__sub">${escapeHtml(style.label)}</div>
      </div>
    </div>`;
  return L.divIcon({
    html,
    className: "fantasy-marker",
    iconSize: [124, 92],
    iconAnchor: [62, 92],
  });
}

function ClickCatcher({ onMapClick }: { onMapClick: (lat: number, lng: number) => void }) {
  useMapEvents({
    click(e) {
      onMapClick(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

export default function MapView({
  spots,
  selectedId,
  onSelect,
  onMapClick,
}: {
  spots: FantasySpot[];
  selectedId: string | null;
  onSelect: (spot: FantasySpot) => void;
  onMapClick: (lat: number, lng: number) => void;
}) {
  const markers = useMemo(
    () =>
      spots.map((spot) => (
        <Marker
          key={spot.id}
          position={[spot.latitude, spot.longitude]}
          icon={buildIcon(spot, spot.id === selectedId)}
          zIndexOffset={spot.id === selectedId ? 1000 : 0}
          eventHandlers={{ click: () => onSelect(spot) }}
        />
      )),
    [spots, selectedId, onSelect],
  );

  return (
    <MapContainer
      center={DEFAULT_CENTER}
      zoom={DEFAULT_ZOOM}
      className="h-full w-full"
      scrollWheelZoom
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <ClickCatcher onMapClick={onMapClick} />
      {markers}
    </MapContainer>
  );
}
