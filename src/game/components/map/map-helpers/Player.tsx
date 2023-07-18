import { FC, useEffect, useRef, useState} from 'react';

import { PlayerData } from '~/store';

import { Coordinate } from '../data/locations';
import { getCoordsFromLocationIndex, getWaypointsBetweenLocations } from '../data/helpers';
import { PlayerMarker } from './Markers/PlayerMarker';
import { useOnce } from '~/components';


type PlayerProps = {
  player: PlayerData,
  zoom: number
}

export const Player: FC<PlayerProps> = (props) => {

  const prevLocation = useRef(props.player.locationIndex);
  
  const [currentPos, setCurrentPos] = useState<Coordinate>();
  const [targetLocation, setTargetLocation] = useState<number>();
  const [remainingWaypoints, setRemainingWaypoints] = useState<Coordinate[]>([]);

  useOnce(() => {
    if (!currentPos) setCurrentPos(getCoordsFromLocationIndex(props.player.locationIndex))
  }, [props.player.locationIndex])

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
      }, 10);

      if (remainingWaypoints.length === 1 && targetLocation !== undefined) {
        prevLocation.current = targetLocation;
        setTargetLocation(undefined);
      }
    }
  }, [remainingWaypoints, targetLocation]);

  return currentPos ? (
    <PlayerMarker
      position={currentPos}
      player={props.player}
      zoom={props.zoom}
    />
  ) : <></>;
};

