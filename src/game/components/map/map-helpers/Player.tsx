import { CSSProperties, FC, useEffect, useRef, useState} from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { Marker, Popup } from 'react-leaflet';
import { DivIcon } from 'leaflet';

import { Coordinate } from '../data/locations';

import styles from './Marker.module.css';
import { DEFAULT_ZOOM } from './constants';
import { PlayerData } from 'src/game/store/slices/player';
import { getCoordsFromLocationName, getWaypointsBetweenLocations } from '../data/helpers';


const getIcon = (type: PlayerData['icon']) => {
  switch (type) {
    case 'car':
      return <i className={`fi fi-bs-car ${styles.markerIcon}`}></i>;
    default:
      return <i className={`fi fi-ss-house-chimney ${styles.markerIcon}`}></i>;
  }
};

const DEFAULT_MARKER_FONT = 18;

const PlayerIcon: FC<{ color: string, icon: PlayerData['icon'], zoom: number }> = (props) => {
  const scaledFont = DEFAULT_MARKER_FONT + ((props.zoom - DEFAULT_ZOOM) * 10);
  return <div className={styles.marker} style={{ '--property-color': props.color, fontSize: scaledFont } as CSSProperties}>
    {getIcon(props.icon)}
  </div>;
};


type PlayerProps = {
  player: PlayerData,
  zoom: number
}

const LeafletPlayer: FC<PlayerProps> = (props) => {

  const prevLocation = useRef(props.player.location);
  
  const marker = renderToStaticMarkup(<PlayerIcon color={'blue'} icon={'car'} zoom={props.zoom} />);

  const [currentPos, setCurrentPos] = useState<Coordinate>(getCoordsFromLocationName(props.player.location));
  const [targetLocation, setTargetLocation] = useState<string>();
  const [remainingWaypoints, setRemainingWaypoints] = useState<Coordinate[]>([]);

  useEffect(() => {
    setTargetLocation(props.player.location);
    if (prevLocation.current !== props.player.location) {
      const waypoints = getWaypointsBetweenLocations(prevLocation.current, props.player.location);
      setRemainingWaypoints(waypoints);
    }
  }, [props.player.location]);

  useEffect(() => {
    if (remainingWaypoints.length) {
      setCurrentPos(remainingWaypoints[0]);
      setTimeout(() => {
        setRemainingWaypoints((waypoints) => waypoints.slice(1));
      }, 20);
    } else if (targetLocation) {
      prevLocation.current = targetLocation;
      setTargetLocation(undefined);
    }
  }, [remainingWaypoints, targetLocation]);

  return currentPos ?(
    <Marker zIndexOffset={2} position={currentPos} icon={new DivIcon({ html: marker })}>
      <Popup>
        {props.player.name}
      </Popup>
    </Marker>
  ) : <></>;
};

type WrapperProps = {
  players: PlayerData[],
  zoom: number
}


export const LeafletPlayers: FC<WrapperProps> = (props) => {
  const { players, zoom } = props;

  return players.map((player, i) => <LeafletPlayer key={i} player={player} zoom={zoom} />);
};
