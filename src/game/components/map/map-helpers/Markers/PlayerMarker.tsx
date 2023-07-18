import { FC } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { Marker, Popup } from 'react-leaflet';
import { DivIcon } from 'leaflet';

import { PlayerData, selectors, useAppSelector } from '~/store';
import { Avatar } from '~/components';

import { Coordinate } from '../../data/locations';
import { scaleFont } from '../utils';


type PlayerMarkerProps = {
  player: PlayerData,
  zoom: number,
  position: Coordinate
}

export const PlayerMarker: FC<PlayerMarkerProps> = (props) => {
  const activePlayerID = useAppSelector(selectors.player.selectActivePlayerID);

  const fontSize = Math.round(scaleFont(props.zoom) * 0.5);
  const marker = renderToStaticMarkup(<Avatar player={props.player} fontSize={fontSize} center activePlayerID={activePlayerID} />);
  
  return (
    <Marker zIndexOffset={100} position={props.position} icon={new DivIcon({ html: marker, iconAnchor: [-fontSize / 2, 0] })}>
      <Popup>
        {props.player.name}
      </Popup>
    </Marker>
  );
};
