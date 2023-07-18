import { Coordinate } from './locations';

import waypointData from './route.json';


export const getCoordsFromLocationIndex = (locationIndex: number): Coordinate => {
  return waypointData.lines[locationIndex].points[0] as Coordinate;
};

export const getWaypointsBetweenLocations = (startLocationIndex: number, endLocationIndex: number): Coordinate[] => {
  let waypoints = waypointData.lines[startLocationIndex].points;

  let currentIndex = startLocationIndex;
  const endIndex = endLocationIndex;

  if (currentIndex === endIndex) return [];

  // if end index is before, means a loop is needed
  if (endIndex < currentIndex) {
    const lastPoint = waypointData.lines[waypointData.lines.length - 1];
    const remainderOfLoop = getWaypointsBetweenLocations(startLocationIndex, waypointData.lines.length - 1);
    const startToTarget = getWaypointsBetweenLocations(0, endLocationIndex);
    return remainderOfLoop.concat(lastPoint.points as Coordinate[]).concat(startToTarget);
  } else {
    
    while (currentIndex < endIndex - 1) {
      currentIndex++;
      const nextLocation = waypointData.lines[currentIndex];
      waypoints = waypoints.concat(nextLocation.points);
    }
  
    return waypoints as Coordinate[];
  }
};
