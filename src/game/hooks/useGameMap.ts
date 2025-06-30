import { useState, useEffect } from "react";
import { LeafletEvent, Map as LeafletMap } from "leaflet";

import { getPaddedBounds } from "../components/map/map-helpers/utils";
import { waypointData } from "~/data/map";
import { DEFAULT_ZOOM } from "../components/map/map-helpers/constants";

const paddedBounds = getPaddedBounds(
  waypointData.bounds.topLeft,
  waypointData.bounds.bottomRight
);

export const useGameMap = () => {
  const [map, setMap] = useState<LeafletMap | null>(null);
  const [zoom, setZoom] = useState(DEFAULT_ZOOM);
  const [minZoom, setMinZoom] = useState<number>();

  useEffect(() => {
    if (map && !minZoom) {
      map.fitBounds(paddedBounds);
      const zoom = map.getZoom();
      setMinZoom(zoom);
      map.setMinZoom(zoom);
    }
  }, [map, minZoom]);

  useEffect(() => {
    if (!map) return;

    const zoomCallback = (event: LeafletEvent) => setZoom(event.target._zoom);
    map.on("zoom", zoomCallback);

    return () => {
      map.off("zoom", zoomCallback);
    };
  }, [map]);

  return { map, setMap, zoom, paddedBounds };
}; 