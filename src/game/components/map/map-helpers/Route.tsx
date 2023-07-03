import { FC } from 'react';
import L, { Map } from 'leaflet';
import { Polyline } from 'react-leaflet';

import waypointData from '../data/route.json';

type Props = {
  map: Map
}

const DEFAULT_GRAY = '#666';

export const Route: FC<Props> = () => {
  let color = DEFAULT_GRAY; // Default gray
  return waypointData.lines.map((line, i) => {
    const positions = line.points.map(point => new L.LatLng(point[0], point[1]));
    const nextSpot = waypointData.lines[i + 1];
    const leapFrogSpot = waypointData.lines[i + 2];

    if (line.type === 'property') {
      if (nextSpot && nextSpot.type !== 'property') {
        color = leapFrogSpot && leapFrogSpot.type === 'property' && leapFrogSpot.color === line.color ? line.color : DEFAULT_GRAY;
      } else if (nextSpot) {
        color = line.color;
      }
    }
    return <Polyline key={i} positions={positions} color={color} weight={15} opacity={0.8} />;
  });
};
