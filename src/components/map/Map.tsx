import { FC, useRef } from "react";
import { LayerGroup, MapContainer, TileLayer } from "react-leaflet";
import { useResizeObserver } from "usehooks-ts";

import { selectors, useAppSelector } from "~/store";
import { useGameMap } from "~/hooks";

import { LocationMarkers } from "./map-helpers/Markers";
import { Route } from "./map-helpers/Route";
import { Player } from "./map-helpers/Player";
import { MAX_ZOOM, MIN_ZOOM } from "./map-helpers/constants";

import "./leaflet.css";

const PlayerMarkers = (props: { zoom: number }) => {
  const players = useAppSelector(selectors.players.selectPlayers);

  return players.map((player, i) => <Player key={i} player={player} zoom={props.zoom} />);
};

export const Map: FC = () => {
  const { map, setMap, zoom, paddedBounds } = useGameMap();
  
  const ref = useRef<HTMLDivElement>(null);
  // Default to 0 if the ref is not set
  const { width = 0, height = 0 } = useResizeObserver({
    ref: ref as React.RefObject<HTMLElement>,
    box: 'border-box',
  });

  return <div ref={ref} style={{ height: "100%" }}>
    {height && (
      <div style={{ width, height }}>
        <MapContainer
          ref={setMap}
          center={[32.81, -96.75]}
          maxBoundsViscosity={8}
          maxBounds={paddedBounds}
          maxZoom={MAX_ZOOM}
          bounceAtZoomLimits
          zoomSnap={0.25}
          zoomAnimation={true}
          touchZoom
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="http://services.arcgisonline.com/arcgis/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}" // Light Gray
            minNativeZoom={MIN_ZOOM + 1}
            maxNativeZoom={MAX_ZOOM}
          />

          <LayerGroup>
            <PlayerMarkers zoom={zoom} />
          </LayerGroup>

          <LayerGroup>
            <LocationMarkers zoom={zoom} />
          </LayerGroup>

          <LayerGroup>
            {map && <Route map={map} />}
          </LayerGroup>
        </MapContainer>
      </div>
    )}
  </div>;
};
