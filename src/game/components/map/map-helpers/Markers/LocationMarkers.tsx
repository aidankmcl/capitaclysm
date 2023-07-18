import { FC } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { Marker, Popup } from 'react-leaflet';
import { DivIcon } from 'leaflet';

import { locations } from '../../data/locations';
import { MarkerIcon } from './MarkerIcon';


export const LocationMarkers: FC<{ zoom: number }> = (props) => {
  return locations.map((location, i) => {
    const marker = renderToStaticMarkup(<MarkerIcon color={location.color} icon={location.icon} zoom={props.zoom} />);

    return location.position && (
      <Marker key={i} position={location.position} icon={new DivIcon({ html: marker })}>
        <Popup>
          <h4>{location.name}</h4>
        </Popup>
      </Marker>
    );
  });
};
