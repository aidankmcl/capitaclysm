import { FC } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { Marker, Popup } from 'react-leaflet';
import { DivIcon } from 'leaflet';

import { PlayerData } from '~/store';
import { Avatar } from '~/components';

import { Coordinate } from '../../data/locations';
import { scaleFont } from '../utils';



type PlayerMarkerProps = {
  player: PlayerData,
  zoom: number,
  position: Coordinate
}

export const PlayerMarker: FC<PlayerMarkerProps> = (props) => {
  const marker = renderToStaticMarkup(<Avatar player={props.player} fontSize={scaleFont(props.zoom)} center />);
  
  return (
    <Marker zIndexOffset={100} position={props.position} icon={new DivIcon({ html: marker, iconAnchor: [0, 0] })}>
      <Popup>
        {props.player.name}
      </Popup>
    </Marker>
  );
};
