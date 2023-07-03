import { FC, useEffect, useState } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { LayerGroup, MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';
import { DivIcon, LeafletEvent, Map as LeafletMap } from 'leaflet';

import { selectors, useAppDispatch, useAppSelector } from '~/store';

import { locations } from './data/locations';
import { MarkerIcon } from './map-helpers/Marker';
import { Route } from './map-helpers/Route';
import { LeafletPlayers } from './map-helpers/Player';
import { DEFAULT_ZOOM } from './map-helpers/constants';

import './leaflet.css';

const MapTiles: FC<{ leaflet: LeafletMap | null }> = (props) => {
  const [zoom, setZoom] = useState(DEFAULT_ZOOM);

  const players = useAppSelector(selectors.player.selectPlayers);
  const dispatch = useAppDispatch();

  console.log('players changed', players);

  const map = props.leaflet;

  useEffect(() => {
    if (!map) return;

    // const clickCallback = () => {
    //   dispatch(actions.game.addPlayers)
    // }
    // map.on('mousedown', clickCallback);

    const zoomCallback = (event: LeafletEvent) => setZoom(event.target._zoom);
    map.on('zoom', zoomCallback);
  }, [map, dispatch]);

  return (
    <>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="http://services.arcgisonline.com/arcgis/rest/services/NatGeo_World_Map/MapServer/tile/{z}/{y}/{x}"
      />

      <LayerGroup>
        <LeafletPlayers players={players} zoom={zoom} />
      </LayerGroup>

      <LayerGroup>
        {locations.map((location, i) => {
          const marker = renderToStaticMarkup(<MarkerIcon color={location.color} icon={location.icon} zoom={zoom} />);

          return location.position && (
            <Marker key={i} position={location.position} icon={new DivIcon({ html: marker })}>
              <Popup>
                {location.name}
              </Popup>
            </Marker>
          );
        })}
        {map && <Route map={map} />}
      </LayerGroup>
    </>
  );
};

export const Map: FC = () => {
  const [map, setMap] = useState<LeafletMap | null>(null);

  return <div style={{ height: '1000px', width: '1000px' }}>
    <MapContainer
      ref={(mapRef) => mapRef && setMap(mapRef)}
      center={[32.81, -96.75]}
      maxBoundsViscosity={8}
      maxBounds={[[32.73, -96.83], [32.87, -96.67]]}
      maxZoom={16}
      minZoom={DEFAULT_ZOOM}
      bounceAtZoomLimits
      zoom={DEFAULT_ZOOM}
      scrollWheelZoom
      touchZoom
    >
      <MapTiles leaflet={map} />
    </MapContainer>
  </div>;
};
