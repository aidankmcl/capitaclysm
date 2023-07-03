import { Coordinate } from './locations';

import waypointData from '../data/route.json';

type LineData = typeof waypointData['lines'][number] & {
  index: number;
}
type LinesByName = { [LocationName: string]: LineData }

const linesByName = waypointData.lines.reduce((acc, next, currentIndex) => {
  acc[next.name] = { ...next, index: currentIndex };
  return acc;
}, {} as LinesByName);

export const getLocationByDistance = (locationName: string, steps: number): string => {
  const startIndex = waypointData.lines.findIndex(line => line.name === locationName);
  const endIndex = ((startIndex + steps) % waypointData.lines.length) - 1;
  return waypointData.lines[endIndex].name;
};

export const getCoordsFromLocationName = (locationName: string): Coordinate => {
  const location = linesByName[locationName];

  return location.points[0] as Coordinate;
};

export const getWaypointsBetweenLocations = (startLocationName: string, endLocationName: string): Coordinate[] => {
  const startLocation = linesByName[startLocationName];
  const endLocation = linesByName[endLocationName];

  let waypoints = startLocation.points;

  let currentIndex = startLocation.index;
  const endIndex = endLocation.index;

  if (currentIndex === endIndex) return [];

  // if end index is before, means a loop is needed
  if (endIndex < currentIndex) {
    const lastPoint = waypointData.lines[waypointData.lines.length - 1];
    const remainderOfLoop = getWaypointsBetweenLocations(startLocationName, lastPoint.name);
    const startToTarget = getWaypointsBetweenLocations(waypointData.lines[0].name, endLocationName);
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
