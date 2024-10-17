import { FC, useCallback, useEffect, useRef, useState} from 'react';

import { PlayerData } from '~/store';
import { useAnimationFrame, useOnce } from '~/components';

import { Coordinate } from '../data/locations';
import { getCoordsFromLocationIndex, getWaypointsBetweenLocations } from '../data/helpers';
import { PlayerMarker } from './Markers/PlayerMarker';


type PlayerProps = {
  player: PlayerData,
  zoom: number
}

export const Player: FC<PlayerProps> = (props) => {

  const prevLocation = useRef(props.player.locationIndex);

  const [shouldAnimate, setShouldAnimate] = useState(false);
  const [currentPos, setCurrentPos] = useState<Coordinate>();
  const [targetLocation, setTargetLocation] = useState<number>();
  const [remainingWaypoints, setRemainingWaypoints] = useState<Coordinate[]>([]);

  useOnce(() => {
    if (!currentPos) setCurrentPos(getCoordsFromLocationIndex(props.player.locationIndex));
  }, [props.player.locationIndex]);

  const nextAnimationFrameHandler = useCallback((percentComplete: number) => {
    if (percentComplete >= 1 && targetLocation) {
      setCurrentPos(remainingWaypoints[remainingWaypoints.length - 1]);
      prevLocation.current = targetLocation;
      setTargetLocation(undefined);
      setShouldAnimate(false);
    } else {
      const waypointIndex = Math.round(remainingWaypoints.length * percentComplete);
      setCurrentPos(remainingWaypoints[waypointIndex]);
    }
  }, [remainingWaypoints.length]);

  useAnimationFrame({
    nextAnimationFrameHandler,
    duration: 5000,
    shouldAnimate
  });

  useEffect(() => {
    if (targetLocation) {
      prevLocation.current = targetLocation;
    }
    setTargetLocation(props.player.locationIndex);
    if (prevLocation.current !== props.player.locationIndex) {
      const waypoints = getWaypointsBetweenLocations(prevLocation.current, props.player.locationIndex);
      setRemainingWaypoints(waypoints);
      setShouldAnimate(true);
    }
  }, [props.player.locationIndex]);

  return currentPos ? (
    <PlayerMarker
      position={currentPos}
      player={props.player}
      zoom={props.zoom}
    />
  ) : <></>;
};

