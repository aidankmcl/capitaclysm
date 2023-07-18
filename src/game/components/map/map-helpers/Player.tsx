import { FC, useEffect, useRef, useState} from 'react';

import { PlayerData } from '~/store';

import { Coordinate } from '../data/locations';
import { getCoordsFromLocationIndex, getWaypointsBetweenLocations } from '../data/helpers';
import { PlayerMarker } from './Markers/PlayerMarker';


type PlayerProps = {
  player: PlayerData,
  zoom: number
}

export const Player: FC<PlayerProps> = (props) => {

  const prevLocation = useRef(props.player.locationIndex);
  
  const [currentPos, setCurrentPos] = useState<Coordinate>(getCoordsFromLocationIndex(props.player.locationIndex));
  const [targetLocation, setTargetLocation] = useState<number>();
  const [remainingWaypoints, setRemainingWaypoints] = useState<Coordinate[]>([]);

  useEffect(() => {
    setTargetLocation(props.player.locationIndex);
    if (prevLocation.current !== props.player.locationIndex) {
      const waypoints = getWaypointsBetweenLocations(prevLocation.current, props.player.locationIndex);
      setRemainingWaypoints(waypoints);
    }
  }, [props.player.locationIndex]);

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

  return currentPos ? (
    <PlayerMarker position={currentPos} player={props.player} zoom={props.zoom} />
  ) : <></>;
};

