import { FC, useEffect, useState } from 'react';
import { LayerGroup, MapContainer, TileLayer } from 'react-leaflet';
import { LeafletEvent, Map as LeafletMap } from 'leaflet';
import { useElementSize } from 'usehooks-ts';

import { selectors, useAppSelector } from '~/store';
import { waypointData } from '~/data/map';

import { LocationMarkers } from './map-helpers/Markers';
import { Route } from './map-helpers/Route';
import { Player } from './map-helpers/Player';
import { DEFAULT_ZOOM, MAX_ZOOM, MIN_ZOOM } from './map-helpers/constants';

import './leaflet.css';
import { getPaddedBounds } from './map-helpers/utils';

const paddedBounds = getPaddedBounds(waypointData.bounds.topLeft, waypointData.bounds.bottomRight);

const PlayerMarkers = (props: { zoom: number }) => {
  const players = useAppSelector(selectors.player.selectPlayers);

  return players.map((player, i) => <Player key={i} player={player} zoom={props.zoom} />)
}

export const Map: FC = () => {
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
    map.on('zoom', zoomCallback);
  }, [map]);

  const [containerRef, { width, height }] = useElementSize();

  return <div ref={containerRef} style={{ height: '100%' }}>
    {height && (
      <div style={{ width, height }}>
        <MapContainer
          ref={(mapRef) => mapRef && setMap(mapRef)}
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
            // url="http://services.arcgisonline.com/arcgis/rest/services/NatGeo_World_Map/MapServer/tile/{z}/{y}/{x}" // Nat geo (rusty0)
            // url="http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png" // Positron
            // url="http://tile.stamen.com/toner/{z}/{x}/{y}.png" // Toner
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
